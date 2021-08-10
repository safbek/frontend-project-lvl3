const handleFullPost = ((state, posts) => {
  const stateProxy = state;

  // const posts = document.querySelector('.posts');

  posts.addEventListener('click', (e) => {
    const postId = e.target.dataset.id;
    if (postId) {
      const openedPost = stateProxy.updates.posts.flat().find((post) => post.id === postId);
      stateProxy.uiState.openPosts.add(openedPost.id);
    }
  });
});

export default handleFullPost;
