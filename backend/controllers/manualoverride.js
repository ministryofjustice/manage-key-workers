const log = require('../log')

const manualOverrideFactory = (keyworkerApi) => {
  const manualOverride = async (req, res) => {
    const allocateList = req.body.allocatedKeyworkers

    console.log({ allocateList })
    log.debug('Manual override contents')

    const prisonId = req.query.agencyId

    const allocationPromises = allocateList
      .filter((element) => element && element.staffId)
      .map(async ({ offenderNo, staffId, deallocate }) => {
        if (deallocate) {
          await keyworkerApi.deallocate(res.locals, offenderNo, {
            offenderNo,
            staffId,
            prisonId,
            deallocationReason: 'MANUAL',
          })
          log.debug('Response from deallocate request')
        } else {
          await keyworkerApi.allocate(res.locals, {
            offenderNo,
            staffId,
            prisonId,
            allocationType: 'M',
            allocationReason: 'MANUAL',
            deallocationReason: 'OVERRIDE',
          })
          log.debug('Response from allocate request')
        }
      })

    await Promise.all(allocationPromises)
    res.json({})
  }

  return {
    manualOverride,
  }
}

module.exports = {
  manualOverrideFactory,
}
