module.exports = {
  app: {
    production: process.env.NODE_ENV === 'production'
  },
  hmppsCookie: {
    name: process.env.HMPPS_COOKIE_NAME || 'hmpps-session-dev',
    domain: process.env.HMPPS_COOKIE_DOMAIN || 'localhost',
    expiryMinutes: process.env.WEB_SESSION_TIMEOUT_IN_MINUTES || 20
  },
  session: {
    name: 'omic-session',
    secret: process.env.SESSION_COOKIE_SECRET || 'keyboard cat',
    expiryMinutes: process.env.WEB_SESSION_TIMEOUT_IN_MINUTES || 20
  }
};
