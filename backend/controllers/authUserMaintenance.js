const log = require('../log')

const handleClientError = async (apiCall, defaultField, res, errorMapping) => {
  try {
    await apiCall()
  } catch (e) {
    if (e.response && e.response.data && e.response.status < 500) {
      res.status(e.response.status)
      const { field, error, error_description: errorDescription } = e.response.data
      const description = (errorMapping && errorMapping[error]) || errorDescription
      if (!field && !description) throw e
      else res.json([{ targetName: field || defaultField, text: description, error }])
    } else {
      throw e
    }
  }
}

const authUserMaintenanceFactory = oauthApi => {
  const getUser = async (req, res) => {
    const { username } = req.query
    log.debug('Performing get auth user')

    await handleClientError(
      async () => {
        const response = await oauthApi.getUser(res.locals, { username })
        res.json(response)
      },
      'user',
      res
    )
  }

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

  const groups = async (req, res) => {
    const { username } = req.query
    log.debug('Performing auth user groups query')

    if (!username) {
      res.status(400)
      res.json([{ targetName: 'user', text: 'Enter a username' }])
      return
    }

    await handleClientError(
      async () => {
        const response = await oauthApi.userGroups(res.locals, { username })
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

  const addGroup = async (req, res) => {
    const { username, group } = req.query
    log.debug(`Adding group ${group} to user ${username}`)

    if (!group) {
      res.status(400)
      res.json([{ targetName: 'group', text: 'Select a group' }])
      return
    }

    await handleClientError(
      async () => {
        const response = await oauthApi.addUserGroup(res.locals, { username, group })
        res.json(response)
      },
      'group',
      res
    )
  }

  const removeGroup = async (req, res) => {
    const { username, group } = req.query
    log.debug(`Removing group ${group} from user ${username}`)

    if (!group) {
      res.status(400)
      res.json([{ targetName: 'group', text: 'Select a group to remove' }])
      return
    }

    await handleClientError(
      async () => {
        const response = await oauthApi.removeUserGroup(res.locals, { username, group })
        res.json(response)
      },
      'group',
      res
    )
  }

  const allRoles = async (req, res) => {
    log.debug('Performing auth roles ')

    await handleClientError(
      async () => {
        const response = await oauthApi.allRoles(res.locals)
        res.json(response)
      },
      'user',
      res
    )
  }

  const assignableGroups = async (req, res) => {
    log.debug('Performing auth user assignable groups')

    await handleClientError(
      async () => {
        const response = await oauthApi.assignableGroups(res.locals)
        res.json(response)
      },
      'user',
      res
    )
  }

  const createUser = async (req, res) => {
    const { username } = req.query
    log.debug('Performing create auth user')

    await handleClientError(
      async () => {
        const response = await oauthApi.createUser(res.locals, username, req.body)
        res.json(response)
      },
      'username',
      res,
      { 'email.domain': 'The email domain is not allowed.  Enter a work email address' }
    )
  }

  const enableUser = async (req, res) => {
    const { username } = req.query
    log.debug(`Enabling auth user ${username}`)

    await handleClientError(
      async () => {
        const response = await oauthApi.enableUser(res.locals, { username })
        res.json(response)
      },
      'username',
      res
    )
  }

  const disableUser = async (req, res) => {
    const { username } = req.query
    log.debug(`Disabling auth user ${username}`)

    await handleClientError(
      async () => {
        const response = await oauthApi.disableUser(res.locals, { username })
        res.json(response)
      },
      'username',
      res
    )
  }

  const amendUser = async (req, res) => {
    const { username } = req.query
    log.debug(`Amending auth user ${username}`)

    await handleClientError(
      async () => {
        const response = await oauthApi.amendUser(res.locals, username, req.body)
        res.json(response)
      },
      'username',
      res,
      {
        'email.domain': 'The email domain is not allowed.  Enter a work email address',
        'email.notinitial':
          'The user has verified their email address or set a password.  Their email address cannot be modified.',
      }
    )
  }

  return {
    getUser,
    search,
    roles,
    groups,
    addRole,
    removeRole,
    addGroup,
    removeGroup,
    allRoles,
    assignableGroups,
    createUser,
    enableUser,
    disableUser,
    amendUser,
  }
}

module.exports = authUserMaintenanceFactory
