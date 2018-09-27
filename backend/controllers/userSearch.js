const asyncMiddleware = require('../middleware/asyncHandler');

const userSearchFactory = (eliteApi) => {
  const userSearch = asyncMiddleware(async (req, res) => {
    const { agencyId, nameFilter, roleFilter } = req.query;
    const response = await eliteApi.userSearch(
      res.locals,
      {
        agencyId,
        nameFilter,
        roleFilter: roleFilter ? roleFilter : ''
      });
    res.set(res.locals.responseHeaders);
    res.json(response);
  });

  return {
    userSearch
  };
};

module.exports = {
  userSearchFactory
};
