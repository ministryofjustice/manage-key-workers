const { stubFor } = require('./wiremock')

const stubHealth = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/users/health/ping',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      jsonBody: '{"status":"UP"}',
    },
  })

const stubUser = (username, caseload) => {
    const user = username || 'ITAG_USER'
    const activeCaseLoadId = caseload || 'MDI'
    return stubFor({
        request: {
            method: 'GET',
            url: `/users/users/${encodeURI(user)}`,
        },
        response: {
            status: 200,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
            jsonBody: {
                user_name: user,
                staffId: 231232,
                username: user,
                active: true,
                name: `${user} name`,
                authSource: 'nomis',
                activeCaseLoadId,
            },
        },
    })
}

const stubUserMe = (username = 'ITAG_USER') =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/users/users/me',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: {
        firstName: 'JAMES',
        lastName: 'STUART',
        username,
      },
    },
  })

const stubUserMeRoles = (roles) =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/users/users/me/roles`,
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: roles,
    },
  })

const stubEmail = (username) =>
  stubFor({
    request: {
      method: 'GET',
      url: `/users/users/${encodeURI(username)}/email`,
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: {
        username,
        email: `${username}@gov.uk`,
      },
    },
  })

module.exports = {
  stubUser,
  stubUserMe,
  stubUserMeRoles,
  stubEmail,
  stubHealth,
}
