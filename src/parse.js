const parse = (xml) => {
  const channel = xml.querySelector('channel');
  const title = channel.querySelector('title').textContent;
  const description = channel.querySelector('description').textContent;
  const link = channel.querySelector('link').textContent;

  const elements = channel.querySelectorAll('item');
  const items = [...elements].map((element) => {
    const titleItem = element.querySelector('title').textContent;
    const linkItem = element.querySelector('link').textContent;
    return { titleItem, linkItem };
  });
  return {
    title, description, link, items,
  };
};

export default parse;
