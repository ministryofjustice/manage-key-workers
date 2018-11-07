const asyncMiddleware = require('../middleware/asyncHandler')
const config = require('../config')

const getConfiguration = asyncMiddleware(async (req, res) =>
  res.json({
    notmEndpointUrl: config.app.notmEndpointUrl,
    mailTo: config.app.mailTo,
    googleAnalyticsId: config.analytics.googleAnalyticsId,
    maintainRolesEnabled: config.app.maintainRolesEnabled,
    keyworkeProfileStatsEnabled: config.app.keyworkeProfileStatsEnabled,
    keyworkerDashboardStatsEnabled: config.app.keyworkerDashboardStatsEnabled,
  })
)

module.exports = {
  getConfiguration,
}
