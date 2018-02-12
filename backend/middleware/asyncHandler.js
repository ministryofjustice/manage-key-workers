const session = require('../session');
const logError = require('../logError').logError;

const asyncMiddleware = fn =>
  (req, res, next) => {
    res.setHeader('jwt', session.extendSession(req.headers));
    Promise.resolve(fn(req, res, next))
      .catch(error => {
        logError(req.originalUrl, error, 'Error caught in asyncMiddleware');
        const data = error && error.response && error.response.data;
        const errorStatusCode = (data && data.status || error.statusCode) || 500;
        const message = (data && data.userMessage) || (error && error.response && error.response.statusText);

        res.status(errorStatusCode);

        if (message) {
          res.json(message);
        } else {
          res.end();
        }
        throw error;
      });
  };

module.exports = asyncMiddleware;
