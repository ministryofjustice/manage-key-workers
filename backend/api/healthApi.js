const healthApiFactory = (client) => {
  const isUp = () => client
    .get({}, 'health')
    .then(
      () => true,
      () => false);
  return {
    isUp
  };
};

module.exports = {
  healthApiFactory
};

