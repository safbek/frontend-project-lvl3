import * as yup from 'yup';
import onChange from 'on-change';
import _ from 'lodash';
import parse from './parse';
import updatePosts from './updatePosts';

const axios = require('axios');

const generateId = (parsedData, link) => {
  const feed = {
    id: _.uniqueId(),
    title: parsedData.feedTitle,
    description: parsedData.feedDescription,
    link,
  };
  const posts = parsedData.posts.reduce((acc, item) => {
    const post = {
      id: _.uniqueId(),
      ...item,
    };
    acc.push(post);
    return acc;
  }, []);

  return { feed, posts };
};

// HANDELER ****************************************************
const fetchFeeds = ((state, i18Instance) => (event) => {
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
        feedback.textContent = i18Instance.t('parseError');
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
      feedback.textContent = i18Instance.t('rssAddedSuccessfully');
      stateProxy.validationState.state = 'filling';

      // download new posts
      updatePosts(axios, originalState, stateProxy);
    })
    .catch((e) => {
      stateProxy.validationState.valid = false;
      if (e.message === 'Network Error') {
        feedback.textContent = i18Instance.t('networkError');
      } else if (e.message === 'this must be a valid URL') {
        const form = document.querySelector('.form-control');
        form.classList.add('is-invalid');
        feedback.textContent = i18Instance.t('url');
      } else {
        feedback.textContent = i18Instance.t('rssAlreadyExists');
      }
    })
    .finally(() => {
      stateProxy.validationState.state = 'filling';
    });
});

export default fetchFeeds;
