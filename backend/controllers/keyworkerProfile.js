const asyncMiddleware = require('../middleware/asyncHandler');
const log = require('../log');

const keyworkerProfileFactory = (keyworkerApi) => {
  const keyworkerProfile = asyncMiddleware(async (req, res) => {
    const staffId = req.query.staffId;
    const agencyId = req.query.agencyId;

    const keyworker = await keyworkerApi.keyworker(res.locals, staffId, agencyId);
    log.debug({ data: keyworker }, 'Response from keyworker request');
    res.json(keyworker);
  });

  return {
    keyworkerProfile
  };
};

module.exports = {
  keyworkerProfileFactory
};
