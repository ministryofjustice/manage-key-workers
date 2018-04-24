const log = require('../log');

module.exports = function ensureSec (req, res, next) {
  if (req.secure ) {
    console.error('NEXT NEXT NEXT NEXT NEXTR');
    return next();
  }
  const redirectUrl = "https://" + req.headers.hostname + req.url;
  log.info(`Redirecting to ${redirectUrl}`);

  res.redirect(redirectUrl);
};
