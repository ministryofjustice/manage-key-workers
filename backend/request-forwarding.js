const { logger } = require('./log')
const contextProperties = require('./contextProperties')
const errorStatusCode = require('./error-status-code')

const extractRequestPaginationMiddleware = (req, res, next) => {
  contextProperties.setRequestPagination(res.locals, req.headers)
  next()
}

const setPagingHeaders = (context, res) => {
  res.set(contextProperties.getResponsePagination(context))
}

const sendJsonResponse = (res) => (data) => {
  setPagingHeaders(res.locals, res)
  res.json(data)
}

const handleErrors = (res) => (error) => {
  logger.error(error)

  res.status(errorStatusCode(error))

  if (error.response && error.response.body) {
    res.json({
      message: error.response.body.userMessage,
    })
  } else {
    res.end()
  }
}

const forwardingHandlerFactory =
  (elite2Api) =>
  /**
   * Forward the incoming request using the elite2Api get and post functions.
   * @param req
   * @param res
   * @returns {*}
   */
  (req, res) => {
    // const sendJsonResponse = data => {
    //   setPagingHeaders(res.locals, res);
    //   res.json(data);
    // };

    const theUrl = `/api${req.url}`

    switch (req.method) {
      case 'GET':
        return elite2Api.get(res.locals, theUrl).then(sendJsonResponse(res)).catch(handleErrors(res))

      case 'POST':
        return elite2Api.post(res.locals, theUrl, req.body).then(sendJsonResponse(res)).catch(handleErrors(res))

      case 'PUT':
        return elite2Api.put(res.locals, theUrl, req.body).then(sendJsonResponse(res)).catch(handleErrors())

      default:
        throw new Error(`Unsupported request method ${req.method}`)
    }
  }

module.exports = {
  extractRequestPaginationMiddleware,
  forwardingHandlerFactory,
}
