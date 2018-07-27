require('dotenv').config();

// Do appinsights first as it does some magic instrumentation work, i.e. it affects other 'require's
// In particular, applicationinsights automatically collects bunyan logs
require('./azure-appinsights');

const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const bunyanMiddleware = require('bunyan-middleware');
const hsts = require('hsts');
const helmet = require('helmet');
const ensureHttps = require('./middleware/ensureHttps');

const userCaseLoadsFactory = require('./controllers/usercaseloads').userCaseloadsFactory;
const setActiveCaseLoadFactory = require('./controllers/setactivecaseload').activeCaseloadFactory;
const allocationServiceFactory = require('./services/allocationService').serviceFactory;
const userLocationsFactory = require('./controllers/userLocations').userLocationsFactory;
const allocationHistoryFactory = require('./controllers/allocationHistory').allocationHistoryFactory;
const manualOverrideFactory = require('./controllers/manualoverride').manualOverrideFactory;
const autoAllocateFactory = require('./controllers/autoAllocateConfirmWithOverride').factory;
const keyworkerSearchFactory = require('./controllers/keyworkerSearch').keyworkerSearchFactory;
const keyworkerProfileFactory = require('./controllers/keyworkerProfile').keyworkerProfileFactory;
const keyworkerUpdateFactory = require('./controllers/keyworkerUpdate').keyworkerUpdateFactory;
const userMeFactory = require('./controllers/userMe').userMeFactory;
const getConfiguration = require('./controllers/getConfig').getConfiguration;
const health = require('./controllers/health');

const sessionManagementRoutes = require('./sessionManagementRoutes');

const cookieOperationsFactory = require('./hmppsCookie').cookieOperationsFactory;
const tokenRefresherFactory = require('./tokenRefresher').factory;
const controllerFactory = require('./controllers/controller').factory;

const clientFactory = require('./api/oauthEnabledClient');
const healthApiFactory = require('./api/healthApi').healthApiFactory;
const eliteApiFactory = require('./api/elite2Api').elite2ApiFactory;
const keyworkerApiFactory = require('./api/keyworkerApi').keyworkerApiFactory;
const oauthApiFactory = require('./api/oauthApi');

const log = require('./log');
const config = require('./config');

const app = express();

const sixtyDaysInSeconds = 5184000;

app.set('trust proxy', 1); // trust first proxy

app.set('view engine', 'ejs');

app.use(helmet());

app.use(hsts({
  maxAge: sixtyDaysInSeconds,
  includeSubDomains: true,
  preload: true
}));

app.use(bunyanMiddleware({
  logger: log,
  obscureHeaders: ['Authorization']
}));

app.use('/health', health.router);
app.use('/info', health.router);

if (config.app.production) {
  app.use(ensureHttps);
}

app.use(cookieParser());

// Don't cache dynamic resources
app.use(helmet.noCache());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../public'), { index: 'dummy-file-which-doesnt-exist' })); // TODO: setting the index to false doesn't seem to work
app.use(express.static(path.join(__dirname, '../build'), { index: 'dummy-file-which-doesnt-exist' }));

app.get('/terms', async (req, res) => {
  res.render('terms', { mailTo: config.app.mailTo, homeLink: config.app.notmEndpointUrl });
});

const healthApi = healthApiFactory(
  clientFactory({
    baseUrl: config.apis.elite2.url,
    timeout: 2000
  }),
  clientFactory({
    baseUrl: config.apis.keyworker.url,
    timeout: 10000
  })
);

const elite2Api = eliteApiFactory(
  clientFactory({
    baseUrl: config.apis.elite2.url,
    timeout: 10000
  }));

const keyworkerApi = keyworkerApiFactory(
  clientFactory({
    baseUrl: config.apis.keyworker.url,
    timeout: 10000
  }));

const controller = controllerFactory(
  allocationServiceFactory(
    elite2Api,
    keyworkerApi,
    config.app.offenderSearchResultMax)
);

const oauthApi = oauthApiFactory({ ...config.apis.elite2 });
const tokenRefresher = tokenRefresherFactory(oauthApi.refresh, config.app.tokenRefreshThresholdSeconds);

const hmppsCookieOperations = cookieOperationsFactory(
  {
    name: config.hmppsCookie.name,
    domain: config.hmppsCookie.domain,
    cookieLifetimeInMinutes: config.hmppsCookie.expiryMinutes,
    secure: config.app.production
  },
);

/* login, logout, hmppsCookie management, token refresh etc */
sessionManagementRoutes.configureRoutes({
  app,
  healthApi,
  oauthApi,
  hmppsCookieOperations,
  tokenRefresher,
  mailTo: config.app.mailTo,
  homeLink: config.app.notmEndpointUrl
});

app.use('/api/config', getConfiguration);

app.use('/api/me', userMeFactory(elite2Api).userMe);
app.use('/api/usercaseloads', userCaseLoadsFactory(elite2Api).userCaseloads);
app.use('/api/setactivecaseload', setActiveCaseLoadFactory(elite2Api).setActiveCaseload);
app.use('/api/unallocated', controller.unallocated);
app.use('/api/allocated', controller.allocated);
app.use('/api/keyworkerAllocations', controller.keyworkerAllocations);
app.use('/api/searchOffenders', controller.searchOffenders);
app.use('/api/userLocations', userLocationsFactory(elite2Api).userLocations);
app.use('/api/allocationHistory', allocationHistoryFactory(keyworkerApi).allocationHistory);
app.use('/api/keyworker', keyworkerProfileFactory(keyworkerApi).keyworkerProfile);
app.use('/api/manualoverride', manualOverrideFactory(keyworkerApi).manualOverride);
app.use('/api/keyworkerSearch', keyworkerSearchFactory(keyworkerApi).keyworkerSearch);
app.use('/api/autoAllocateConfirmWithOverride', autoAllocateFactory(keyworkerApi).autoAllocate);
app.use('/api/keyworkerUpdate', keyworkerUpdateFactory(keyworkerApi).keyworkerUpdate);

// app.use('/api/config', getConfiguration);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

const port = process.env.PORT || 3001;

app.listen(port, function () {
  console.log('Backend running on port', port);
});
