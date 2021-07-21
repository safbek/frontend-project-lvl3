import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import './css/custom.css';

import i18next from 'i18next';
import ru from './dictionaries';

import getSubmitHandler from './view';
import render from './render';

const onChange = require('on-change');

const init = async () => {
  await i18next.init({
    lng: 'ru',
    resources: { ru },
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
      openPosts: [],
    },
  };

  console.log(state)

  const watchedState = onChange(state, render);

  const form = document.querySelector('.rss-form');
  if (form) {
    form.addEventListener('submit', getSubmitHandler(watchedState));
  }
};

export default init;
