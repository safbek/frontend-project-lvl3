import '../node_modules/bootstrap/dist/css/bootstrap.css';
import './css/custom.css';

import getSubmitHandler from './view';
import render from './render';

const onChange = require('on-change');

const state = {
  validationState: {
    errors: [],
  },
  updates: {
    feeds: [],
    posts: [],
  },
};

const watchedState = onChange(state, render);

const form = document.querySelector('.rss-form');
form.addEventListener('submit', getSubmitHandler(watchedState));

console.log(state);
