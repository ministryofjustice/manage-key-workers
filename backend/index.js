require('dotenv').config();

const express = require('express');
const app = express();
const router = express.Router();
const login = require('./controllers/login');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

app.use('/login',jsonParser, login);

app.listen(3001, function(){
   console.log('Backend running on port 3001');
});