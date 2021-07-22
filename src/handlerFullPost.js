const handlerFullPost = ((state) => {
  const stateProxy = state;

  const href = document.querySelectorAll('a');
  href.forEach((link) => {
    link.addEventListener('click', (el) => {
      const postId = Number(el.target.dataset.id);
      console.log(postId);
      stateProxy.uiState.openPosts.add(postId);
    });
  });

  // Array.from(document.getElementsByClassName('btn-post-preview')).forEach((button) => {
  //   button.addEventListener('click', (e) => {
  //     e.preventDefault();
  //     const reviewPost = Number(e.target.dataset.id);
  //     console.log(reviewPost);
  //     const openedPost = stateProxy.updates.posts.flat().find((post) => post.id === reviewPost);

  //     // to pass data into modal
  //     const modalTitle = document.querySelector('.modal-title');
  //     const modalBody = document.querySelector('.modal-body');
  //     modalTitle.textContent = openedPost.title;
  //     modalBody.textContent = openedPost.description;

  //     // access to full article
  //     const fullArticleLink = document.querySelector('.full-article');
  //     fullArticleLink.setAttribute('href', openedPost.link);
  //     stateProxy.uiState.openPosts.add(openedPost.id);
  //   });
  // });

  const posts = document.querySelector('.posts');

  posts.addEventListener('click', (e) => {
    e.preventDefault();
    const reviewPost = Number(e.target.dataset.id);
    console.log(reviewPost);
    const openedPost = stateProxy.updates.posts.flat().find((post) => post.id === reviewPost);

    // to pass data into modal
    const modalTitle = document.querySelector('.modal-title');
    const modalBody = document.querySelector('.modal-body');
    modalTitle.textContent = openedPost.title;
    modalBody.textContent = openedPost.description;

    // access to full article
    const fullArticleLink = document.querySelector('.full-article');
    fullArticleLink.setAttribute('href', openedPost.link);
    stateProxy.uiState.openPosts.add(openedPost.id);
  });
});

export default handlerFullPost;
