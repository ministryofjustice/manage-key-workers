const log = require('../log');

module.exports = function ensureSec (req, res, next) {
  if (req.headers["x-forwarded-proto"] === "https") {
    return next();
  }
  const redirectUrl = "https://" + req.headers.host + req.url;
  log.info(`Redirecting to ${redirectUrl}`);

  res.redirect(redirectUrl);
};
