const asyncMiddleware = require('../middleware/asyncHandler');
const log = require('../log');

const getRolesFactory = (elite2Api) => {
  const getRoles = asyncMiddleware(async (req, res) => {
    const hasAdminRole = req.query.hasAdminRole;
    log.debug('Retrieving roles.  Admin role=' + hasAdminRole);
    const data = hasAdminRole === 'true' ? await elite2Api.getRolesAdmin(res.locals) : await elite2Api.getRoles(res.locals);
    res.json(data);
  });

  return {
    getRoles
  };
};

module.exports = {
  getRolesFactory: getRolesFactory
};
