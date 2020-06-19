const config = require('../config')

const getConfiguration = async (req, res) =>
  res.json({
    notmEndpointUrl: config.app.notmEndpointUrl,
    prisonStaffHubUrl: config.app.prisonStaffHubUrl,
    googleAnalyticsId: config.analytics.googleAnalyticsId,
    keyworkerProfileStatsEnabled: config.app.keyworkerProfileStatsEnabled,
    keyworkerDashboardStatsEnabled: config.app.keyworkerDashboardStatsEnabled,
  })

module.exports = {
  getConfiguration,
}
