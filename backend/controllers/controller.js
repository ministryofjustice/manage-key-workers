const asyncMiddleware = require('../middleware/asyncHandler')

const factory = (allocationService, statsService) => {
  const unallocated = asyncMiddleware(async (req, res) => {
    const { agencyId } = req.query

    const offenderWithLocationDtos = await allocationService.unallocated(res.locals, agencyId)
    res.json(offenderWithLocationDtos)
  })

  const allocated = asyncMiddleware(async (req, res) => {
    const { agencyId } = req.query

    const viewModel = await allocationService.allocated(res.locals, agencyId)
    res.json(viewModel)
  })

  const keyworkerAllocations = asyncMiddleware(async (req, res) => {
    const { staffId, agencyId } = req.query
    const allocations = await allocationService.keyworkerAllocations(res.locals, staffId, agencyId)
    res.json(allocations)
  })

  const searchOffenders = asyncMiddleware(async (req, res) => {
    const { agencyId, allocationStatus, keywords, locationPrefix } = req.query

    const offenders = await allocationService.searchOffenders(res.locals, {
      agencyId,
      keywords,
      locationPrefix,
      allocationStatus,
    })
    res.json(offenders)
  })

  const getPrisonStats = asyncMiddleware(async (req, res) => {
    const { agencyId, fromDate, toDate } = req.query
    const prisonStats = await statsService.getPrisonStats(res.locals, agencyId, fromDate, toDate)
    res.json(prisonStats)
  })

  return {
    unallocated,
    allocated,
    keyworkerAllocations,
    searchOffenders,
    getPrisonStats,
  }
}

module.exports = {
  factory,
}
