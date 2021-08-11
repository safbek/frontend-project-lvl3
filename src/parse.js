const parse = (response) => {
  const parseXml = new DOMParser();
  const xml = parseXml.parseFromString(response, 'text/xml');
  if (xml.getElementsByTagName('parsererror').length) {
    return false;
  }
  const channel = xml.querySelector('channel');
  const title = channel.querySelector('title').textContent;
  const description = channel.querySelector('description').textContent;
  const link = channel.querySelector('link').textContent;

  const elements = channel.querySelectorAll('item');

  const items = [...elements].map((element) => {
    const titleItem = element.querySelector('title').textContent;
    const linkItem = element.querySelector('link').textContent;
    const postDescription = element.querySelector('description').textContent;
    return { titleItem, linkItem, postDescription };
  });
  return {
    title, description, link, items,
  };
};

export default parse;
