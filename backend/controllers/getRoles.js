const asyncMiddleware = require('../middleware/asyncHandler');

const getRolesFactory = (elite2Api) => {
  const getRoles = asyncMiddleware(async (req, res) => {
    const data = await elite2Api.getRoles(res.locals);
    res.json(data);
  });

  return {
    getRoles
  };
};

module.exports = {
  getRolesFactory: getRolesFactory
};
