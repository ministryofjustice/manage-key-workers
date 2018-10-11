const asyncMiddleware = require('../middleware/asyncHandler');
const config = require('../config');

const getConfiguration = asyncMiddleware(
  async (req, res) => res.json({
    notmEndpointUrl: config.app.notmEndpointUrl,
    mailTo: config.app.mailTo,
    googleAnalyticsId: config.analytics.googleAnalyticsId,
    maintainRolesEnabled: config.app.maintainRolesEnabled,
    keyworkerDashboardStats: config.app.keyworkerDashboardStats
  }));

module.exports = {
  getConfiguration
};

