require('dotenv').config();

// Do appinsights first as it does some magic instrumentation work, i.e. it affects other 'require's
// In particular, applicationinsights automatically collects bunyan logs
require('./azure-appinsights');
const path = require('path');
const fs = require('fs');
const express = require('express');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const bunyanMiddleware = require('bunyan-middleware');

const authentication = require('./controllers/authentication');
const userCaseLoads = require('./controllers/usercaseloads');
const setActiveCaseLoad = require('./controllers/setactivecaseload');
const unallocated = require('./controllers/unallocated');
const userLocations = require('./controllers/userLocations');
const searchOffenders = require('./controllers/searchOffenders');
const allocated = require('./controllers/allocated');
const manualoverride = require('./controllers/manualoverride');
const keyworkerSearch = require('./controllers/keyworkerSearch');
const keyworkerAllocations = require('./controllers/keyworkerAllocations');
const keyworkerProfile = require('./controllers/keyworkerProfile');

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
  maxAge: sessionExpiryMinutes // 1 hour
};

function getAppInfo () {
  const packageData = JSON.parse(fs.readFileSync('./package.json'));
  const buildVersion = fs.existsSync('./build-info.json') ? JSON.parse(fs.readFileSync('./build-info.json')).buildNumber : packageData.version;

  return {
    name: packageData.name,
    version: buildVersion,
    description: packageData.description
  };
}

app.set('trust proxy', 1); // trust first proxy

// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(bunyanMiddleware({
  logger: log,
  obscureHeaders: ['Authorization']
}));

app.use(cookieSession(sessionConfig));
app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session.hmppsSessionMiddleWare);

// Update a value in the cookie so that the set-cookie will be sent.
// Only changes every minute so that it's not sent with every request.
app.use((req, res, next) => {
  req.session.nowInMinutes = Math.floor(Date.now() / 60e3);
  next();
});

app.use('/auth', authentication);
app.use('/api/usercaseloads', userCaseLoads);
app.use('/api/setactivecaseload', setActiveCaseLoad);
app.use('/api/unallocated', unallocated.router);
app.use('/api/allocated', allocated.router);
app.use('/api/userLocations', userLocations);
app.use('/api/searchOffenders', searchOffenders.router);
app.use('/api/manualoverride', manualoverride);
app.use('/api/keyworkerSearch', keyworkerSearch);
app.use('/api/keyworker', keyworkerProfile.router);
app.use('/api/keyworkerAllocations', keyworkerAllocations.router);

app.use('/health', require('express-healthcheck')());

app.use('/info', (req, res) => {
  res.json(getAppInfo());
});

app.use('/', express.static(path.join(__dirname, '../build')));

const port = process.env.PORT || 3001;

app.listen(port, function () {
  console.log('Backend running on port %s', port);
});
