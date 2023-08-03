/**
 * Return an hmppsManageUsersApi built using the supplied configuration.
 * @param client
 * @returns a configured hmppsManageUsersApi instance
 */
const hmppsManageUsersApiFactory = (client) => {
  const get = (context, path) => client.get(context, path).then((response) => response.body)
  const currentUser = (context) => get(context, '/users/me')
  const currentRoles = (context) => get(context, '/users/me/roles')

  return {
    currentUser,
    currentRoles,
  }
}

module.exports = { hmppsManageUsersApiFactory }
