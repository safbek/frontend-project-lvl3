import _ from 'lodash';

const generateId = (parsedData, rssLink) => {
  const feed = {
    id: _.uniqueId(),
    title: parsedData.feedTitle,
    description: parsedData.feedDescription,
    rssLink,
  };
  const posts = parsedData.posts.reduce((acc, item) => {
    const post = {
      id: _.uniqueId(),
      ...item,
    };
    acc.push(post);
    return acc;
  }, []);

  return { feed, posts };
};

export default generateId;
