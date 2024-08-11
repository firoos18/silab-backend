function getImageUrl(protocol, host, announcement) {
  return `${protocol}://${host}/announcement/${announcement.id}/image`;
}

module.exports = getImageUrl;
