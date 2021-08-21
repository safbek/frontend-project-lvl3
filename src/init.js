import 'bootstrap/dist/js/bootstrap.js';

import i18next from 'i18next';
import ru from './dictionaries';

import fetchFeeds from './view';
import watcher from './render';
// import handleFullPost from './handleFullPost';
// import getModal from './getModal';

const init = async () => {
  const i18Instance = i18next.createInstance();
  await i18Instance.init({
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
      openModal: [],
    },
  };
  console.log(state);
  const form = document.querySelector('.rss-form');
  const feeds = document.querySelector('.feeds');
  const posts = document.querySelector('.posts');

  const watchedState = watcher(i18Instance, state, feeds, posts);

  if (form) {
    form.addEventListener('submit', fetchFeeds(watchedState, posts));
  }
  // handleFullPost(watchedState, posts);
  // getModal(watchedState, posts);
};

export default init;
