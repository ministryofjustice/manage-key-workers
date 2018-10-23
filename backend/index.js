require('dotenv').config()
// Do appinsights first as it does some magic instrumentation work, i.e. it affects other 'require's
// In particular, applicationinsights automatically collects bunyan logs
require('./azure-appinsights')
const path = require('path')
const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const bunyanMiddleware = require('bunyan-middleware')
const hsts = require('hsts')
const helmet = require('helmet')
const webpack = require('webpack')
const middleware = require('webpack-dev-middleware')
const hrm = require('webpack-hot-middleware')
const ensureHttps = require('./middleware/ensureHttps')
const requestForwarding = require('./request-forwarding')
const userCaseLoadsFactory = require('./controllers/usercaseloads').userCaseloadsFactory
const setActiveCaseLoadFactory = require('./controllers/setactivecaseload').activeCaseloadFactory
const allocationServiceFactory = require('./services/allocationService').serviceFactory
const { userLocationsFactory } = require('./controllers/userLocations')
const { allocationHistoryFactory } = require('./controllers/allocationHistory')
const { manualOverrideFactory } = require('./controllers/manualoverride')
const autoAllocateFactory = require('./controllers/autoAllocateConfirmWithOverride').factory
const { keyworkerSearchFactory } = require('./controllers/keyworkerSearch')
const { keyworkerProfileFactory } = require('./controllers/keyworkerProfile')
const { keyworkerUpdateFactory } = require('./controllers/keyworkerUpdate')
const { userMeFactory } = require('./controllers/userMe')
const { enableNewNomisFactory } = require('./controllers/enableNewNomis')
const { autoAllocationAndMigrateFactory } = require('./controllers/autoAllocationMigrate')
const { manualAllocationAndMigrateFactory } = require('./controllers/manualAllocationMigrate')
const { keyworkerSettingsFactory } = require('./controllers/keyworkerSettings')
const { getRolesFactory } = require('./controllers/getRoles')
const { getUserFactory } = require('./controllers/getUser')
const { removeRoleFactory } = require('./controllers/removeRole')
const { addRoleFactory } = require('./controllers/addRole')
const { contextUserRolesFactory } = require('./controllers/contextUserRoles')
const { userSearchFactory } = require('./controllers/userSearch')
const { getConfiguration } = require('./controllers/getConfig')
const { healthFactory } = require('./controllers/health')
const { keyworkerStatsFactory } = require('./controllers/keyworkerStats')

const sessionManagementRoutes = require('./sessionManagementRoutes')

const { cookieOperationsFactory } = require('./hmppsCookie')
const tokenRefresherFactory = require('./tokenRefresher').factory
const controllerFactory = require('./controllers/controller').factory

const clientFactory = require('./api/oauthEnabledClient')
const { healthApiFactory } = require('./api/healthApi')
const eliteApiFactory = require('./api/elite2Api').elite2ApiFactory
const { keyworkerApiFactory } = require('./api/keyworkerApi')
const oauthApiFactory = require('./api/oauthApi')

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

const { health } = healthFactory(config.apis.keyworker.url, config.apis.elite2.url)

app.use('/health', health)
app.use('/info', health)

if (config.app.production) {
  app.use(ensureHttps)
} else {
  config.setTestDefaults()
}

app.use(cookieParser())

// Don't cache dynamic resources
app.use(helmet.noCache())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, '../build/static')))

app.get('/terms', async (req, res) => {
  res.render('terms', { mailTo: config.app.mailTo, homeLink: config.app.notmEndpointUrl })
})

const healthApi = healthApiFactory(
  clientFactory({
    baseUrl: config.apis.elite2.url,
    timeout: 2000,
  }),
  clientFactory({
    baseUrl: config.apis.keyworker.url,
    timeout: 2000,
  })
)

const elite2Api = eliteApiFactory(
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

const controller = controllerFactory(
  allocationServiceFactory(elite2Api, keyworkerApi, config.app.offenderSearchResultMax)
)

const oauthApi = oauthApiFactory({ ...config.apis.oauth2 })
const tokenRefresher = tokenRefresherFactory(oauthApi.refresh, config.app.tokenRefreshThresholdSeconds)

const hmppsCookieOperations = cookieOperationsFactory({
  name: config.hmppsCookie.name,
  domain: config.hmppsCookie.domain,
  cookieLifetimeInMinutes: config.hmppsCookie.expiryMinutes,
  secure: config.app.production,
})

/* login, logout, hmppsCookie management, token refresh etc */
sessionManagementRoutes.configureRoutes({
  app,
  healthApi,
  oauthApi,
  hmppsCookieOperations,
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

app.use('/api/config', getConfiguration)
app.use('/api/me', userMeFactory(elite2Api, keyworkerApi).userMe)
app.use('/api/usercaseloads', userCaseLoadsFactory(elite2Api).userCaseloads)
app.use('/api/setactivecaseload', setActiveCaseLoadFactory(elite2Api).setActiveCaseload)
app.use('/api/unallocated', controller.unallocated)
app.use('/api/allocated', controller.allocated)
app.use('/api/keyworkerAllocations', controller.keyworkerAllocations)
app.use('/api/searchOffenders', controller.searchOffenders)
app.use('/api/userLocations', userLocationsFactory(elite2Api).userLocations)
app.use('/api/allocationHistory', allocationHistoryFactory(keyworkerApi).allocationHistory)
app.use('/api/keyworker', keyworkerProfileFactory(keyworkerApi).keyworkerProfile)
app.use('/api/manualoverride', manualOverrideFactory(keyworkerApi).manualOverride)
app.use('/api/keyworkerSearch', keyworkerSearchFactory(keyworkerApi).keyworkerSearch)
app.use('/api/autoAllocateConfirmWithOverride', autoAllocateFactory(keyworkerApi).autoAllocate)
app.use('/api/keyworkerUpdate', keyworkerUpdateFactory(keyworkerApi).keyworkerUpdate)
app.use('/api/enableNewNomis', enableNewNomisFactory(elite2Api).enableNewNomis)
app.use('/api/autoAllocateMigrate', autoAllocationAndMigrateFactory(keyworkerApi).enableAutoAllocationAndMigrate)
app.use('/api/manualAllocateMigrate', manualAllocationAndMigrateFactory(keyworkerApi).enableManualAllocationAndMigrate)
app.use('/api/keyworkerSettings', keyworkerSettingsFactory(keyworkerApi, elite2Api).keyworkerSettings)
app.use('/api/userSearch', userSearchFactory(elite2Api).userSearch)
app.use('/api/getRoles', getRolesFactory(elite2Api).getRoles)
app.use('/api/getUser', getUserFactory(elite2Api).getUser)
app.use('/api/removeRole', removeRoleFactory(elite2Api).removeRole)
app.use('/api/addRole', addRoleFactory(elite2Api).addRole)
app.use('/api/contextUserRoles', contextUserRolesFactory(elite2Api).contextUserRoles)
app.use('/api/keyworker-profile-stats', keyworkerStatsFactory(keyworkerApi).getStatsForStaffRoute)

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'))
})

const port = process.env.PORT || 3001

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log('Backend running on port', port)
})
