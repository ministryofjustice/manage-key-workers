const { stubFor } = require('./wiremock')

module.exports = {
  stubVerifyToken: (active) =>
    stubFor({
      request: {
        method: 'POST',
        urlPattern: '/token/token/verify',
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: {
          active,
        },
      },
    }),
  stubHealth: () =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: '/token/health/ping',
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
