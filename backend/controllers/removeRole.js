const log = require('../log')

const removeRoleFactory = elite2Api => {
  const removeRole = async (req, res) => {
    const { agencyId, username, roleCode } = req.query
    const response = await elite2Api.removeRole(res.locals, agencyId, username, roleCode)
    log.debug({ response }, 'Response from remove role request')
    res.json({})
  }

  return {
    removeRole,
  }
}

module.exports = {
  removeRoleFactory,
}
