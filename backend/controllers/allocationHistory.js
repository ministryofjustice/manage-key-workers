const asyncMiddleware = require('../middleware/asyncHandler');
const log = require('../log');

const allocationHistoryFactory = (keyworkerApi) => {
  const allocationHistory = asyncMiddleware(async (req, res) => {
    const { offenderNo } = req.query;
    const allocationHistoryData = await keyworkerApi.allocationHistory(res.locals, offenderNo);
    log.debug({ data: allocationHistoryData }, 'Response from allocation history request');
    res.json(allocationHistoryData);
  });

  return {
    allocationHistory
  };
};

module.exports = {
  allocationHistoryFactory
};
