const { stubFor } = require('./wiremock')

module.exports = {
  stubUserMe: () =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: '/prison/api/users/me',
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: {
          firstName: 'JAMES',
          lastName: 'STUART',
          activeCaseLoadId: 'MDI',
        },
      },
    }),
  stubCaseNoteUsageList: (response = []) =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: '/prison/api/case-notes/usage.+?',
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: response,
      },
    }),
  stubUpdateCaseload: () =>
    stubFor({
      request: {
        method: 'PUT',
        url: '/prison/api/users/me/activeCaseLoad',
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
      },
    }),
  stubUserCaseloads: (caseloads) =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: '/prison/api/users/me/caseLoads',
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: caseloads || [
          {
            caseLoadId: 'MDI',
            description: 'Moorland',
            currentlyActive: true,
          },
        ],
      },
    }),

  stubSearchOffenders: (response, pageOffset, totalRecords) =>
    stubFor({
      request: {
        method: 'GET',
        urlPathPattern: '/prison/api/locations/description/.+?/inmates',
        headers: {
          //     'page-offset': {
          //       equalTo: '0',
          //     },
          'page-limit': {
            equalTo: '50',
          },
        },
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'Page-Offset': pageOffset,
          'Total-Records': totalRecords,
        },
        jsonBody: response,
      },
    }),

  stubSearchOffendersError: () =>
    stubFor({
      request: {
        method: 'GET',
        urlPathPattern: '/prison/api/locations/description/.+?/inmates',
      },
      response: {
        status: 403,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: {
          status: 403,
          userMessage: 'Something went wrong with the search',
        },
      },
    }),
  stubUserLocations: (locations) =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: '/prison/api/users/me/locations',
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: locations || [
          {
            locationId: 1,
            locationType: 'INST',
            description: 'Moorland (HMP & YOI)',
            agencyId: 'MDI',
            locationPrefix: 'MDI',
          },
          {
            locationId: 2,
            locationType: 'WING',
            description: 'Houseblock 1',
            agencyId: 'MDI',
            locationPrefix: 'MDI-1',
            userDescription: 'Houseblock 1',
          },
          {
            locationId: 3,
            locationType: 'WING',
            description: 'Houseblock 2',
            agencyId: 'MDI',
            locationPrefix: 'MDI-2',
            userDescription: 'Houseblock 2',
          },
        ],
      },
    }),
  stubStaffRoles: (roles) =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: `/prison/api/staff/.+?/.+?/roles`,
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: roles || [{ role: 'KW' }],
      },
    }),
  stubOffenderSentences: (response = []) =>
    stubFor({
      request: {
        method: 'POST',
        urlPath: '/prison/api/offender-sentences',
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: response,
      },
    }),
  stubOffenderAssessments: () =>
    stubFor({
      request: {
        method: 'POST',
        urlPath: '/prison/api/offender-assessments/csra/rating',
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: [],
      },
    }),
  stubHealth: () =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: '/prison/health/ping',
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        jsonBody: '{"status":"UP"}',
      },
    }),
}
