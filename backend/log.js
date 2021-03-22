const Logger = require('bunyan')

module.exports = new Logger({
  name: 'keyworkerUI',
  streams: [
    {
      stream: process.stdout,
      level: process.env.LOG_LEVEL || 'info',
    },
  ],
})
