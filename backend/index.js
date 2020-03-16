require('dotenv').config()
// Do appinsights first as it does some magic instrumentation work, i.e. it affects other 'require's
// In particular, applicationinsights automatically collects bunyan logs
require('./azure-appinsights')
const path = require('path')
const express = require('express')
const passport = require('passport')
const bodyParser = require('body-parser')
const bunyanMiddleware = require('bunyan-middleware')
const hsts = require('hsts')
const helmet = require('helmet')
const webpack = require('webpack')
const middleware = require('webpack-dev-middleware')
const hrm = require('webpack-hot-middleware')
const flash = require('connect-flash')

const ensureHttps = require('./middleware/ensureHttps')
const requestForwarding = require('./request-forwarding')

const healthFactory = require('./services/healthCheck')

const sessionManagementRoutes = require('./sessionManagementRoutes')
const auth = require('./auth')

const tokenRefresherFactory = require('./tokenRefresher').factory

const clientFactory = require('./api/oauthEnabledClient')
const { elite2ApiFactory } = require('./api/elite2Api')
const { keyworkerApiFactory } = require('./api/keyworkerApi')
const { oauthApiFactory } = require('./api/oauthApi')

const configureRoutes = require('./routes')

const setupWebSession = require('./setupWebSession')

const log = require('./log')
const config = require('./config')

const app = express()

const sixtyDaysInSeconds = 5184000

app.set('trust proxy', 1) // trust first proxy

app.set('view engine', 'ejs')

app.use(helmet())

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

const health = healthFactory(config.apis.oauth2.url, config.apis.elite2.url, config.apis.keyworker.url)

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

app.use(express.static(path.join(__dirname, '../build/static')))

app.get('/terms', async (req, res) => {
  res.render('terms', { mailTo: config.app.mailTo, homeLink: config.app.notmEndpointUrl })
})

const elite2Api = elite2ApiFactory(
  clientFactory({
    baseUrl: config.apis.elite2.url,
    timeout: 1000 * config.apis.elite2.timeoutSeconds,
  })
)

const keyworkerApi = keyworkerApiFactory(
  clientFactory({
    baseUrl: config.apis.keyworker.url,
    timeout: 1000 * config.apis.keyworker.timeoutSeconds,
  })
)
const oauthApi = oauthApiFactory(
  clientFactory({
    baseUrl: config.apis.oauth2.url,
    timeout: config.apis.oauth2.timeoutSeconds * 1000,
  }),
  { ...config.apis.oauth2 }
)
auth.init(oauthApi)
const tokenRefresher = tokenRefresherFactory(oauthApi.refresh, config.app.tokenRefreshThresholdSeconds)

app.use(setupWebSession())

// Ensure cookie session is extended (once per minute) when user interacts with the server
app.use((req, res, next) => {
  // eslint-disable-next-line no-param-reassign
  req.session.nowInMinutes = Math.floor(Date.now() / 60e3)
  next()
})

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

/* login, logout, token refresh etc */
sessionManagementRoutes.configureRoutes({
  app,
  tokenRefresher,
  mailTo: config.app.mailTo,
  homeLink: config.app.notmEndpointUrl,
})

const compiler = webpack(require('../webpack.config.js'))

if (config.app.production === false) {
  app.use(middleware(compiler, { writeToDisk: true }))
  app.use(hrm(compiler, {}))
}

app.use(express.static(path.join(__dirname, '../build')))

// Extract pagination header information from requests and set on the 'context'
app.use('/api', requestForwarding.extractRequestPaginationMiddleware)

app.use(configureRoutes({ oauthApi, elite2Api, keyworkerApi }))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'))
})

app.listen(config.app.port, () => {
  // eslint-disable-next-line no-console
  console.log('Backend running on port', config.app.port)
})
