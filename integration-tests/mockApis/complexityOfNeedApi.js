const { stubFor } = require('./wiremock')

module.exports = {
  stubGetComplexOffenders: (offenders) =>
    stubFor({
      request: {
        method: 'POST',
        urlPath: '/complexity/v1/complexity-of-need/multiple/offender-no',
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: offenders,
      },
    }),
  stubHealth: () =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: '/complexity/ping',
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
