import _ from 'lodash';

const generateId = (parsedData, link) => {
  const feed = {
    id: _.uniqueId(),
    title: parsedData.feedTitle,
    description: parsedData.feedDescription,
    link,
  };
  // console.log(parsedData);
  // console.log(parsedData.posts);

  const posts = parsedData.posts.reduce((acc, item) => {
    // console.log(item);
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
