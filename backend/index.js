require('dotenv').config();

const express = require('express');
const app = express();
const login = require('./controllers/login');
const unallocated = require('./controllers/unallocated');
const allocated = require('./controllers/allocated');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const bunyanMiddleware = require('bunyan-middleware');
const log = require('./log');

app.use(bunyanMiddleware({
  logger: log,
  obscureHeaders: ['Authorization']
}));

app.use('/login', jsonParser, login);
app.use('/unallocated', jsonParser, unallocated);
app.use('/allocated', jsonParser, allocated.router);

app.listen(3001, function () {
  console.log('Backend running on port 3001');
});
