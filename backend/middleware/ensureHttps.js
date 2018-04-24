
module.exports = function ensureSec (req, res, next) {
  if (req.headers["x-forwarded-proto"] === "https") {
    return next();
  }
  res.redirect("https://" + req.headers.host + req.url);
};
