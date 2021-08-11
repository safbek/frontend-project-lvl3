const parse = (response) => {
  const parseXml = new DOMParser();
  const xml = parseXml.parseFromString(response, 'text/xml');
  if (xml.getElementsByTagName('parsererror').length) {
    return false;
  }
  const channel = xml.querySelector('channel');
  const feedTitle = channel.querySelector('title').textContent;
  const feedDescription = channel.querySelector('description').textContent;
  const feedLink = channel.querySelector('link').textContent;

  const elements = channel.querySelectorAll('item');

  const posts = [...elements].map((element) => {
    const postTitle = element.querySelector('title').textContent;
    const postLink = element.querySelector('link').textContent;
    const postDescription = element.querySelector('description').textContent;
    return { postTitle, postLink, postDescription };
  });
  return {
    feedTitle, feedDescription, feedLink, posts,
  };
};

export default parse;
