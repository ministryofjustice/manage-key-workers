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
        urlPattern: `/key-worker/key-worker/prison/${agencyLocationId}`,
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
  stubKeyworkerAllocations: (response = []) =>
    stubFor({
      request: {
        method: 'GET',
        urlPathPattern: `/key-worker/key-worker/.+?/prison/.+?/offenders`,
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: response,
      },
    }),

  stubKeyworker: (response = {}) =>
    stubFor({
      request: {
        method: 'GET',
        urlPathPattern: `/key-worker/key-worker/.+?/prison/[^/]+`,
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: response,
      },
    }),

  stubKeyworkerUpdate: (response = {}) =>
    stubFor({
      request: {
        method: 'POST',
        urlPathPattern: `/key-worker/key-worker/.+?/prison/[^/]+`,
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: response,
      },
    }),
  stubAvailableKeyworkers: (keyworkers = []) =>
    stubFor({
      request: {
        method: 'GET',
        urlPathPattern: '/key-worker/key-worker/.+?/available',
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
        urlPathPattern: '/key-worker/key-worker/.+?/members',
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: keyworkers,
      },
    }),
  stubKeyworkerSearchError: () =>
    stubFor({
      request: {
        method: 'GET',
        urlPathPattern: '/key-worker/key-worker/.+?/members',
      },
      response: {
        status: 501,
        jsonBody: { status: '', message: 'hi there' },
      },
    }),
  stubOffenderKeyworker: (response = []) =>
    stubFor({
      request: {
        method: 'POST',
        urlPathPattern: '/key-worker/key-worker/.+?/offenders',
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
        urlPath: `/key-worker/key-worker/allocation-history/summary`,
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
        urlPattern: `/key-worker/key-worker/allocation-history/${offenderNo}`,
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
        urlPath: '/key-worker/key-worker/allocate',
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
        urlPath: `/key-worker/key-worker/deallocate/${offenderNo}`,
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
        urlPattern: `/key-worker/key-worker/${agencyId}/offenders`,
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
        urlPattern: `/key-worker/key-worker/${agencyId}/offenders/unallocated`,
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
        urlPattern: `/key-worker/key-worker/${agencyId}/allocate/start`,
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
        urlPattern: `/key-worker/key-worker/${agencyId}/allocations.+?`,
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
        urlPattern: `/key-worker/key-worker/${agencyId}/allocate/confirm`,
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: response,
      },
    }),
  stubKeyworkerStats: (response = {}) =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: '/key-worker/key-worker-stats.+?',
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        jsonBody: response,
      },
    }),
  stubHealth: () =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: '/key-worker/health/ping',
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        jsonBody: '{"status":"UP"}',
      },
    }),
  stubHealthTimeoutError: (timeout) =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: '/key-worker/health/ping',
      },
      response: {
        fixedDelayMilliseconds: timeout,
        status: 500,
      },
    }),
  verifyKeyworkerSearchCalled: (queryParameters) =>
    verifyRequest({ requestUrlPattern: `/key-worker/key-worker/MDI/members.+?`, method: 'GET', queryParameters }),
  verifyKeyworkerStatsCalled: ({ prisonId, from, to }) =>
    verifyRequest({
      requestUrl: `/key-worker/key-worker-stats?prisonId=${prisonId}&fromDate=${from}&toDate=${to}`,
      method: 'GET',
    }),
  verifyAllocateWasCalled: () => verifyRequest({ requestUrl: '/key-worker/key-worker/allocate', method: 'POST' }),
  verifyDeallocateWasCalled: (offenderNo) =>
    verifyRequest({ requestUrl: `/key-worker/deallocate/${offenderNo}`, method: 'PUT' }),
  verifyKeyworkerUpdate: (body) =>
    verifyRequest({ requestUrlPattern: '/key-worker/key-worker/.+?/prison/[^/]+', method: 'POST', body }),
}
