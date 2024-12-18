import config from '../config'

export default function sentryMiddleware() {
  // Pass-through Sentry config into locals, for use in the Sentry loader script (see layout.njk)
  return (_req, res, next) => {
    res.locals.sentry = config.sentry
    return next()
  }
}
