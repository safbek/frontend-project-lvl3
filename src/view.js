import * as yup from 'yup';
import i18next from 'i18next';
import onChange from 'on-change';
import _ from 'lodash';
import parse from './parse';

const axios = require('axios');

const generateId = (parsedData, link) => {
  const feed = {
    id: _.uniqueId(),
    title: parsedData.title,
    description: parsedData.description,
    link,
  };
  const posts = parsedData.items.reduce((acc, item) => {
    const post = {
      id: _.uniqueId(),
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
const fetchFeeds = ((state) => (event) => {
  const stateProxy = state;
  event.preventDefault();
  stateProxy.validationState.state = 'processing';

  const feedback = document.querySelector('.feedback');

  const links = stateProxy.updates.feeds.map((item) => item.link);

  const validUrlSchema = yup.string().url().notOneOf(links);
  const originalState = onChange.target(state);

  const rssLink = document.querySelector('.input-value').value;
  const proxy = new URL('https://hexlet-allorigins.herokuapp.com/get');
  proxy.searchParams.set('disableCache', 'true');
  proxy.searchParams.set('url', rssLink);

  const { href } = proxy;

  validUrlSchema.validate(rssLink)
    .then(() => axios(href))
    .then((response) => {
      if (!parse(response.data.contents)) {
        stateProxy.validationState.valid = false;
        feedback.textContent = i18next.t('parseError');
      }
      return parse(response.data.contents);
    })
    .then((data) => {
      stateProxy.validationState.state = 'processing';

      const generatedFeed = generateId(data, rssLink);
      const { feed } = generatedFeed;
      const { posts } = generatedFeed;

      stateProxy.updates.feeds.push(feed);
      stateProxy.updates.posts.push(posts);

      stateProxy.validationState.valid = true;
      feedback.textContent = i18next.t('rssAddedSuccessfully');
      stateProxy.validationState.state = 'filling';
    })
    .catch((e) => {
      stateProxy.validationState.valid = false;
      if (e.message === 'Network Error') {
        feedback.textContent = i18next.t('networkError');
      } else if (e.message === 'this must be a valid URL') {
        const form = document.querySelector('.form-control');
        form.classList.add('is-invalid');
        feedback.textContent = i18next.t('url');
      } else {
        feedback.textContent = i18next.t('rssAlreadyExists');
      }
    })
    .finally(() => {
      stateProxy.validationState.state = 'filling';
      setTimeout(function updatePosts() {
        originalState.updates.feeds.forEach((feed) => {
          axios(feed.link)
            .then((response) => {
              const parsedData = parse(response.data);

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

export default fetchFeeds;
