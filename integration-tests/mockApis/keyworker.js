const { stubFor, verifyRequest } = require('./wiremock')

module.exports = {
  stubPrisonMigrationStatus: ({
    agencyLocationId = 'MDI',
    supported = true,
    migrated = true,
    kwSessionFrequencyInWeeks = 1,
    allowAuto = true,
    capacityTier1 = 3,
    capacityTier2 = 6,
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
          capacityTier1,
          capacityTier2,
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
  stubKeyworkerSearch: (keyworkers) =>
    stubFor({
      request: {
        method: 'GET',
        urlPathPattern: '/key-worker/.+?/members',
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
  stubAllocationHistorySummary: (response = []) =>
    stubFor({
      request: {
        method: 'POST',
        urlPath: `/key-worker/allocation-history/summary`,
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

  stubOffenderKeyworkerList: ({ agencyId, response = [] }) =>
    stubFor({
      request: {
        method: 'POST',
        urlPattern: `/key-worker/${agencyId}/offenders`,
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: response,
      },
    }),
  stubUnallocated: ({ agencyId, response = [] }) =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: `/key-worker/${agencyId}/offenders/unallocated`,
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: response,
      },
    }),
  stubAutoAllocate: ({ agencyId, response = {}, status = 200 }) =>
    stubFor({
      request: {
        method: 'POST',
        urlPattern: `/key-worker/${agencyId}/allocate/start`,
      },
      response: {
        status,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: response,
      },
    }),
  stubAutoAllocated: ({ agencyId, response = [] }) =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: `/key-worker/${agencyId}/allocations.+?`,
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: response,
      },
    }),
  stubAutoAllocateConfirm: ({ agencyId, response = {} }) =>
    stubFor({
      request: {
        method: 'POST',
        urlPattern: `/key-worker/${agencyId}/allocate/confirm`,
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: response,
      },
    }),
  stubHealth: () =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: '/health/ping',
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: '{"status":"UP"}',
      },
    }),

  verifyAllocateWasCalled: () => verifyRequest('/key-worker/allocate', 'POST'),
  verifyDeallocateWasCalled: (offenderNo) => verifyRequest(`/key-worker/deallocate/${offenderNo}`, 'PUT'),
}
