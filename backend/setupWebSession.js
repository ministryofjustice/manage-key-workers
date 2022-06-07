const express = require('express')
const { createClient } = require('redis')
const session = require('express-session')
const RedisStore = require('connect-redis')(session)

const log = require('./log')
const config = require('./config')

const router = express.Router()

module.exports = () => {
  const getSessionStore = () => {
    const { enabled, host, port, password } = config.redis
    if (!enabled || !host) return null

    const client = createClient({
      host,
      port,
      password,
      tls: config.app.production ? {} : false,
    })

    client.on('error', (e) => log.error(e, 'Redis client error'))

    return new RedisStore({ client })
  }

  router.use(
    session({
      store: getSessionStore(),
      secret: [config.hmppsCookie.sessionSecret],
      resave: false,
      saveUninitialized: false,
      rolling: true,
      name: config.hmppsCookie.name,
      cookie: {
        domain: config.hmppsCookie.domain,
        httpOnly: true,
        maxAge: config.hmppsCookie.expiryMinutes * 60 * 1000,
        sameSite: 'lax',
        secure: config.app.production,
        signed: true,
      },
    })
  )
  return router
}
