const config = require('../config')

const getConfiguration = async (req, res) =>
  res.json({
    notmEndpointUrl: config.app.notmEndpointUrl,
    prisonStaffHubUrl: config.app.prisonStaffHubUrl,
    mailTo: config.app.mailTo,
    googleAnalyticsId: config.analytics.googleAnalyticsId,
    keyworkerProfileStatsEnabled: config.app.keyworkerProfileStatsEnabled,
    keyworkerDashboardStatsEnabled: config.app.keyworkerDashboardStatsEnabled,
    supportUrl: config.app.supportUrl,
  })

module.exports = {
  getConfiguration,
}
