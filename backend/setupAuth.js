const express = require('express')
const passport = require('passport')
const flash = require('connect-flash')
const Sentry = require('@sentry/node')
const tokenRefresherFactory = require('./tokenRefresher').factory
const sessionManagementRoutes = require('./sessionManagementRoutes')
const auth = require('./auth')
const config = require('./config')

const router = express.Router()

module.exports = ({ oauthApi, tokenVerificationApi }) => {
  auth.init()
  const tokenRefresher = tokenRefresherFactory(oauthApi.refresh, config.app.tokenRefreshThresholdSeconds)

  router.use(passport.initialize())
  router.use(passport.session())
  router.use(flash())

  /* login, logout, token refresh etc */
  sessionManagementRoutes.configureRoutes({
    app: router,
    tokenRefresher,
    tokenVerifier: tokenVerificationApi.verifyToken,
    mailTo: config.app.mailTo,
    homeLink: config.app.notmEndpointUrl,
  })

  router.use((req, res, next) => {
    if (req.isAuthenticated()) Sentry.setUser({ username: req.user.username })
    res.locals.user = req.user
    next()
  })

  return router
}
