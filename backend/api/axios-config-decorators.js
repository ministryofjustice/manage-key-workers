const contextProperties = require('../contextProperties');

const addAuthorizationHeader = (context, config) => {
  const accessToken = contextProperties.getAccessToken(context);
  if (accessToken) {
    config.headers = config.headers || {};
    config.headers.authorization = `Bearer ${accessToken}`;
  }
  return config;
};

module.exports = {
  addAuthorizationHeader
};
