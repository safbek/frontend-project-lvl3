const handlerFullPost = ((state) => {
  const stateProxy = state;
  // Есть ли в этом смысл?
  // const href = document.querySelectorAll('a');
  // href.forEach((link) => {
  //   link.addEventListener('click', (el) => {
  //     const postId = Number(el.target.dataset.id);
  //     stateProxy.uiState.openPosts.add(postId);
  //   });
  // });

  const posts = document.querySelector('.posts');

  posts.addEventListener('click', (e) => {
    console.log(e.target.dataset.id);
    const reviewPost = e.target.dataset.id;
    const openedPost = stateProxy.updates.posts.flat().find((post) => post.id === reviewPost);

    // to pass data into modal
    const modalTitle = document.querySelector('.modal-title');
    const modalBody = document.querySelector('.modal-body');
    modalTitle.textContent = openedPost.title;
    modalBody.textContent = openedPost.description;

    // // access to full article
    const fullArticleLink = document.querySelector('.full-article');
    fullArticleLink.setAttribute('href', openedPost.link);
    stateProxy.uiState.openPosts.add(openedPost.id);
  });
});

export default handlerFullPost;
