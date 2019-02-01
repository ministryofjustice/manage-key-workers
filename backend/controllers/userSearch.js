const asyncMiddleware = require('../middleware/asyncHandler')
const log = require('../log')

const search = (eliteApi, res, agencyId, nameFilter, roleFilter) =>
  eliteApi.userSearch(res.locals, {
    nameFilter,
    roleFilter: roleFilter || '',
  })

const adminSearch = (eliteApi, res, agencyId, nameFilter, roleFilter) =>
  eliteApi.userSearchAdmin(res.locals, {
    nameFilter,
    roleFilter: roleFilter || '',
  })

const userSearchFactory = eliteApi => {
  const userSearch = asyncMiddleware(async (req, res) => {
    const { agencyId, nameFilter, roleFilter, hasAdminRole } = req.query
    log.debug(`Performing user search.  Admin role=${hasAdminRole}`)
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
