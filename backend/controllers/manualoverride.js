const asyncMiddleware = require('../middleware/asyncHandler')
const log = require('../log')

const manualOverrideFactory = keyworkerApi => {
  const manualOverride = asyncMiddleware(async (req, res) => {
    const allocateList = req.body.allocatedKeyworkers

    log.debug({ allocateList }, 'Manual override contents')

    const prisonId = req.query.agencyId

    const allocationPromises = allocateList
      .filter(element => element.staffId)
      .map(async ({ offenderNo, staffId, deallocate }) => {
        if (deallocate) {
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
      })

    await Promise.all(allocationPromises)
    res.json({})
  })

  return {
    manualOverride,
  }
}

module.exports = {
  manualOverrideFactory,
}
