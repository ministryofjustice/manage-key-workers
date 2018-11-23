const asyncMiddleware = require('../middleware/asyncHandler')

const userMeFactory = (elite2Api, keyworkerApi) => {
  const userMeService = async context => {
    const user = await elite2Api.currentUser(context)
    const { activeCaseLoadId } = user

    const prisonStatus = await keyworkerApi.getPrisonMigrationStatus(context, activeCaseLoadId)
    const roles = await elite2Api.getUserAccessRoles(context)

    const isKeyWorkerAdmin = roles.filter(role => role.roleCode === 'OMIC_ADMIN').length > 0

    const hasMaintainAccessRolesRole = roles.filter(role => role.roleCode === 'MAINTAIN_ACCESS_ROLES').length > 0

    const hasMaintainAccessRolesAdminRole =
      roles.filter(role => role.roleCode === 'MAINTAIN_ACCESS_ROLES_ADMIN').length > 0

    const hasKwMigrationRole = roles.filter(role => role.roleCode === 'KW_MIGRATION').length > 0

    return {
      ...user,
      writeAccess: Boolean(prisonStatus.migrated && isKeyWorkerAdmin),
      migration: hasKwMigrationRole,
      maintainAccess: hasMaintainAccessRolesRole,
      maintainAccessAdmin: hasMaintainAccessRolesAdminRole,
      prisonMigrated: Boolean(prisonStatus.migrated),
    }
  }
  const userMe = asyncMiddleware(async (req, res) => {
    const data = await userMeService(res.locals)
    res.json(data)
  })

  return {
    userMe,
    userMeService,
  }
}

module.exports = {
  userMeFactory,
}
