import crypto from 'crypto'

const express = require('express')
const helmet = require('helmet')
const config = require('./config')

const router = express.Router()

module.exports = () => {
  // Secure code best practice - see:
  // 1. https://expressjs.com/en/advanced/best-practice-security.html,
  // 2. https://www.npmjs.com/package/helmet
  router.use((_req, res, next) => {
    res.locals.cspNonce = crypto.randomBytes(16).toString('hex')
    next()
  })

  // This nonce allows us to use scripts with the use of the `cspNonce` local, e.g (in a Nunjucks template):
  // <script nonce="{{ cspNonce }}">
  // or
  // <link href="http://example.com/" rel="stylesheet" nonce="{{ cspNonce }}">
  // This ensures only scripts we trust are loaded, and not anything injected into the
  // page by an attacker.
  const scriptSrc = [
    "'self'",
    "'unsafe-inline'",
    'https://code.jquery.com/',
    (_req, res) => `'nonce-${res.locals.cspNonce}'`,
  ]
  const styleSrc = ["'self'", (_req, res) => `'nonce-${res.locals.cspNonce}'`]
  const fontSrc = ["'self'"]
  const imgSrc = ["'self'", 'data:']
  const formAction = [`'self' ${config.apis.oauth2.url}`]

  if (config.apis.frontendComponent.url) {
    scriptSrc.push(config.apis.frontendComponent.url)
    styleSrc.push(config.apis.frontendComponent.url)
    imgSrc.push(config.apis.frontendComponent.url)
    fontSrc.push(config.apis.frontendComponent.url)
  }

  router.use(helmet())
  router.use(
    helmet.contentSecurityPolicy({
      useDefaults: true,
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc,
        styleSrc,
        fontSrc,
        imgSrc,
        formAction,
      },
    })
  )
  return router
}
