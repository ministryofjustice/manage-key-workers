const Logger = require('bunyan');


// applicationinsights automatically collects bunyan logs
require('./azure-appinsights');

module.exports = new Logger({
  name: 'keyworkerUI',
  streams: [
    {
      stream: process.stdout,
      level: 'debug'
    }
  ]
});
