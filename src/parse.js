const parse = (response) => {
  const parseXml = new DOMParser();
  const xml = parseXml.parseFromString(response, 'text/xml');
  if (xml.getElementsByTagName('parsererror').length) {
    const error = new Error();
    error.isParseError = true;
    throw error;
  }

  const channel = xml.querySelector('channel');
  const title = channel.querySelector('title').textContent;
  const description = channel.querySelector('description').textContent;
  const link = channel.querySelector('link').textContent;

  const elements = channel.querySelectorAll('item');
  const posts = [...elements].map((element) => {
    const itemTitle = element.querySelector('title').textContent;
    const itemLink = element.querySelector('link').textContent;
    const itemDescription = element.querySelector('description').textContent;
    return {
      title: itemTitle,
      link: itemLink,
      description: itemDescription,
    };
  });
  return {
    title, description, link, posts,
  };
};

export default parse;
