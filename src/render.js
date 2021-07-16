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
  h2.textContent = i18next.t('posts');

  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'mb-5');

  const reversedPosts = posts.reverse();

  reversedPosts.forEach((post) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

    const a = document.createElement('a');
    a.setAttribute('data-id', post.id);
    a.setAttribute('target', 'blank');
    a.textContent = post.title;
    a.href = post.link;
    a.classList.add('font-weight-bold');

    const button = document.createElement('button');
    button.classList.add('btn', 'btn-post-preview', 'btn-outline-primary', 'btn-sm');
    button.setAttribute('data-id', post.id);
    button.setAttribute('type', 'button');
    button.setAttribute('data-toggle', 'modal');
    button.setAttribute('data-target', '#myModal');
    button.textContent = i18next.t('view');

    li.appendChild(a);
    li.appendChild(button);
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
    if (!value) {
      feedback.classList.remove('text-success');
      feedback.classList.add('text-danger');
    }
  }

  if (path === 'validationState.state' && value === 'processing') {
    console.log(value);
    document.querySelector('.url').readOnly = true;
    document.querySelector('.btn-add').setAttribute('disabled', 'disabled');
    console.log(document.querySelector('.btn-add'));
  }

  if (path === 'validationState.state' && value === 'filling') {
    document.querySelector('.url').readOnly = false;
    document.querySelector('.btn-add').removeAttribute('disabled');
  }

  if (path === 'updates.feeds') {
    form.value = '';
    form.focus();
    form.classList.remove('is-invalid');
    feedback.classList.remove('text-danger');
    feedback.classList.add('text-success');
    feedback.textContent = i18next.t('rssAddedSuccessfully');
    renderFeed(feeds, value);
  }

  if (path === 'updates.posts') {
    renderPosts(posts, value);
  }

  if (path === 'uiState.openPosts') {
    const links = document.querySelectorAll('a');
    links.forEach((el) => {
      const post = el;
      const postId = Number(el.dataset.id);
      if (value.includes(postId)) {
        post.classList.add('font-weight-normal');
        post.style.color = '#6c757d';
      }
    });
  }
};

export default render;
