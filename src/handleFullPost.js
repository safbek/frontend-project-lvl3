const handleFullPost = ((state) => {
  const stateProxy = state;

  const posts = document.querySelector('.posts');

  posts.addEventListener('click', (e) => {
    const postId = e.target.dataset.id;
    if (postId) {
      const openedPost = stateProxy.updates.posts.flat().find((post) => post.id === postId);

      // // access to full article
      const fullArticleLink = document.querySelector('.full-article');
      fullArticleLink.setAttribute('href', openedPost.link);
      stateProxy.uiState.openPosts.add(openedPost.id);
    }
  });
});

export default handleFullPost;
