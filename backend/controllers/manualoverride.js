const asyncMiddleware = require('../middleware/asyncHandler')
const log = require('../log')

const manualOverrideFactory = keyworkerApi => {
  const manualOverride = asyncMiddleware(async (req, res) => {
    const allocateList = req.body.allocatedKeyworkers

    log.debug({ allocateList }, 'Manual override contents')

    const prisonId = req.query.agencyId

    for (const element of allocateList) {
      if (!element) continue

      const { staffId } = element

      if (!staffId) continue

      const { offenderNo } = element

      if (element.deallocate) {
        const response = await keyworkerApi.deallocate(res.locals, offenderNo, {
          offenderNo,
          staffId,
          prisonId,
          deallocationReason: 'MANUAL',
        })
        log.debug({ response }, 'Response from deallocate request')
      } else {
        const response = await keyworkerApi.allocate(res.locals, {
          offenderNo,
          staffId,
          prisonId,
          allocationType: 'M',
          allocationReason: 'MANUAL',
          deallocationReason: 'OVERRIDE',
        })
        log.debug({ response }, 'Response from allocate request')
      }
    }
    res.json({})
  })

  return {
    manualOverride,
  }
}

module.exports = {
  manualOverrideFactory,
}
