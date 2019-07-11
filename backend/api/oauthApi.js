const axios = require('axios')
const querystring = require('querystring')
const logger = require('../log')
const errorStatusCode = require('../error-status-code')

const AuthClientErrorName = 'AuthClientError'
const AuthClientError = message => ({ name: AuthClientErrorName, message, stack: new Error().stack })

const encodeQueryString = input => encodeURIComponent(input)
const apiClientCredentials = (clientId, clientSecret) => Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

/**
 * Return an oauthApi built using the supplied configuration.
 * @param client
 * @param clientId
 * @param clientSecret
 * @param url
 * @returns a configured oauthApi instance
 */
const oauthApiFactory = (client, { clientId, clientSecret, url }) => {
  const get = (context, path) => client.get(context, path).then(response => response.data)
  const put = (context, path, body) => client.put(context, path, body).then(response => response.data)
  const post = (context, path, body) => client.post(context, path, body).then(response => response.data)
  const del = (context, path) => client.del(context, path).then(response => response.data)
  const currentUser = context => get(context, 'api/user/me')
  const currentRoles = context => get(context, 'api/user/me/roles')
  const getUser = (context, { username }) => get(context, `api/authuser/${username}`)
  const createUser = (context, username, user) => put(context, `api/authuser/${username}`, user)
  const userRoles = (context, { username }) => get(context, `api/authuser/${username}/roles`)
  const userGroups = (context, { username }) => get(context, `api/authuser/${username}/groups`)
  const userSearch = (context, { nameFilter }) => get(context, `api/authuser?email=${encodeQueryString(nameFilter)}`)
  const addUserRole = (context, { username, role }) => put(context, `api/authuser/${username}/roles/${role}`)
  const removeUserRole = (context, { username, role }) => del(context, `api/authuser/${username}/roles/${role}`)
  const addUserGroup = (context, { username, group }) => put(context, `api/authuser/${username}/groups/${group}`)
  const removeUserGroup = (context, { username, group }) => del(context, `api/authuser/${username}/groups/${group}`)
  const assignableGroups = context => get(context, 'api/authuser/me/assignable-groups')
  const enableUser = (context, { username }) => put(context, `api/authuser/${username}/enable`)
  const disableUser = (context, { username }) => put(context, `api/authuser/${username}/disable`)
  const allRoles = context => get(context, `api/authroles`)
  const amendUser = (context, username, email) => post(context, `api/authuser/${username}`, email)

  const oauthAxios = axios.create({
    baseURL: url,
    url: 'oauth/token',
    method: 'post',
    timeout: 30000,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      authorization: `Basic ${apiClientCredentials(clientId, clientSecret)}`,
    },
  })

  // eslint-disable-next-line camelcase
  const parseOauthTokens = ({ access_token, refresh_token }) => ({
    access_token,
    refresh_token,
  })

  const translateAuthClientError = error => {
    logger.info(`login error description = ${error}`)

    if (error.includes('has expired')) return 'Your password has expired.'
    if (error.includes('is locked')) return 'Your user account is locked.'
    if (error.includes('No credentials')) return 'Missing credentials.'
    if (error.includes('to caseload NWEB'))
      return 'You are not enabled for this service, please contact admin to request access.'

    return 'The username or password you have entered is invalid.'
  }

  const makeTokenRequest = (data, msg) =>
    oauthAxios({ data })
      .then(response => {
        logger.debug(
          `${msg} ${response.config.method} ${response.config.url} ${response.status} ${response.statusText}`
        )
        return parseOauthTokens(response.data)
      })
      .catch(error => {
        const status = errorStatusCode(error)
        const errorDesc = (error.response && error.response.data && error.response.data.error_description) || null

        if (parseInt(status, 10) < 500 && errorDesc !== null) {
          logger.info(`${msg} ${error.config.method} ${error.config.url} ${status} ${errorDesc}`)

          throw AuthClientError(translateAuthClientError(errorDesc))
        }

        logger.error(`${msg} ${error.config.method} ${error.config.url} ${status} ${error.message}`)
        throw error
      })

  /**
   * Perform OAuth token refresh, returning the tokens to the caller. See scopedStore.run.
   * @returns A Promise that resolves when token refresh has succeeded and the OAuth tokens have been returned.
   */
  const refresh = refreshToken =>
    makeTokenRequest(querystring.stringify({ refresh_token: refreshToken, grant_type: 'refresh_token' }), 'refresh:')

  return {
    currentUser,
    currentRoles,
    getUser,
    createUser,
    userSearch,
    userRoles,
    userGroups,
    addUserRole,
    removeUserRole,
    addUserGroup,
    removeUserGroup,
    allRoles,
    refresh,
    // Expose the internals so they can be Monkey Patched for testing. Oo oo oo.
    oauthAxios,
    enableUser,
    disableUser,
    amendUser,
    assignableGroups,
  }
}

module.exports = { oauthApiFactory, AuthClientError, AuthClientErrorName, apiClientCredentials }
