const contextProperties = require('../contextProperties')

const getHeaders = (context, resultsLimit) => {
  const paginationHeaders = contextProperties.getRequestPagination(context)
  const accessToken = contextProperties.getAccessToken(context)
  const customHeaders = contextProperties.getCustomRequestHeaders(context)

  return {
    ...customHeaders,
    ...paginationHeaders,
    ...(resultsLimit && { 'page-limit': resultsLimit.toString() }),
    ...(accessToken && { authorization: `Bearer ${accessToken}` }),
  }
}

module.exports = {
  getHeaders,
}
