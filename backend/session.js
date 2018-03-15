// const jwt = require('jsonwebtoken');
// const logError = require('./logError').logError;

// const minutes = process.env.WEB_SESSION_TIMEOUT_IN_MINUTES || 20;
// const key = process.env.API_GATEWAY_TOKEN || 'test';

// const newJWT = (data) => jwt.sign({ data: {
//   ...data
// },
// exp: Math.floor(Date.now() / 1000) + (60 * minutes)
// }, key);

// const getSessionData = (headers) => {
//   try {
//     const token = headers.jwt;
//     if (!token) return null;

//     return jwt.verify(token, key).data;
//   } catch (e) {
//     logError('', e, e.message);
//   }
//   return null;
// };

// const isAuthenticated = (headers) => getSessionData(headers) !== null;
// const extendSession = (headers) => newJWT(getSessionData(headers));

// const service = {
//   isAuthenticated,
//   getSessionData,
//   newJWT,
//   extendSession
// };

// module.exports = service;


const config = require('./config');

const sessionExpiryMinutes = config.hmppsCookie.expiryMinutes * 60 * 1000;

const encodeToBase64 = (string) => new Buffer(string).toString('base64');
const decodedFromBase64 = (string) => new Buffer(string, 'base64').toString('ascii');

const isAuthenticated = (request) => request.session && request.session.isAuthenticated;

const isHmppsCookieValid = (cookie) => {
  if (!cookie) {
    return false;
  }

  const cookieData = getHmppsCookieData(cookie);

  if (!cookieData.access_token || !cookieData.refresh_token) {
    return false;
  }

  return true;
};

const hmppsSessionMiddleWare = (req, res, next) => {
  const hmppsCookie = req.cookies[config.hmppsCookie.name];
  const isXHRRequest = req.xhr || req.headers.accept.indexOf('json') > -1;

  if (!isHmppsCookieValid(hmppsCookie)) {
    // kill session
    req.session = null;

    if (isXHRRequest) {
      res.status(401);
      res.end();
      return;
    }

    res.redirect('/auth/login');
    return;
  }

  const cookie = getHmppsCookieData(hmppsCookie);

  req.access_token = cookie.access_token;
  req.refresh_token = cookie.refresh_token;

  // if not session, create session

  if (!isAuthenticated(req)) {
    req.session.isAuthenticated = true;
  }

  next();
};

const setHmppsCookie = (res, { access_token, refresh_token }) => {
  const tokens = encodeToBase64(JSON.stringify({ access_token, refresh_token }));

  const cookieConfig = {
    domain: config.hmppsCookie.domain,
    encode: String,
    expires: new Date(Date.now() + sessionExpiryMinutes),
    maxAge: sessionExpiryMinutes,
    path: '/',
    httpOnly: true,
    secure: config.app.production
  };

  res.cookie(config.hmppsCookie.name, tokens, cookieConfig);
};

const getHmppsCookieData = (cookie) => JSON.parse(decodedFromBase64(cookie));

const updateHmppsCookie = (response) => (tokens) => {
  setHmppsCookie(response, tokens);
};

const deleteHmppsCookie = (response) => {
  response.cookie(config.hmppsCookie.name, '', { expires: new Date(0), domain: config.hmppsCookie.domain, path: '/' });
};

const service = {
  deleteHmppsCookie,
  hmppsSessionMiddleWare,
  setHmppsCookie,
  updateHmppsCookie,
  isAuthenticated
};

module.exports = service;
