require('dotenv').config();

// Do appinsights first as it does some magic instrumentation work, i.e. it affects other 'require's
// In particular, applicationinsights automatically collects bunyan logs
require('./azure-appinsights');

const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const bunyanMiddleware = require('bunyan-middleware');
const hsts = require('hsts');
const helmet = require('helmet');
const ensureHttps = require('./middleware/ensureHttps');

const authentication = require('./controllers/authentication');
const userCaseLoads = require('./controllers/usercaseloads');
const setActiveCaseLoad = require('./controllers/setactivecaseload');
const unallocated = require('./controllers/unallocated');
const userLocations = require('./controllers/userLocations');
const searchOffenders = require('./controllers/searchOffenders');
const allocated = require('./controllers/allocated');
const manualoverride = require('./controllers/manualoverride');
const autoAllocateConfirmWithOverride = require('./controllers/autoAllocateConfirmWithOverride');
const keyworkerSearch = require('./controllers/keyworkerSearch');
const keyworkerAllocations = require('./controllers/keyworkerAllocations');
const keyworkerProfile = require('./controllers/keyworkerProfile');
const keyworkerUpdate = require('./controllers/keyworkerUpdate');
const userMe = require('./controllers/userMe');
const getConfig = require('./controllers/getConfig');
const health = require('./controllers/health');

const log = require('./log');
const config = require('./config');
const session = require('./session');

const app = express();

const sixtyDaysInSeconds = 5184000;
const sessionExpiryMinutes = config.session.expiryMinutes * 60 * 1000;

const sessionConfig = {
  name: config.session.name,
  secret: config.session.secret,
  sameSite: true,
  expires: new Date(Date.now() + sessionExpiryMinutes),
  maxAge: sessionExpiryMinutes
};

app.set('trust proxy', 1); // trust first proxy

// set the view engine to ejs
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

if (config.app.production) {
  app.use(ensureHttps);
}

app.use(cookieParser());
app.use(cookieSession(sessionConfig));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Update a value in the cookie so that the set-cookie will be sent.
// Only changes every minute so that it's not sent with every request.
app.use((req, res, next) => {
  req.session.nowInMinutes = session.getNowInMinutes();
  next();
});

app.use('/health', health);
app.use('/info', health);

app.use(express.static(path.join(__dirname, '../public'), { index: 'dummy-file-which-doesnt-exist' })); // TODO: setting the index to false doesn't seem to work
app.use(express.static(path.join(__dirname, '../build'), { index: 'dummy-file-which-doesnt-exist' }));

app.use('/auth', session.loginMiddleware, authentication);

app.use(session.hmppsSessionMiddleWare);
app.use(session.extendHmppsCookieMiddleWare);

app.use('/api/me', userMe);
app.use('/api/usercaseloads', userCaseLoads);
app.use('/api/setactivecaseload', setActiveCaseLoad);
app.use('/api/unallocated', unallocated.router);
app.use('/api/allocated', allocated.router);
app.use('/api/userLocations', userLocations);
app.use('/api/searchOffenders', searchOffenders.router);
app.use('/api/manualoverride', manualoverride);
app.use('/api/autoAllocateConfirmWithOverride', autoAllocateConfirmWithOverride);
app.use('/api/keyworkerSearch', keyworkerSearch);
app.use('/api/keyworker', keyworkerProfile.router);
app.use('/api/keyworkerUpdate', keyworkerUpdate);
app.use('/api/keyworkerAllocations', keyworkerAllocations.router);
app.use('/api/config', getConfig);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

const port = process.env.PORT || 3001;

app.listen(port, function () {
  console.log('Backend running on port', port);
});
