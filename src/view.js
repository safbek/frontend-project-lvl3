import * as yup from 'yup';
import onChange from 'on-change';
import _ from 'lodash';
import parse from './parse';

const axios = require('axios');

const validUrlSchema = (rssLink) => {
  const schema = yup.string().url();
  const promise = schema.validate(rssLink)
    .then(() => rssLink)
    .catch((e) => {
      e.isValidationError = true;
      throw e;
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
        const error = new Error();
        error.isRssAlreadyExists = true;
        throw error;
      }
      return axios(href);
    })
    .then((response) => {
      const parsedData = parse(response.data.contents);

      stateProxy.validationState.state = 'processing';

      const feed = {
        id: _.uniqueId(),
        title: parsedData.title,
        description: parsedData.description,
        link: rssLink,
      };

      const posts = parsedData.items.reduce((acc, items) => {
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
      setTimeout(function update() {
        originalState.updates.feeds.forEach((itemFeed) => {
          const link = proxify(itemFeed.link);
          const proxifiedLink = link.href;

          axios(proxifiedLink)
            .then((res) => {
              const data = parse(res.data.contents);

              const postLinks = data.items.map((item) => item.link);
              const currentPostLinks = originalState.updates.posts.flat().map((item) => item.link);

              const newPostLinks = _.differenceBy(postLinks, currentPostLinks);

              const newLinks = newPostLinks.reduce((acc, item) => {
                const post = {
                  id: _.uniqueId(),
                  title: item.title,
                  link: item.link,
                };
                acc.push(post);
                return acc;
              }, []);

              if (newLinks.length > 0 && !currentPostLinks.includes(newLinks.link)) {
                stateProxy.updates.posts.push(...newLinks);
              }
            });
        });
        setTimeout(update, 5000);
      }, 5000);
      return parsedData;
    })
    .catch((e) => {
      if (e.isParseError) {
        stateProxy.validationState.valid = 'parseError';
      } else if (axios.isAxiosError(e)) {
        stateProxy.validationState.valid = 'networkError';
      } else if (e.isRssAlreadyExists) {
        stateProxy.validationState.valid = 'rssAlreadyExists';
      } else if (e.isValidationError) {
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
