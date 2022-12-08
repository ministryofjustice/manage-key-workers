const { stubFor } = require('./wiremock')

module.exports = {
  stubSearchOffendersPaginated: (response, locationPrefix, page, pageSize) =>
    stubFor({
      request: {
        method: 'GET',
        url: `/prisoner-search/prison/MDI/prisoners?cellLocationPrefix=${locationPrefix}&page=${page}&size=${pageSize}`,
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: response,
      },
    }),

  stubSearchOffenders: (response, term) =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: `/prisoner-search/prison/MDI/prisoners\\?term=${term}&size=.+?`,
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: response,
      },
    }),

  stubSearchOffendersError: () =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: '/prisoner-search/prison/MDI/prisoners\\?term=.*?&size=.+?',
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

  stubOffenderSentences: (response = []) =>
    stubFor({
      request: {
        method: 'POST',
        urlPath: '/prisoner-search/api/offender-sentences',
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
        urlPath: '/prisoner-search/api/offender-assessments/csra/rating',
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
        urlPattern: '/prisoner-search/health/ping',
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
