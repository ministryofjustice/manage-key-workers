const log = require('./log');

const logError = (url, error, msg) => {
  if (error.response) {
    log.error({
      url,
      status: error.response.status,
      statusText: error.response.statusText,
      headers: error.response.headers,
      config: error.response.config,
      data: error.response.data
    }, msg);
  } else {
    log.error({
      url,
      code: error.code,
      message: error.message
    }, msg);
  }
};

module.exports = {
  logError
};
