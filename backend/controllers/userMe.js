const userMeFactory = (oauthApi, elite2Api, keyworkerApi) => {
  const userMeService = async (req, res) => {
    const context = res.locals
    const user = await oauthApi.currentUser(context)
    const caseloads = await elite2Api.userCaseLoads(context)
    const activeCaseLoad = caseloads.find(cl => cl.currentlyActive)
    const activeCaseLoadId = activeCaseLoad ? activeCaseLoad.caseLoadId : null

    const prisonStatus = await keyworkerApi.getPrisonMigrationStatus(context, activeCaseLoadId)
    const roles = await oauthApi.userRoles(context)

    const isKeyWorkerAdmin = roles.filter(role => role.roleCode === 'OMIC_ADMIN').length > 0

    const hasMaintainAccessRolesRole = roles.filter(role => role.roleCode === 'MAINTAIN_ACCESS_ROLES').length > 0

    const hasMaintainAccessRolesAdminRole =
      roles.filter(role => role.roleCode === 'MAINTAIN_ACCESS_ROLES_ADMIN').length > 0

    const hasKwMigrationRole = roles.filter(role => role.roleCode === 'KW_MIGRATION').length > 0

    const response = {
      ...user,
      activeCaseLoadId,
      writeAccess: Boolean(prisonStatus.migrated && isKeyWorkerAdmin),
      migration: hasKwMigrationRole,
      maintainAccess: hasMaintainAccessRolesRole,
      maintainAccessAdmin: hasMaintainAccessRolesAdminRole,
      prisonMigrated: Boolean(prisonStatus.migrated),
    }
    res.json(response)
  }

  return { userMeService }
}

module.exports = { userMeFactory }
