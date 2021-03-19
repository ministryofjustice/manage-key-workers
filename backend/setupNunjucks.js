const nunjucks = require('nunjucks')
const config = require('./config')

module.exports = (app) => {
  const njkEnv = nunjucks.configure(
    ['node_modules/govuk-frontend/', 'node_modules/@ministryofjustice/frontend/', 'views'],
    {
      autoescape: true,
      express: app,
    }
  )

  njkEnv.addGlobal('dpsUrl', config.app.prisonStaffHubUrl)
  njkEnv.addGlobal('authUrl', config.apis.oauth2.url)
  njkEnv.addGlobal('googleTagManagerId', config.analytics.googleTagManagerId)

  return njkEnv
}
