const asyncMiddleware = require('../middleware/asyncHandler');
const log = require('../log');

const factory = (keyworkerApi) => {
  const autoAllocate = asyncMiddleware(async (req, res) => {
    const { agencyId } = req.query;

    await keyworkerApi.autoAllocateConfirm(res.locals, agencyId);

    const { allocatedKeyworkers } = req.body;

    log.debug({ allocateList: allocatedKeyworkers }, 'Manual override contents');

    for (const allocatedKeyworker of allocatedKeyworkers) {
      if (!(allocatedKeyworker && allocatedKeyworker.staffId)) {
        continue;
      }
      const data = {
        offenderNo: allocatedKeyworker.offenderNo,
        staffId: allocatedKeyworker.staffId,
        prisonId: req.query.agencyId,
        allocationType: 'M',
        allocationReason: 'MANUAL',
        deallocationReason: 'OVERRIDE'
      };
      const response = await keyworkerApi.allocate(res.locals, data);
      log.debug({ response }, 'Response from allocate request');
    }
    res.json({});
  });

  return {
    autoAllocate
  };
};

module.exports = {
  factory
};

