import * as yup from 'yup';
import i18next from 'i18next';
import onChange from 'on-change';
import parse from './parse';
import handlerFullPost from './handlerFullPost';

const axios = require('axios');

const generateId = (state, parsedData, link) => {
  const feed = {
    id: state.feeds.length,
    title: parsedData.title,
    description: parsedData.description,
    link,
  };
  const posts = parsedData.items.reduce((acc, item, index) => {
    const post = {
      id: state.posts.length + index,
      feedId: state.feeds.length,
      title: item.titleItem,
      description: item.postDescription,
      link: item.linkItem,
    };
    acc.push(post);
    return acc;
  }, []);

  return { feed, posts };
};

// HANDELER ****************************************************
const getSubmitHandler = ((state) => (event) => {
  const stateProxy = state;
  event.preventDefault();
  stateProxy.validationState.state = 'processing';

  const rssLink = document.querySelector('.input-value').value;
  const feedback = document.querySelector('.feedback');

  const links = stateProxy.updates.feeds.map((item) => item.link);

  const validUrlSchema = yup.string().url().notOneOf(links);
  const proxy = 'https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url';
  const parseXml = new DOMParser();
  const originalState = onChange.target(state);

  validUrlSchema.validate(rssLink)
    .then(() => axios(`${proxy}=${rssLink}`))
    .then((response) => parseXml.parseFromString(response.data.contents, 'text/xml'))
    .then((data) => {
      stateProxy.validationState.state = 'processing';
      if (data.getElementsByTagName('parsererror').length) {
        stateProxy.validationState.valid = false;
        feedback.textContent = i18next.t('parseError');
        return;
      }
      const parsedData = parse(data);

      const generatedFeed = generateId(originalState.updates, parsedData, rssLink);
      const { feed } = generatedFeed;
      const { posts } = generatedFeed;

      stateProxy.updates.feeds.push(feed);
      stateProxy.updates.posts.push(...posts);

      handlerFullPost(stateProxy);
      stateProxy.validationState.valid = true;
      // stateProxy.validationState.state = 'filling';
      feedback.textContent = i18next.t('rssAddedSuccessfully');
      stateProxy.validationState.state = 'filling';
    })
    .catch((e) => {
      // stateProxy.validationState.state = 'filling';
      stateProxy.validationState.valid = false;
      if (e.message === 'Network Error') {
        feedback.textContent = i18next.t('networkError');
        stateProxy.validationState.state = 'filling';
      } else if (e.message === 'this must be a valid URL') {
        const form = document.querySelector('.form-control');
        form.classList.add('is-invalid');
        stateProxy.validationState.state = 'filling';
        feedback.textContent = i18next.t('url');
      } else {
        feedback.textContent = i18next.t('rssAlreadyExists');
        stateProxy.validationState.state = 'filling';
      }
    })
    .finally(() => {
      stateProxy.validationState.state = 'filling';
      setTimeout(function updatePosts() {
        originalState.updates.feeds.forEach((feed) => {
          axios(feed.link)
            .then((response) => parseXml.parseFromString(response.data, 'text/xml'))
            .then((data) => {
              const parsedData = parse(data);

              const newPostLinks = parsedData.items.map((item) => item.linkItem);
              const currentPostLinks = originalState.updates.posts.map((item) => item.link);
              const filtered = newPostLinks.filter((link) => !currentPostLinks.includes(link));

              const newPosts = parsedData.items.filter((item) => filtered.includes(item.linkItem));

              const newLinks = newPosts.reduce((acc, item, index) => {
                const post = {
                  id: index,
                  feedId: feed.id,
                  title: item.titleItem,
                  link: item.linkItem,
                };
                acc.push(post);
                return acc;
              }, []);

              if (newLinks.length > 0 && !currentPostLinks.includes(newLinks.link)) {
                stateProxy.updates.posts.push(...newLinks);
              }
            });
        });
        setTimeout(updatePosts, 5000);
      }, 5000);
    });
});

export default getSubmitHandler;
