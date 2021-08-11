import onChange from 'on-change';

// RENDER **************************************************
const renderFeed = (container, feeds, i18Instance) => {
  const feedsContainer = container;
  const div = document.createElement('div');
  div.classList.add('col-md-10', 'col-lg-8', 'mx-auto', 'feeds');

  const h2 = document.createElement('h2');
  h2.textContent = i18Instance.t('feeds');

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

const renderPosts = (container, posts, i18Instance) => {
  const postsContainer = container;
  const div = document.createElement('div');
  div.classList.add('col-md-10', 'col-lg-8', 'mx-auto', 'feeds');

  const h2 = document.createElement('h2');
  h2.textContent = i18Instance.t('posts');

  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'mb-5');

  const reversedPosts = posts.reverse().flat();

  reversedPosts.forEach((post) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

    const a = document.createElement('a');
    a.setAttribute('data-id', post.id);
    a.setAttribute('target', 'blank');
    a.textContent = post.postTitle;
    a.href = post.postLink;
    a.classList.add('fw-bold');

    const button = document.createElement('button');
    button.classList.add('btn', 'btn-post-preview', 'btn-outline-primary', 'btn-sm');
    button.setAttribute('data-id', post.id);
    button.setAttribute('type', 'button');
    button.setAttribute('data-toggle', 'modal');
    button.setAttribute('data-target', '#myModal');
    button.textContent = i18Instance.t('view');

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

const watcher = (i18Instance, state, feeds, posts) => onChange(state, (path, value) => {
  const feedback = document.querySelector('.feedback');
  const form = document.querySelector('.form-control');

  switch (path) {
    case 'validationState.valid': {
      if (value) {
        feedback.classList.add('text-success');
        feedback.classList.remove('text-danger');
        form.value = '';
        form.focus();
        form.classList.remove('is-invalid');
      } else {
        feedback.classList.remove('text-success');
        feedback.classList.add('text-danger');
      }
      break;
    }
    case 'validationState.state': {
      const href = document.querySelector('.url');
      const addBtn = document.querySelector('.btn-add');
      if (value === 'filling') {
        href.readOnly = false;
        addBtn.removeAttribute('disabled');
      } else {
        href.readOnly = true;
        addBtn.setAttribute('disabled', 'disabled');
      }
      break;
    }
    case 'uiState.openPosts': {
      const links = document.querySelectorAll('a');
      links.forEach((el) => {
        const post = el;
        const postId = el.dataset.id;
        if (value.has(postId)) {
          post.classList.remove('fw-bold');
          post.classList.add('fw-normal');
          post.style.color = '#6c757d';
        }
      });
      break;
    }
    case 'updates.feeds': {
      renderFeed(feeds, value, i18Instance);
      break;
    }
    case 'updates.posts': {
      renderPosts(posts, value, i18Instance);
      break;
    }
    default: {
      break;
    }
  }
});

export default watcher;
