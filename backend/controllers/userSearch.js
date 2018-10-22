const asyncMiddleware = require('../middleware/asyncHandler')
const log = require('../log')

const search = function(eliteApi, res, agencyId, nameFilter, roleFilter) {
  return eliteApi.userSearch(res.locals, {
    agencyId,
    nameFilter,
    roleFilter: roleFilter || '',
  })
}

const adminSearch = function(eliteApi, res, agencyId, nameFilter, roleFilter) {
  return eliteApi.userSearchAdmin(res.locals, {
    agencyId,
    nameFilter,
    roleFilter: roleFilter || '',
  })
}

const userSearchFactory = eliteApi => {
  const userSearch = asyncMiddleware(async (req, res) => {
    const { agencyId, nameFilter, roleFilter, hasAdminRole } = req.query
    log.debug('Performing user search.  Admin role=' + hasAdminRole)
    const response =
      hasAdminRole === 'true'
        ? await adminSearch(eliteApi, res, agencyId, nameFilter, roleFilter)
        : await search(eliteApi, res, agencyId, nameFilter, roleFilter)
    res.set(res.locals.responseHeaders)
    res.json(response)
  })

  return {
    userSearch,
  }
}

module.exports = {
  userSearchFactory,
}
