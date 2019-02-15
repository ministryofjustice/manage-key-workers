const asyncMiddleware = require('../middleware/asyncHandler')
const config = require('../config')

const getConfiguration = asyncMiddleware(async (req, res) =>
  res.json({
    notmEndpointUrl: config.app.notmEndpointUrl,
    prisonStaffHubUrl: config.app.prisonStaffHubUrl,
    mailTo: config.app.mailTo,
    googleAnalyticsId: config.analytics.googleAnalyticsId,
    maintainRolesEnabled: config.app.maintainRolesEnabled,
    keyworkerProfileStatsEnabled: config.app.keyworkerProfileStatsEnabled,
    keyworkerDashboardStatsEnabled: config.app.keyworkerDashboardStatsEnabled,
  })
)

module.exports = {
  getConfiguration,
}
