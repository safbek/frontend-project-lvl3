const handlerFullPost = ((state) => {
  const stateProxy = state;

  const href = document.querySelectorAll('a');
  href.forEach((link) => {
    link.addEventListener('click', (el) => {
      const postId = Number(el.target.dataset.id);
      console.log(postId);
      stateProxy.uiState.openPosts.push(postId);
    });
  });

  Array.from(document.getElementsByClassName('btn-post-preview')).forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const reviewPost = Number(e.target.dataset.id);
      console.log(reviewPost);
      const openedPost = stateProxy.updates.posts.flat().filter((post) => post.id === reviewPost);

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
});

export default handlerFullPost;
