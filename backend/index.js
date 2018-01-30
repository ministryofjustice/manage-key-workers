require('dotenv').config();

const express = require('express');
const app = express();
const login = require('./controllers/login');
const unallocated = require('./controllers/unallocated');
const allocated = require('./controllers/allocated');
const updateReason = require('./controllers/update-reason');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

app.use('/login', jsonParser, login);
app.use('/unallocated', jsonParser, unallocated);
app.use('/allocated', jsonParser, allocated);
app.use('/update-reason', jsonParser, updateReason);

app.listen(3001, function () {
  console.log('Backend running on port 3001');
});
