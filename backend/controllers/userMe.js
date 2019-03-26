const userMeFactory = (oauthApi, elite2Api, keyworkerApi) => {
  const userMeService = async (req, res) => {
    const context = res.locals
    const user = await oauthApi.currentUser(context)
    const caseloads = await elite2Api.userCaseLoads(context)
    const activeCaseLoad = caseloads.find(cl => cl.currentlyActive)
    const activeCaseLoadId = activeCaseLoad ? activeCaseLoad.caseLoadId : null

    const prisonStatus = await keyworkerApi.getPrisonMigrationStatus(context, activeCaseLoadId)
    const roles = await oauthApi.userRoles(context)

    const isKeyWorkerAdmin = roles.some(role => role.roleCode === 'OMIC_ADMIN')
    const hasMaintainAccessRolesRole = roles.some(role => role.roleCode === 'MAINTAIN_ACCESS_ROLES')
    const hasMaintainAccessRolesAdminRole = roles.some(role => role.roleCode === 'MAINTAIN_ACCESS_ROLES_ADMIN')
    const hasKwMigrationRole = roles.some(role => role.roleCode === 'KW_MIGRATION')
    const hasMaintainAuthUsersRole = roles.some(role => role.roleCode === 'MAINTAIN_OAUTH_USERS')

    const response = {
      ...user,
      activeCaseLoadId,
      writeAccess: Boolean(prisonStatus.migrated && isKeyWorkerAdmin),
      migration: hasKwMigrationRole,
      maintainAccess: hasMaintainAccessRolesRole,
      maintainAccessAdmin: hasMaintainAccessRolesAdminRole,
      maintainAuthUsers: hasMaintainAuthUsersRole,
      prisonMigrated: Boolean(prisonStatus.migrated),
    }
    res.json(response)
  }

  return { userMeService }
}

module.exports = { userMeFactory }
