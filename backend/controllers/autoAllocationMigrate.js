const asyncMiddleware = require('../middleware/asyncHandler');
const log = require('../log');

const autoAllocationAndMigrateFactory = (keyworkerApi) => {
  const enableAutoAllocationAndMigrate = asyncMiddleware(async (req, res) => {
    const agencyId = req.query.agencyId;
    const update = req.body;

    const response = await keyworkerApi.enableAutoAllocationAndMigrate(res.locals, agencyId, update.migrate, update.capacity, update.frequency);
    log.debug({ response }, 'Response from enableAutoAllocationAndMigrate');
    res.json(response);
  });

  return {
    enableAutoAllocationAndMigrate
  };
};

module.exports = {
  autoAllocationAndMigrateFactory
};

