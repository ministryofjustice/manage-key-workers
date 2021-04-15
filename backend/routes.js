const express = require('express')
const config = require('./config')

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
const offenderSearchFactory = require('./controllers/searchOffendersController')

const homepage = require('./controllers/homepage')
const viewResidentialLocation = require('./controllers/viewResidentialLocation')
const allocateKeyWorker = require('./controllers/allocateKeyWorker')

const configureRoutes = ({ oauthApi, elite2Api, keyworkerApi, complexityOfNeedApi }) => {
  const router = express.Router()
  const allocationService = allocationServiceFactory(elite2Api, keyworkerApi, config.app.offenderSearchResultMax)

  const controller = controllerFactory(allocationService, keyworkerPrisonStatsFactory(keyworkerApi))
  router.use('/api/config', getConfiguration)
  router.use('/api/me', userMeFactory(oauthApi, elite2Api, keyworkerApi).userMeService)
  router.use('/api/usercaseloads', userCaseLoadsFactory(elite2Api).userCaseloads)
  router.use('/api/setactivecaseload', setActiveCaseLoadFactory(elite2Api).setActiveCaseload)
  router.use('/api/unallocated', controller.unallocated)
  router.use('/api/allocated', controller.allocated)
  router.use('/api/keyworkerAllocations', controller.keyworkerAllocations)
  router.use('/api/searchOffenders', controller.searchOffenders)
  router.use('/api/userLocations', userLocationsFactory(elite2Api).userLocations)
  router.use('/api/allocationHistory', allocationHistoryFactory(keyworkerApi).allocationHistory)
  router.use('/api/keyworker', keyworkerProfileFactory(keyworkerApi).keyworkerProfile)
  router.use('/api/manualoverride', manualOverrideFactory(keyworkerApi).manualOverride)
  router.use('/api/keyworkerSearch', keyworkerSearchFactory(keyworkerApi).keyworkerSearch)
  router.use('/api/autoAllocateConfirmWithOverride', autoAllocateFactory(keyworkerApi).autoAllocate)
  router.use('/api/keyworkerUpdate', keyworkerUpdateFactory(keyworkerApi).keyworkerUpdate)
  router.use('/api/autoAllocateMigrate', autoAllocationAndMigrateFactory(keyworkerApi).enableAutoAllocationAndMigrate)
  router.use(
    '/api/manualAllocateMigrate',
    manualAllocationAndMigrateFactory(keyworkerApi).enableManualAllocationAndMigrate
  )
  router.use('/api/keyworkerSettings', keyworkerSettingsFactory(keyworkerApi, elite2Api).keyworkerSettings)
  router.use('/api/keyworker-profile-stats', keyworkerStatsFactory(keyworkerApi).getStatsForStaffRoute)
  router.use('/api/keyworker-prison-stats', controller.getPrisonStats)

  const offenderSearchController = offenderSearchFactory({
    allocationService,
    complexityOfNeedApi,
    keyworkerApi,
  })

  const allocateKeyWorkerController = allocateKeyWorker({
    allocationService,
    keyworkerApi,
    oauthApi,
  })

  router.get('/manage-key-workers/search-for-prisoner', offenderSearchController.searchOffenders)
  router.post('/manage-key-workers/search-for-prisoner', offenderSearchController.validateSearchText)
  router.post('/manage-key-workers/search-for-prisoner/save', offenderSearchController.save)

  router.get(
    '/manage-key-workers/view-residential-location',
    viewResidentialLocation({ allocationService, elite2Api, keyworkerApi, complexityOfNeedApi }).index
  )
  router.post(
    '/manage-key-workers/view-residential-location',
    viewResidentialLocation({ allocationService, elite2Api, keyworkerApi, complexityOfNeedApi }).post
  )

  router.get('/manage-key-workers/allocate-key-worker', allocateKeyWorkerController.index)
  router.get('/manage-key-workers/allocate-key-worker/auto', allocateKeyWorkerController.auto)
  router.post('/manage-key-workers/allocate-key-worker', allocateKeyWorkerController.post)

  router.get('/homepage', homepage({ keyworkerApi, oauthApi }))

  router.use('/manage-key-workers', (req, res) => {
    res.redirect(req.url.replace(/\/manage-key-workers(.*)$/gi, '$1'))
  })

  return router
}

module.exports = configureRoutes
