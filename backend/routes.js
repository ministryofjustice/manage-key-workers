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
const { autoAllocationAndMigrateFactory } = require('./controllers/autoAllocationMigrate')
const { manualAllocationAndMigrateFactory } = require('./controllers/manualAllocationMigrate')
const { keyworkerSettingsFactory } = require('./controllers/keyworkerSettings')
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
  router.use(
    '/api/keyworker-profile-stats',
    withErrorHandler(keyworkerStatsFactory(keyworkerApi).getStatsForStaffRoute)
  )
  router.use('/api/keyworker-prison-stats', withErrorHandler(controller.getPrisonStats))

  router.use('/manage-key-workers', (req, res, next) => {
    res.redirect(req.url.replace(/\/manage-key-workers(.*)$/gi, '$1'))
    next()
  })
  return router
}

module.exports = configureRoutes
