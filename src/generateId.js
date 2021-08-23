import _ from 'lodash';

const generateId = (parsedData, link) => {
  const feed = {
    id: _.uniqueId(),
    title: parsedData.title,
    description: parsedData.description,
    link,
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
