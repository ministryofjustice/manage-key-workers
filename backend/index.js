require('dotenv').config();

const path = require('path');
const express = require('express');
const app = express();
const login = require('./controllers/login');
const userCaseLoads = require('./controllers/usercaseloads');
const setActiveCaseLoad = require('./controllers/setactivecaseload');
const unallocated = require('./controllers/unallocated');
const allocated = require('./controllers/allocated');
const manualoverride = require('./controllers/manualoverride');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const bunyanMiddleware = require('bunyan-middleware');
const log = require('./log');

app.use(bunyanMiddleware({
  logger: log,
  obscureHeaders: ['Authorization']
}));

app.use('/login', jsonParser, login);
app.use('/usercaseloads', jsonParser, userCaseLoads);
app.use('/setactivecaseload', jsonParser, setActiveCaseLoad);
app.use('/unallocated', jsonParser, unallocated);
app.use('/allocated', jsonParser, allocated.router);
app.use('/manualoverride', jsonParser, manualoverride);

app.use('/', express.static(path.join(__dirname, '../build')));

const port = process.env.PORT || 3001;

app.listen(port, function () {
  console.log('Backend running on port %s', port);
});
