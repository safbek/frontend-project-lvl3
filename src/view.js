import * as yup from 'yup';
import i18next from 'i18next';
import onChange from 'on-change';
import parse from './parse';

const axios = require('axios');

const generateId = (state, parsedData, link) => {
  const feed = {
    id: state.feeds.length,
    title: parsedData.title,
    description: parsedData.description,
    link,
  };
  const posts = parsedData.items.reduce((acc, item, index) => {
    const post = {
      id: state.posts.length + index,
      feedId: state.feeds.length,
      title: item.titleItem,
      description: item.postDescription,
      link: item.linkItem,
    };
    acc.push(post);
    return acc;
  }, []);

  return { feed, posts };
};

// HANDELER ****************************************************
const getSubmitHandler = ((state) => (event) => {
  const stateProxy = state;
  event.preventDefault();

  const rssLink = document.querySelector('.input-value').value;
  const feedback = document.querySelector('.feedback');

  const validUrlSchema = yup.string().url();
  const proxy = 'https://hexlet-allorigins.herokuapp.com';
  const parseXml = new DOMParser();
  const originalState = onChange.target(state);

  validUrlSchema.validate(rssLink)
    .then(() => axios(`${proxy}/get?disableCache=true&url=${rssLink}`))
    .then((response) => parseXml.parseFromString(response.data.contents, 'text/xml'))
    .then((data) => {
      if (data.getElementsByTagName('parsererror').length) {
        stateProxy.validationState.valid = false;
        feedback.textContent = i18next.t('parseError');
        return;
      }

      const parsedData = parse(data);
      const links = stateProxy.updates.feeds.map((item) => item.link);

      if (links.includes(rssLink)) {
        stateProxy.validationState.valid = false;
        feedback.textContent = i18next.t('rssAlreadyExists');
        return;
      }

      const generatedFeed = generateId(originalState.updates, parsedData, rssLink);
      const { feed } = generatedFeed;
      const { posts } = generatedFeed;

      stateProxy.updates.feeds.push(feed);
      stateProxy.updates.posts.push(...posts);

      const href = document.querySelectorAll('a');
      href.forEach((link) => {
        link.addEventListener('click', (el) => {
          const postId = Number(el.target.dataset.id);
          stateProxy.uiState.openPosts.push(postId);
        });
      });

      Array.from(document.getElementsByClassName('btn-post-preview')).forEach((button) => {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          const reviewPost = Number(e.target.dataset.id);
          const openedPost = originalState.updates.posts.filter((post) => post.id === reviewPost);

          // to pass data into modal
          const modalTitle = document.querySelector('.modal-title');
          const modalBody = document.querySelector('.modal-body');
          modalTitle.textContent = openedPost[0].title;
          modalBody.textContent = openedPost[0].description;

          // access to full article
          const fullArticleLink = document.querySelector('.full-article');
          fullArticleLink.setAttribute('href', openedPost[0].link);

          stateProxy.uiState.openPosts.push(openedPost[0].id);
        });
      });
    })
    .catch(() => {
      stateProxy.validationState.valid = false;
      const form = document.querySelector('.form-control');
      form.classList.add('is-invalid');
      feedback.textContent = i18next.t('url');
    })
    .finally(() => {
      setTimeout(function updatePosts() {
        originalState.updates.feeds.forEach((feed) => {
          axios(feed.link)
            .then((response) => parseXml.parseFromString(response.data, 'text/xml'))
            .then((data) => {
              const parsedData = parse(data);

              const newPostLinks = parsedData.items.map((item) => item.linkItem);
              const currentPostLinks = originalState.updates.posts.map((item) => item.link);
              const filtered = newPostLinks.filter((link) => !currentPostLinks.includes(link));

              const newPosts = parsedData.items.filter((item) => filtered.includes(item.linkItem));

              const newLinks = newPosts.reduce((acc, item, index) => {
                const post = {
                  id: index,
                  feedId: feed.id,
                  title: item.titleItem,
                  link: item.linkItem,
                };
                acc.push(post);
                return acc;
              }, []);

              if (newLinks.length > 0 && !currentPostLinks.includes(newLinks.link)) {
                stateProxy.updates.posts.push(...newLinks);
              }
            })
            .catch(() => {
              stateProxy.validationState.valid = false;
              feedback.textContent = i18next.t('networkError');
            });
        });
        setTimeout(updatePosts, 20000);
      }, 20000);
    });
});

export default getSubmitHandler;
