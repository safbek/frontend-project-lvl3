import * as yup from 'yup';
import _ from 'lodash';
import onChange from 'on-change';
import parse from './parse';
import updatePosts from './updatePosts';
import generateId from './generateId';

const axios = require('axios');

const validUrlSchema = (rssLink) => {
  const schema = yup.string().url();
  const promise = schema.validate(rssLink)
    .then(() => rssLink)
    .catch(() => {
      const error2 = new Error();
      error2.isValidationError = true;
      throw error2;
    });
  return promise;
};

// HANDELER ****************************************************
const fetchFeeds = ((state, i18Instance) => (event) => {
  const stateProxy = state;
  event.preventDefault();
  stateProxy.validationState.state = 'processing';

  const feedback = document.querySelector('.feedback');

  // const validUrlSchema = yup.string().url().notOneOf(links);
  const originalState = onChange.target(state);

  const rssLink = document.querySelector('.input-value').value;
  const proxy = new URL('https://hexlet-allorigins.herokuapp.com/get');
  proxy.searchParams.set('disableCache', 'true');
  proxy.searchParams.set('url', rssLink);

  const { href } = proxy;

  // const validUrlSchema = (rssLink3) => {
  //   const schema = yup.string().url();
  //   const link = rssLink3;
  //   const promise = schema.validate(link)
  //     .then(() => link)
  //     .catch(() => {
  //       const error2 = new Error();
  //       error2.isValidationError = true;
  //       throw error2;
  //     });
  //   return promise;
  // };

  validUrlSchema(rssLink)
    // .validate(rssLink)
    .then(() => {
      const links = stateProxy.updates.feeds.map((item) => item.link);
      if (links.includes(rssLink)) {
        const error1 = new Error();
        error1.isRssAlreadyExists = true;
        throw error1;
      }
      return axios(href);
    })
    .then((response) => {
      const data = parse(response.data.contents);
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
      return data;
    })
    .catch((e) => {
      console.log(e);
      stateProxy.validationState.valid = false;
      if (e.isParseError) {
        console.log('PARSEERROR');
        feedback.textContent = i18Instance.t('parseError');
      } else if (axios.isAxiosError(e)) {
        console.log('NETWORKERROR');
        feedback.textContent = i18Instance.t('networkError');
      } else if (e.isRssAlreadyExists) {
        console.log('ALREADYEXISTS');
        feedback.textContent = i18Instance.t('rssAlreadyExists');
      } else if (e.isValidationError) {
        console.log('VALIDATIONERROR');
        feedback.textContent = i18Instance.t('url');
        const form = document.querySelector('.form-control');
        form.classList.add('is-invalid');
        feedback.textContent = i18Instance.t('url');
      } else {
        console.log(e);
        throw new Error('unknown error');
      }
    })
    .finally(() => {
      stateProxy.validationState.state = 'filling';
    });
});

export default fetchFeeds;
