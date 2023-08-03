const jwt = require('jsonwebtoken')
const { stubFor, getMatchingRequests } = require('./wiremock')

const { stubStaffRoles, stubUserLocations } = require('./prisonApi')
const { stubUser, stubUserMe, stubUserMeRoles } = require('./users')

const createToken = () => {
  const payload = {
    user_name: 'ITAG_USER',
    scope: ['read', 'write'],
    auth_source: 'nomis',
    authorities: ['ROLE_GLOBAL_SEARCH'],
    jti: '83b50a10-cca6-41db-985f-e87efb303ddb',
    client_id: 'dev',
  }

  return jwt.sign(payload, 'secret', { expiresIn: '1h' })
}

const getLoginUrl = () =>
  getMatchingRequests({
    method: 'GET',
    urlPath: '/auth/oauth/authorize',
  }).then((data) => {
    const { requests } = data.body
    const stateValue = requests[0].queryParams.state.values[0]
    return `/login/callback?code=codexxxx&state=${stateValue}`
  })

const favicon = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/favicon.ico',
    },
    response: {
      status: 200,
    },
  })

const redirect = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/auth/oauth/authorize\\?response_type=code&redirect_uri=.+?&state=.+?&client_id=.+?',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        Location: 'http://localhost:3008/login/callback?code=codexxxx&state=stateyyyy',
      },
      body: '<html><body>Login page<h1>Sign in</h1></body></html>',
    },
  })

const stubHealth = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/auth/health/ping',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      jsonBody: '{"status":"UP"}',
    },
  })

const logout = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPath: '/auth/logout',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
      body: '<html><body>Login page<h1>Sign in</h1></body></html>',
    },
  })

const token = () =>
  stubFor({
    request: {
      method: 'POST',
      urlPattern: '/auth/oauth/token',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Location: 'http://localhost:3008/login/callback?code=codexxxx&state=stateyyyy',
      },
      jsonBody: {
        access_token: createToken(),
        token_type: 'bearer',
        refresh_token: 'refresh',
        user_name: 'TEST_USER',
        expires_in: 600,
        scope: 'read write',
        internalUser: true,
      },
    },
  })

const stubClientCredentialsRequest = () =>
  stubFor({
    request: {
      method: 'POST',
      url: '/auth/oauth/token',
    },
    response: {
      status: 200,
    },
  })

module.exports = {
  getLoginUrl,
  stubLogin: (username, caseloadId, roles = []) =>
    Promise.all([
      favicon(),
      redirect(),
      logout(),
      token(),
      stubUserMe(),
      stubUserMeRoles(roles),
      stubUser(username, caseloadId),
      stubUserLocations(),
      stubStaffRoles(),
    ]),
  redirect,
  stubClientCredentialsRequest,
  stubHealth,
}
