const asyncMiddleware = require('../middleware/asyncHandler');

const contextUserRolesFactory = (elite2Api) => {
  const contextUserRoles = asyncMiddleware(async (req, res) => {
    const { agencyId, username } = req.query;
    const data = await elite2Api.contextUserRoles(res.locals, agencyId, username);
    res.json(data);
  });

  return {
    contextUserRoles
  };
};

module.exports = {
  contextUserRolesFactory
};

