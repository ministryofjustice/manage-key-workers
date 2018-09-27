const contextProperties = require('../contextProperties');

const addAuthorizationHeader = (context, config) => {
  const accessToken = contextProperties.getAccessToken(context);
  if (accessToken) {
    config.headers = config.headers || {};
    config.headers.authorization = `Bearer ${accessToken}`;
  }
  return config;
};

/**
 * Don't like this, but the pagination information is being passed around in headers. If that information were
 * conveyed in request parameters or as part of the body of a request then this wouldn't be necessary.
 * @param context A request scoped context. Holds OAuth tokens and pagination information for the request
 * @param config
 * @returns {*}
 */
const addPaginationHeaders = (context, config) => {
  const paginationHeaders = contextProperties.getRequestPagination(context);
  config.headers = config.headers || {};
  Object.assign(config.headers, paginationHeaders);
  return config;
};

module.exports = {
  addAuthorizationHeader,
  addPaginationHeaders
};
