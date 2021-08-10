const getModal = ((state, posts) => {
  const stateProxy = state;

  // const posts = document.querySelector('.posts');

  posts.addEventListener('click', (e) => {
    const postId = e.target.dataset.id;
    if (postId) {
      const openedPost = stateProxy.updates.posts.flat().find((post) => post.id === postId);

      // to pass data into modal
      const modalTitle = document.querySelector('.modal-title');
      const modalBody = document.querySelector('.modal-body');
      modalTitle.textContent = openedPost.title;
      modalBody.textContent = openedPost.description;

      // // access to full article
      const fullArticleLink = document.querySelector('.full-article');
      fullArticleLink.setAttribute('href', openedPost.link);
    }
  });
});

export default getModal;
