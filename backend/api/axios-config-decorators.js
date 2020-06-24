const contextProperties = require('../contextProperties')

const getHeaders = (context, resultsLimit) => {
  const paginationHeaders = contextProperties.getRequestPagination(context)
  const accessToken = contextProperties.getAccessToken(context)

  return {
    ...paginationHeaders,
    ...(resultsLimit && { 'page-limit': resultsLimit.toString() }),
    ...(accessToken && { authorization: `Bearer ${accessToken}` }),
  }
}

module.exports = {
  getHeaders,
}
