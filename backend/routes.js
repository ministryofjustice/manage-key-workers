const express = require('express')
const config = require('./config')

const withErrorHandler = require('./middleware/asyncHandler')
const { userLocationsFactory } = require('./controllers/userLocations')
const { allocationHistoryFactory } = require('./controllers/allocationHistory')
const { manualOverrideFactory } = require('./controllers/manualoverride')
const autoAllocateFactory = require('./controllers/autoAllocateConfirmWithOverride').factory
const { keyworkerSearchFactory } = require('./controllers/keyworkerSearch')
const { keyworkerProfileFactory } = require('./controllers/keyworkerProfile')
const { keyworkerUpdateFactory } = require('./controllers/keyworkerUpdate')
const { userMeFactory } = require('./controllers/userMe')
const { enableNewNomisFactory } = require('./controllers/enableNewNomis')
const { autoAllocationAndMigrateFactory } = require('./controllers/autoAllocationMigrate')
const { manualAllocationAndMigrateFactory } = require('./controllers/manualAllocationMigrate')
const { keyworkerSettingsFactory } = require('./controllers/keyworkerSettings')
const { getRolesFactory } = require('./controllers/getRoles')
const { getUserFactory } = require('./controllers/getUser')
const { removeRoleFactory } = require('./controllers/removeRole')
const { addRoleFactory } = require('./controllers/addRole')
const { contextUserRolesFactory } = require('./controllers/contextUserRoles')
const { userSearchFactory } = require('./controllers/userSearch')
const authUserMaintenanceFactory = require('./controllers/authUserMaintenance')
const { getConfiguration } = require('./controllers/getConfig')
const { keyworkerStatsFactory } = require('./controllers/keyworkerStats')
const userCaseLoadsFactory = require('./controllers/usercaseloads').userCaseloadsFactory
const setActiveCaseLoadFactory = require('./controllers/setactivecaseload').activeCaseloadFactory

const { keyworkerPrisonStatsFactory } = require('./controllers/keyworkerPrisonStats')
const controllerFactory = require('./controllers/controller').factory
const allocationServiceFactory = require('./services/allocationService').serviceFactory

const configureRoutes = ({ oauthApi, elite2Api, keyworkerApi }) => {
  const router = express.Router()
  const controller = controllerFactory(
    allocationServiceFactory(elite2Api, keyworkerApi, config.app.offenderSearchResultMax),
    keyworkerPrisonStatsFactory(keyworkerApi)
  )
  router.use('/api/config', withErrorHandler(getConfiguration))
  router.use('/api/me', withErrorHandler(userMeFactory(oauthApi, elite2Api, keyworkerApi).userMeService))
  router.use('/api/usercaseloads', withErrorHandler(userCaseLoadsFactory(elite2Api).userCaseloads))
  router.use('/api/setactivecaseload', withErrorHandler(setActiveCaseLoadFactory(elite2Api).setActiveCaseload))
  router.use('/api/unallocated', withErrorHandler(controller.unallocated))
  router.use('/api/allocated', withErrorHandler(controller.allocated))
  router.use('/api/keyworkerAllocations', withErrorHandler(controller.keyworkerAllocations))
  router.use('/api/searchOffenders', withErrorHandler(controller.searchOffenders))
  router.use('/api/userLocations', withErrorHandler(userLocationsFactory(elite2Api).userLocations))
  router.use('/api/allocationHistory', withErrorHandler(allocationHistoryFactory(keyworkerApi).allocationHistory))
  router.use('/api/keyworker', withErrorHandler(keyworkerProfileFactory(keyworkerApi).keyworkerProfile))
  router.use('/api/manualoverride', withErrorHandler(manualOverrideFactory(keyworkerApi).manualOverride))
  router.use('/api/keyworkerSearch', withErrorHandler(keyworkerSearchFactory(keyworkerApi).keyworkerSearch))
  router.use('/api/autoAllocateConfirmWithOverride', withErrorHandler(autoAllocateFactory(keyworkerApi).autoAllocate))
  router.use('/api/keyworkerUpdate', withErrorHandler(keyworkerUpdateFactory(keyworkerApi).keyworkerUpdate))
  router.use('/api/enableNewNomis', withErrorHandler(enableNewNomisFactory(elite2Api).enableNewNomis))
  router.use(
    '/api/autoAllocateMigrate',
    withErrorHandler(autoAllocationAndMigrateFactory(keyworkerApi).enableAutoAllocationAndMigrate)
  )
  router.use(
    '/api/manualAllocateMigrate',
    withErrorHandler(manualAllocationAndMigrateFactory(keyworkerApi).enableManualAllocationAndMigrate)
  )
  router.use(
    '/api/keyworkerSettings',
    withErrorHandler(keyworkerSettingsFactory(keyworkerApi, elite2Api).keyworkerSettings)
  )
  router.use('/api/userSearch', withErrorHandler(userSearchFactory(elite2Api).userSearch))
  const authUserMaintenance = authUserMaintenanceFactory(oauthApi)
  router.use('/api/auth-user-get', withErrorHandler(authUserMaintenance.getUser))
  router.use('/api/auth-user-create', withErrorHandler(authUserMaintenance.createUser))
  router.use('/api/auth-user-search', withErrorHandler(authUserMaintenance.search))
  router.use('/api/auth-user-roles', withErrorHandler(authUserMaintenance.roles))
  router.use('/api/auth-user-groups', withErrorHandler(authUserMaintenance.groups))
  router.use('/api/auth-user-roles-add', withErrorHandler(authUserMaintenance.addRole))
  router.use('/api/auth-user-roles-remove', withErrorHandler(authUserMaintenance.removeRole))
  router.use('/api/auth-user-groups-add', withErrorHandler(authUserMaintenance.addGroup))
  router.use('/api/auth-user-groups-remove', withErrorHandler(authUserMaintenance.removeGroup))
  router.use('/api/auth-user-enable', withErrorHandler(authUserMaintenance.enableUser))
  router.use('/api/auth-user-disable', withErrorHandler(authUserMaintenance.disableUser))
  router.use('/api/auth-roles', withErrorHandler(authUserMaintenance.allRoles))
  router.use('/api/auth-groups', withErrorHandler(authUserMaintenance.assignableGroups))
  router.use('/api/auth-user-create', withErrorHandler(authUserMaintenance.createUser))
  router.use('/api/auth-user-amend', withErrorHandler(authUserMaintenance.amendUser))
  router.use('/api/getRoles', withErrorHandler(getRolesFactory(elite2Api).getRoles))
  router.use('/api/getUser', withErrorHandler(getUserFactory(elite2Api).getUser))
  router.use('/api/removeRole', withErrorHandler(removeRoleFactory(elite2Api).removeRole))
  router.use('/api/addRole', withErrorHandler(addRoleFactory(elite2Api).addRole))
  router.use('/api/contextUserRoles', withErrorHandler(contextUserRolesFactory(elite2Api).contextUserRoles))
  router.use(
    '/api/keyworker-profile-stats',
    withErrorHandler(keyworkerStatsFactory(keyworkerApi).getStatsForStaffRoute)
  )
  router.use('/api/keyworker-prison-stats', withErrorHandler(controller.getPrisonStats))

  return router
}

module.exports = configureRoutes
