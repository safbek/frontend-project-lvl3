import * as yup from 'yup';
import parse from './parse';

const axios = require('axios');

const generateId = (state, parsedData, link) => {
  const feed = {
    id: state.length,
    title: parsedData.title,
    description: parsedData.description,
    link,
  };
  const posts = parsedData.items.reduce((acc, item, index) => {
    const post = {
      id: index,
      feedId: state.length,
      title: item.titleItem,
      link: item.linkItem,
    };
    acc.push(post);
    return acc;
  }, []);

  return { feed, posts };
};

// HANDELER ****************************************************
const getSubmitHandler = ((stateProxy) => (event) => {
  event.preventDefault();

  const rssLink = document.querySelector('.input-value').value;

  const validUrlSchema = yup.string().url();
  const proxy = 'https://hexlet-allorigins.herokuapp.com';
  const parseXml = new DOMParser();

  validUrlSchema.validate(rssLink)
    .then(() => axios(`${proxy}/get?url=${rssLink}`))
    .then((response) => parseXml.parseFromString(response.data.contents, 'text/xml'))
    .then((data) => {
      if (data.getElementsByTagName('parsererror').length) {
        stateProxy.validationState.errors.push('Ресурс не содержит валидный Rss');
        return;
      }

      const parsedData = parse(data);
      const links = stateProxy.updates.feeds.map((item) => item.link);

      if (links.includes(rssLink)) {
        stateProxy.validationState.errors.push('RSS уже существует');
        return;
      }

      const generatedFeed = generateId(stateProxy.updates.feeds, parsedData, rssLink);
      const { feed } = generatedFeed;
      const { posts } = generatedFeed;

      stateProxy.updates.feeds.push(feed);
      stateProxy.updates.posts.push(...posts);
    })
    .catch(() => {
      stateProxy.validationState.errors.push('Ссылка должна быть валидным URL');
      const form = document.querySelector('.form-control');
      form.classList.add('is-invalid');
    });
});

export default getSubmitHandler;
