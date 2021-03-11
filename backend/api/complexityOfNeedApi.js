const contextProperties = require('../contextProperties')

const processError = (error) => {
  if (!error.response) throw error
  if (!error.response.status) throw error
  if (error.response.status !== 404) throw error // Not Found
  return null
}

const complexityOfNeedApiFactory = (client) => {
  const processResponse = (context) => (response) => {
    contextProperties.setResponsePagination(context, response.headers)
    return response.body
  }

  /* eslint-disable  no-unused-vars */
  const get = (context, url) => client.get(context, url).then(processResponse(context)).catch(processError)

  const post = (context, url, data) => client.post(context, url, data).then(processResponse(context))

  const getComplexOffenders = (context, offenders) =>
    post(context, '/v1/complexity-of-need/multiple/offender-no', offenders)

  return {
    getComplexOffenders,
  }
}

module.exports = {
  complexityOfNeedApiFactory,
}
