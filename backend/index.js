require('dotenv').config()
// Do appinsights first as it does some magic instrumentation work, i.e. it affects other 'require's
// In particular, applicationinsights automatically collects bunyan logs
require('./azure-appinsights')

const express = require('express')
require('express-async-errors')

const bodyParser = require('body-parser')
const bunyanMiddleware = require('bunyan-middleware')
const hsts = require('hsts')
const helmet = require('helmet')
const apis = require('./apis')

const ensureHttps = require('./middleware/ensureHttps')
const errorHandler = require('./middleware/errorHandler')
const currentUser = require('./middleware/currentUser')

const healthFactory = require('./services/healthCheck')

const setupAuth = require('./setupAuth')
const setupWebSession = require('./setupWebSession')
const setupWebpackForDev = require('./setupWebpackForDev')
const setupNunjucks = require('./setupNunjucks')
const setupPhaseName = require('./setupPhaseName')
const setupStaticContent = require('./setupStaticContent')
const setupReactRoutes = require('./setupReactRoutes')

const pageNotFound = require('./pageNotFound')
const routes = require('./routes')
const requestForwarding = require('./request-forwarding')
const log = require('./log')
const config = require('./config')
const { logError } = require('./logError')

const app = express()

const sixtyDaysInSeconds = 5184000

app.set('trust proxy', 1) // trust first proxy
app.set('view engine', 'njk')

setupNunjucks(app)
setupPhaseName(app, config)

app.use(helmet())
app.use(setupStaticContent())
app.use(
  hsts({
    maxAge: sixtyDaysInSeconds,
    includeSubDomains: true,
    preload: true,
  })
)
app.use(
  bunyanMiddleware({
    logger: log,
    obscureHeaders: ['Authorization'],
  })
)

const health = healthFactory(
  config.apis.oauth2.url,
  config.apis.elite2.url,
  config.apis.keyworker.url,
  config.apis.tokenverification.url,
  config.apis.complexityOfNeed.url
)

app.get('/health', (req, res, next) => {
  health((err, result) => {
    if (err) {
      return next(err)
    }
    if (!(result.status === 'UP')) {
      res.status(503)
    }
    res.json(result)
    return result
  })
})

app.get('/ping', (req, res) => res.send('pong'))

if (config.app.production) {
  app.use(ensureHttps)
} else {
  config.setTestDefaults()
}

// Don't cache dynamic resources
app.use(helmet.noCache())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/terms', async (req, res) => {
  res.render('terms', { mailTo: config.app.mailTo, homeLink: config.app.notmEndpointUrl })
})

app.use(setupWebSession())
app.use(setupAuth({ oauthApi: apis.oauthApi, tokenVerificationApi: apis.tokenVerificationApi }))
app.use(currentUser({ prisonApi: apis.elite2Api, oauthApi: apis.oauthApi }))

// Ensure cookie session is extended (once per minute) when user interacts with the server
app.use((req, res, next) => {
  // eslint-disable-next-line no-param-reassign
  req.session.nowInMinutes = Math.floor(Date.now() / 60e3)
  next()
})
app.use(setupWebpackForDev())
// Extract pagination header information from requests and set on the 'context'
app.use('/api', requestForwarding.extractRequestPaginationMiddleware)

app.use(routes({ ...apis }))

app.use(setupReactRoutes())
app.use(pageNotFound)
app.use(errorHandler({ logError }))

app.listen(config.app.port, () => {
  // eslint-disable-next-line no-console
  console.log('Backend running on port', config.app.port)
})
