const { stubFor, verifyRequest } = require('./wiremock')

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
  stubAllocationHistory: ({ offenderNo, response = {} }) =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: `/key-worker/allocation-history/${offenderNo}`,
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: response,
      },
    }),
  stubAllocate: () =>
    stubFor({
      request: {
        urlPath: '/key-worker/allocate',
        method: 'POST',
      },
      response: {
        status: 201,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: {},
      },
    }),
  stubDeallocate: (offenderNo) =>
    stubFor({
      request: {
        urlPath: `/key-worker/deallocate/${offenderNo}`,
        method: 'PUT',
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: {},
      },
    }),
  verifyAllocateWasCalled: () => verifyRequest('/key-worker/allocate', 'POST'),
  verifyDeallocateWasCalled: (offenderNo) => verifyRequest(`/key-worker/deallocate/${offenderNo}`, 'PUT'),
}
