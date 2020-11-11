const { logError } = require('../logError')

const asyncMiddleware = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((error) => {
    // Note this is the final catch-all for backend errors
    logError(req.originalUrl, error, 'Error caught in asyncMiddleware')
    const data = error?.response?.body
    const errorStatusCode = data?.status || error?.response?.status || 500
    // eslint-disable-next-line camelcase
    const message = data?.userMessage || data?.error_description || error?.message || error?.response?.statusText

    res.status(errorStatusCode)

    if (message) {
      res.json(message)
    } else {
      res.end()
    }
  })
}

module.exports = asyncMiddleware
