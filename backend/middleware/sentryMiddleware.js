const config = require('../config')

// Pass-through Sentry config into locals, for use in the Sentry loader script (see layout.njk)
module.exports = () => (_req, res, next) => {
  res.locals.sentry = config.sentry
  next()
}
