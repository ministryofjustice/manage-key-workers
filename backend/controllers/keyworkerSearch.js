const asyncMiddleware = require('../middleware/asyncHandler');
const log = require('../log');

const keyworkerSearchFactory = (keyworkerApi) => {
  const keyworkerSearch = asyncMiddleware(async (req, res) => {
    const { agencyId, searchText, statusFilter } = req.query;
    const response = await keyworkerApi.keyworkerSearch(
      res.locals,
      {
        agencyId,
        searchText,
        statusFilter: statusFilter ? statusFilter : ''
      });
    log.debug({ keyworkerSearch: response }, 'Response from keyworker search request');
    res.json(response);
  });

  return {
    keyworkerSearch
  };
};

module.exports = {
  keyworkerSearchFactory
};
