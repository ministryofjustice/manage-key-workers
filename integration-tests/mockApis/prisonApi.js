const { stubFor } = require('./wiremock')

module.exports = {
  stubUserMe: () =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: '/api/users/me',
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
  stubUpdateCaseload: () =>
    stubFor({
      request: {
        method: 'PUT',
        url: '/api/users/me/activeCaseLoad',
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
        urlPattern: '/api/users/me/caseLoads',
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
  stubSearchOffenders: (response) =>
    stubFor({
      request: {
        method: 'GET',
        urlPathPattern: '/api/locations/description/.+?/inmates',
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: response,
      },
    }),
  stubUserLocations: (locations) =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: '/api/users/me/locations',
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
        urlPattern: `/api/staff/.+?/.+?/roles`,
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
        urlPath: '/api/offender-sentences',
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
        urlPath: '/api/offender-assessments/csra/rating',
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
}
