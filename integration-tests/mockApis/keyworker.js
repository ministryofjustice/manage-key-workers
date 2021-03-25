const { stubFor } = require('./wiremock')

module.exports = {
  stubPrisonMigrationStatus: ({
    agencyLocationId = 'MDI',
    supported = true,
    migrated = true,
    kwSessionFrequencyInWeeks = 1,
    allowAuto = true,
  }) =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: `/key-worker/prison/${agencyLocationId}`,
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: {
          supported,
          migrated,
          autoAllocatedSupported: allowAuto,
          capacityTier1: 3,
          capacityTier2: 6,
          kwSessionFrequencyInWeeks,
        },
      },
    }),
  stubAvailableKeyworkers: (keyworkers) =>
    stubFor({
      request: {
        method: 'GET',
        urlPathPattern: '/key-worker/.+?/available',
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: keyworkers,
      },
    }),
  stubOffenderKeyworker: (response = []) =>
    stubFor({
      request: {
        method: 'POST',
        urlPathPattern: '/key-worker/.+?/offenders',
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: response,
      },
    }),
}
