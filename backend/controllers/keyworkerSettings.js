const asyncMiddleware = require('../middleware/asyncHandler')

const keyworkerSettingsFactory = (keyworkerApi, elite2Api) => {
  const keyworkerSettingsService = async context => {
    const user = await elite2Api.currentUser(context)
    const { activeCaseLoadId } = user

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
