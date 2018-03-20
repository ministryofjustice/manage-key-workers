const express = require('express');
const router = express.Router();
const elite2Api = require('../elite2Api');
const session = require('../session');
const { logError: log } = require('../logError');


router.get('/login', (req, res) => {
  res.render('login', { authError: false });
});

router.post('/login', async (req, res) => {
  try {
    const response = await elite2Api.login(req);

    req.session.isAuthenticated = true;

    session.setHmppsCookie(res, response.data);

    res.redirect('/');
  } catch (error) {
    log(req.url, error, 'Login failure');
    res.render('login', { authError: true });
  }
});

router.get('/logout', (req, res) => {
  req.session = null;
  session.deleteHmppsCookie(res);
  res.redirect('/auth/login');
});

module.exports = router;
