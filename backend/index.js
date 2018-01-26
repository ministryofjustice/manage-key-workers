require('dotenv').config();

const express = require('express');
const app = express();
const router = express.Router();
const login = require('./controllers/login');
const unallocated = require('./controllers/unallocated');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

app.use('/login',jsonParser, login);
app.use('/unallocated',jsonParser, unallocated);

app.listen(3001, function(){
   console.log('Backend running on port 3001');
});