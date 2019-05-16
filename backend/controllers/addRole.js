const log = require('../log')

const addRoleFactory = elite2Api => {
  const addRole = async (req, res) => {
    const { agencyId, username, roleCode } = req.query
    const response = await elite2Api.addRole(res.locals, agencyId, username, roleCode)
    log.debug({ response }, 'Response from add role request')
    res.json({})
  }

  return {
    addRole,
  }
}

module.exports = {
  addRoleFactory,
}
