// @ts-check

import Example from './Example.js';

export default () => {
  const element = document.getElementById('point');
  element.style.color = 'red';
  const obj = new Example(element);
  obj.init();
};
