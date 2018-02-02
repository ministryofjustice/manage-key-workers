const jwt = require('jsonwebtoken');

const minutes = process.env.WEB_SESSION_TIMEOUT_IN_MINUTES || 20;
const key = process.env.API_GATEWAY_TOKEN || 'test';

const newJWT = (data) => jwt.sign({ data: {
  ...data
},
exp: Math.floor(Date.now() / 1000) + (60 * minutes)
}, key);

const getSessionData = (headers) => {
  try {
    const token = headers.jwt;
    if (!token) return null;

    return jwt.verify(token, key).data;
  } catch (e) { } // eslint-disable-line no-empty
  return null;
};

const isAuthenticated = (headers) => getSessionData(headers) !== null;
const extendSession = (headers) => newJWT(getSessionData(headers));

const service = {
  isAuthenticated,
  getSessionData,
  newJWT,
  extendSession
};

module.exports = service;
