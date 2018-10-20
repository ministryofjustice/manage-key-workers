const asyncMiddleware = require('../middleware/asyncHandler');
const log = require('../log');

const enableNewNomisFactory = (elite2Api) => {
  const enableNewNomis = asyncMiddleware(async (req, res) => {
    const { agencyId } = req.query;

    const response = await elite2Api.enableNewNomis(res.locals, agencyId);
    log.debug({ response }, 'Response from enable nweb caseload');
    res.json({});
  });

  return {
    enableNewNomis
  };
};

module.exports = {
  enableNewNomisFactory
};

