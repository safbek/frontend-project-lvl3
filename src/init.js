import 'bootstrap/dist/js/bootstrap.js';

import i18next from 'i18next';
import ru from './dictionaries';

import fetchFeeds from './view';
// import render from './render';
import watcher from './render';

import handleFullPost from './handleFullPost';
import getModal from './getModal';

// const onChange = require('on-change');

const init = async () => {
  // await i18next.init({
  //   lng: 'ru',
  //   resources: { ru },
  // });

  const newInstance = i18next.createInstance();
  newInstance.init({
    lng: 'ru',
    resources: { ru },
    debug: true,
  }, (err, t) => {
    if (err) return console.log('something went wrong loading', err);
    return t('key');
  });

  const state = {
    validationState: {
      valid: null,
      state: 'filling',
    },
    updates: {
      feeds: [],
      posts: [],
    },
    uiState: {
      openPosts: new Set(),
    },
  };

  // console.log(state);

  // const watchedState = onChange(state, render);
  const watchedState = watcher(newInstance, state);

  const form = document.querySelector('.rss-form');
  if (form) {
    form.addEventListener('submit', fetchFeeds(watchedState, newInstance));
  }
  handleFullPost(watchedState);
  getModal(watchedState);
};

export default init;
