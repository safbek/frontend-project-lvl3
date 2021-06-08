import i18next from 'i18next';

// RENDER **************************************************
const renderFeed = (container, feeds) => {
  const feedsContainer = container;
  const div = document.createElement('div');
  div.classList.add('col-md-10', 'col-lg-8', 'mx-auto', 'feeds');

  const h2 = document.createElement('h2');
  h2.textContent = i18next.t('feeds');

  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'mb-5');

  const reversedFeeds = feeds.reverse();

  reversedFeeds.forEach((feed) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item');

    const h3 = document.createElement('h2');
    h3.textContent = feed.title;

    const p = document.createElement('p');
    p.textContent = feed.description;
    li.appendChild(h3);
    li.appendChild(p);
    ul.appendChild(li);
  });

  const fragment = document.createDocumentFragment();
  fragment.appendChild(div);
  fragment.appendChild(h2);
  fragment.appendChild(ul);
  feedsContainer.innerHTML = '';
  feedsContainer.appendChild(fragment);
};

const renderPosts = (container, posts) => {
  const postsContainer = container;
  const div = document.createElement('div');
  div.classList.add('col-md-10', 'col-lg-8', 'mx-auto', 'feeds');

  const h2 = document.createElement('h2');
  h2.textContent = i18next.t('feeds');

  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'mb-5');

  const reversedPosts = posts.reverse();

  reversedPosts.forEach((post) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item');

    const a = document.createElement('a');
    a.textContent = post.title;
    a.href = post.link;

    li.appendChild(a);
    ul.appendChild(li);
  });

  const fragment = document.createDocumentFragment();
  fragment.appendChild(div);
  fragment.appendChild(h2);
  fragment.appendChild(ul);
  postsContainer.innerHTML = '';
  postsContainer.appendChild(fragment);
};

const render = (path, value) => {
  const feedback = document.querySelector('.feedback');
  const feeds = document.querySelector('.feeds');
  const posts = document.querySelector('.posts');
  const form = document.querySelector('.form-control');

  // вынести стили в css.Создать классы danger, success
  if (path === 'validationState.valid') {
    // console.log(value);
    // feedback.textContent = value[value.length - 1];
    if (!value) {
      console.log('haaaaa')
      feedback.classList.remove('text-success');
      feedback.classList.add('text-danger');
    }
    // feedback.innerHTML = 'обработать ошибку';
  }

  if (path === 'updates.feeds') {
    // console.log(value);
    form.value = '';
    form.focus();
    form.classList.remove('is-invalid');
    feedback.classList.remove('text-danger');
    feedback.classList.add('text-success');
    feedback.textContent = i18next.t('rssAddedSuccessfully');
    renderFeed(feeds, value);
  }

  if (path === 'updates.posts') {
    // console.log(value);
    // feedback.textContent = 'Rss';
    renderPosts(posts, value);
  }
};

export default render;
