import * as yup from 'yup';
import onChange from 'on-change';
import _ from 'lodash';
import parse from './parse';
import updatePosts from './updatePosts';

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

const handleFullPost = ((state, posts) => {
  posts.addEventListener('click', (e) => {
    const postId = e.target.dataset.id;
    if (postId) {
      const openedPost = state.updates.posts.flat().find((post) => post.id === postId);
      state.uiState.openPosts.add(openedPost.id);
    }
  });
});

const getModal = ((state, posts) => {
  const stateProxy = state;

  posts.addEventListener('click', (e) => {
    const postId = e.target.dataset.id;
    if (postId) {
      const openedPost = stateProxy.updates.posts.flat().find((post) => post.id === postId);
      stateProxy.uiState.openPosts.add(openedPost.id);

      stateProxy.uiState.openModal.push(openedPost);
    }
  });
});

const proxify = (rssLink) => {
  const proxy = new URL('https://hexlet-allorigins.herokuapp.com/get');
  proxy.searchParams.set('disableCache', 'true');
  proxy.searchParams.set('url', rssLink);
  return proxy;
};

// HANDELER ****************************************************
const fetchFeeds = ((state, postContainer) => (event) => {
  const stateProxy = state;
  event.preventDefault();
  stateProxy.validationState.state = 'processing';

  const originalState = onChange.target(state);

  const rssLink = document.querySelector('.input-value').value;

  const { href } = proxify(rssLink);

  handleFullPost(state, postContainer);
  getModal(state, postContainer);

  validUrlSchema(rssLink)
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
      const parsedData = parse(response.data.contents);
      stateProxy.validationState.state = 'processing';

      // const generatedFeed = generateId(data);
      // const { feed } = generatedFeed;
      // const { posts } = generatedFeed;
      const feed = {
        id: _.uniqueId(),
        title: parsedData.title,
        description: parsedData.description,
        link: parsedData.link,
      };

      const posts = parsedData.posts.reduce((acc, items) => {
        const post = {
          id: _.uniqueId(),
          ...items,
        };
        acc.push(post);
        return acc;
      }, []);

      stateProxy.updates.feeds.push(feed);
      stateProxy.updates.posts.push(posts);

      stateProxy.validationState.valid = 'rssAddedSuccessfully';
      stateProxy.validationState.state = 'filling';

      // download new posts
      updatePosts(axios, originalState, stateProxy);
      return parsedData;
    })
    .catch((e) => {
      if (e.isParseError) {
        // console.log('PARSEERROR');
        stateProxy.validationState.valid = 'parseError';
      } else if (axios.isAxiosError(e)) {
        // console.log('NETWORKERROR');
        stateProxy.validationState.valid = 'networkError';
      } else if (e.isRssAlreadyExists) {
        // console.log('ALREADYEXISTS');
        stateProxy.validationState.valid = 'rssAlreadyExists';
      } else if (e.isValidationError) {
        // console.log('VALIDATIONERROR');
        stateProxy.validationState.valid = 'url';
      } else {
        throw new Error('unknown error');
      }
    })
    .finally(() => {
      stateProxy.validationState.state = 'filling';
    });
});

export default fetchFeeds;
