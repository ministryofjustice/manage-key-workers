const asyncMiddleware = require('../middleware/asyncHandler');

const factory = (allocationService) => {
  const unallocated = asyncMiddleware(async (req, res) => {
    const agencyId = req.query.agencyId;

    const offenderWithLocationDtos = await allocationService.unallocated(res.locals, agencyId);
    res.json(offenderWithLocationDtos);
  });

  const allocated = asyncMiddleware(async (req, res) => {
    const agencyId = req.query.agencyId;

    const viewModel = await allocationService.allocated(res.locals, agencyId);
    res.json(viewModel);
  });

  const keyworkerAllocations = asyncMiddleware(async (req, res) => {
    const staffId = req.query.staffId;
    const agencyId = req.query.agencyId;
    const allocations = await allocationService.keyworkerAllocations(res.locals, staffId, agencyId);
    res.json(allocations);
  });

  const searchOffenders = asyncMiddleware(async (req, res) => {
    const allocationStatus = req.query.allocationStatus; // One of 'all', 'unallocated', 'allocated'
    const keywords = req.query.keywords;
    const locationPrefix = req.query.locationPrefix;
    const agencyId = req.query.agencyId;

    const offenders = await allocationService.searchOffenders(
      res.locals,
      {
        agencyId,
        keywords,
        locationPrefix,
        allocationStatus
      }
    );
    res.json(offenders);
  });

  return {
    unallocated,
    allocated,
    keyworkerAllocations,
    searchOffenders
  };
};

module.exports = {
  factory
};
