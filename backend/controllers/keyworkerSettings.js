const asyncMiddleware = require('../middleware/asyncHandler')

const keyworkerSettingsFactory = (keyworkerApi, elite2Api) => {
  const keyworkerSettingsService = async context => {
    const caseloads = await elite2Api.userCaseLoads(context)
    const activeCaseLoad = caseloads.find(cl => cl.currentlyActive)
    const activeCaseLoadId = activeCaseLoad ? activeCaseLoad.caseLoadId : null

    const prisonStatus = await keyworkerApi.getPrisonMigrationStatus(context, activeCaseLoadId)

    return {
      sequenceFrequency: prisonStatus.kwSessionFrequencyInWeeks,
      capacity: prisonStatus.capacityTier1,
      extCapacity: prisonStatus.capacityTier2,
      migrated: prisonStatus.migrated,
      supported: prisonStatus.supported,
      allowAuto: prisonStatus.autoAllocatedSupported,
    }
  }
  const keyworkerSettings = asyncMiddleware(async (req, res) => {
    const data = await keyworkerSettingsService(res.locals)
    res.json(data)
  })

  return {
    keyworkerSettings,
    keyworkerSettingsFactory,
  }
}

module.exports = {
  keyworkerSettingsFactory,
}
