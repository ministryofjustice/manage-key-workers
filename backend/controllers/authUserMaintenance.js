const log = require('../log')

const handleClientError = async (apiCall, field, res) => {
  try {
    await apiCall()
  } catch (e) {
    if (e.response && e.response.status < 500) {
      res.status(e.response.status)
      res.json([{ targetName: field, text: e.response.data.error_description }])
    } else {
      throw e
    }
  }
}

const authUserMaintenanceFactory = oauthApi => {
  const search = async (req, res) => {
    const { nameFilter } = req.query
    log.debug('Performing auth user search')

    if (!nameFilter) {
      res.status(400)
      res.json([{ targetName: 'user', text: 'Enter a username or email address' }])
      return
    }

    await handleClientError(
      async () => {
        const response = nameFilter.includes('@')
          ? await oauthApi.userSearch(res.locals, { nameFilter })
          : [await oauthApi.getUser(res.locals, { username: nameFilter })]

        if (!response) {
          res.status(404)
          res.json([{ targetName: 'user', text: `No accounts for email address ${nameFilter} found` }])
          return
        }
        res.json(response)
      },
      'user',
      res
    )
  }

  const roles = async (req, res) => {
    const { username } = req.query
    log.debug('Performing auth user roles query')

    if (!username) {
      res.status(400)
      res.json([{ targetName: 'user', text: 'Enter a username' }])
      return
    }

    await handleClientError(
      async () => {
        const response = await oauthApi.userRoles(res.locals, { username })
        res.json(response)
      },
      'user',
      res
    )
  }

  const addRole = async (req, res) => {
    const { username, role } = req.query
    log.debug(`Adding role ${role} to user ${username}`)

    if (!role) {
      res.status(400)
      res.json([{ targetName: 'role', text: 'Select a role' }])
      return
    }

    await handleClientError(
      async () => {
        const response = await oauthApi.addUserRole(res.locals, { username, role })
        res.json(response)
      },
      'role',
      res
    )
  }

  const removeRole = async (req, res) => {
    const { username, role } = req.query
    log.debug(`Removing role ${role} from user ${username}`)

    if (!role) {
      res.status(400)
      res.json([{ targetName: 'role', text: 'Select a role to remove' }])
      return
    }

    await handleClientError(
      async () => {
        const response = await oauthApi.removeUserRole(res.locals, { username, role })
        res.json(response)
      },
      'role',
      res
    )
  }

  return { search, roles, addRole, removeRole }
}

module.exports = authUserMaintenanceFactory
