import _ from 'lodash';
import parse from './parse';

const updatePosts = (axios, originalState, stateProxy) => {
  setTimeout(function update() {
    originalState.updates.feeds.forEach((feed) => {
      axios(feed.link)
        .then((response) => {
          const parsedData = parse(response.data);
          // console.log(parsedData);
          const newPostLinks = parsedData.posts.map((item) => item.postLink);
          // console.log(newPostLinks);
          const currentPostLinks = originalState.updates.posts
            .flat()
            .map((item) => item.postLink);

          const filtered = newPostLinks.filter((link) => !currentPostLinks.includes(link));

          const newPosts = parsedData.posts.filter((item) => filtered.includes(item.postLink));

          const newLinks = newPosts.reduce((acc, item) => {
            const post = {
            // id: index,
            // feedId: feed.id,
              id: _.uniqueId(),
              feedId: _.uniqueId(),
              title: item.postTitle,
              link: item.postLink,
            };
            console.log(post);
            acc.push(post);
            return acc;
          }, []);

          if (newLinks.length > 0 && !currentPostLinks.includes(newLinks.link)) {
            stateProxy.updates.posts.push(...newLinks);
          }
        });
    });
    setTimeout(update, 5000);
  }, 5000);
};

export default updatePosts;
