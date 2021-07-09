import '../node_modules/bootstrap/dist/css/bootstrap.css';
import './css/custom.css';

import '../node_modules/bootstrap/dist/js/bootstrap.js';

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
      valid: true,
    },
    updates: {
      feeds: [],
      posts: [],
    },
    uiState: {
      openPosts: [],
    },
  };

  const watchedState = onChange(state, render);

  const form = document.querySelector('.rss-form');
  form.addEventListener('submit', getSubmitHandler(watchedState));
  console.log(state);
};

export default init;
