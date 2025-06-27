const log = require('../log')
const { logError } = require('../logError')
const { formatName } = require('../utils')
const telemetry = require('../azure-appinsights')

// TODO: There's a lot of duplication in this module...

const serviceFactory = (elite2Api, prisonerSearchApi, keyworkerApi, offenderSearchResultMax, systemOauthClient) => {
  const getOffenderNumbers = (offenderResults) =>
    offenderResults && offenderResults.length && offenderResults.map((row) => row.offenderNo)

  const findForOffender = (offenders, offenderNo) => {
    const find = offenders.find((d) => d.offenderNo === offenderNo)
    return find && { crsaClassification: find.csra, confirmedReleaseDate: find.releaseDate }
  }

  const findKeyworkerCaseNoteDate = (kwDates, offenderNo) =>
    kwDates
      .filter((d) => d.offenderNo === offenderNo)
      .map((d) => d.latestCaseNote)
      .reduce((acc, cur) => (cur > acc ? cur : acc), '') || null

  const findKeyworkerNumKeyWorkerSessions = (kwDates, offenderNo) =>
    kwDates
      .filter((d) => d.offenderNo === offenderNo)
      .map((d) => d.numCaseNotes)
      .reduce((acc, cur) => (cur > acc ? cur : acc), '') || null

  const reduceToKeyworkerMap = (keyworkers) =>
    keyworkers.reduce((keyworkerMap, keyworker) => {
      keyworkerMap.set(keyworker.staffId, keyworker)
      return keyworkerMap
    }, new Map())

  const offendersWithKeyworkers = async (
    context,
    offenders,
    availableKeyworkers,
    getKeyworkerDetails,
    allPrisoners
  ) => {
    const keyworkerLookup = offenders
      .filter((offender) => !availableKeyworkers.find((keyworker) => keyworker.staffId === offender.staffId))
      .map((o) => ({
        staffId: o.staffId,
        agencyId: o.agencyId,
      }))

    const extraKeyworkers = await Promise.all(
      keyworkerLookup
        .filter((lookup) => lookup.staffId !== null)
        .map((lookup) => getKeyworkerDetails(context, lookup.staffId, lookup.agencyId))
    )

    const keyworkerMap = reduceToKeyworkerMap([...availableKeyworkers, ...extraKeyworkers])

    const noAssignedKeyWorker = {
      keyworkerDisplay: '--',
      numberAllocated: 'n/a',
    }

    return offenders.map((offenderWithAllocatedKeyworker) => {
      const keyworkerDetails = keyworkerMap.get(offenderWithAllocatedKeyworker.staffId) || noAssignedKeyWorker

      const keyworkerDisplay =
        keyworkerDetails.keyworkerDisplay || formatName(keyworkerDetails.firstName, keyworkerDetails.lastName)

      const { offenderNo } = offenderWithAllocatedKeyworker
      const { numberAllocated } = keyworkerDetails

      return {
        ...offenderWithAllocatedKeyworker,
        keyworkerDisplay,
        numberAllocated,
        ...findForOffender(allPrisoners, offenderNo),
      }
    })
  }

  const offendersWithKeyworkersGettingPrisoners = async (
    context,
    offenders,
    availableKeyworkers,
    getKeyworkerDetails
  ) => {
    const offenderNumbers = getOffenderNumbers(offenders)
    const systemContext = await systemOauthClient.getClientCredentialsTokens(context.username)
    const allPrisoners = await prisonerSearchApi.getOffenders(systemContext, offenderNumbers)
    return offendersWithKeyworkers(context, offenders, availableKeyworkers, getKeyworkerDetails, allPrisoners)
  }

  const unallocated = async (context, agencyId) => {
    const offenderWithLocationDtos = await keyworkerApi.unallocated(context, agencyId)

    const offenderNumbers = offenderWithLocationDtos.map((offenderWithLocation) => offenderWithLocation.offenderNo)

    if (offenderNumbers.length > 0) {
      const systemContext = await systemOauthClient.getClientCredentialsTokens(context.username)
      const allPrisoners = await prisonerSearchApi.getOffenders(systemContext, offenderNumbers)

      return offenderWithLocationDtos.map((offenderWithLocation) => ({
        ...offenderWithLocation,
        ...findForOffender(allPrisoners, offenderWithLocation.offenderNo),
      }))
    }
    return offenderWithLocationDtos
  }

  function warning(error) {
    if (error.response && error.response.body) {
      const devMsg = error.response.body.developerMessage
      const userMsg = error.response.body.userMessage
      const filter = ['No Key workers available for allocation.', 'All available Key workers are at full capacity.']
      return filter.find((msg) => devMsg.includes(msg) || userMsg.includes(msg))
    }
    return null
  }

  const findKeyworkerStaffIdForOffender = (offenderKeyworkers, offenderNo) =>
    offenderKeyworkers
      .filter((k) => k.offenderNo === offenderNo)
      .map((k) => k.staffId)
      .find((e) => !!e) || null

  const decorate = (offenders, offenderKeyworkers) =>
    offenders.map((offender) => ({
      ...offender,
      staffId: findKeyworkerStaffIdForOffender(offenderKeyworkers, offender.offenderNo),
    }))

  const applyAllocationStatusFilter = (allocationStatus, currentOffenderResults, offenderKeyworkers) => {
    let offenderResults = currentOffenderResults

    switch (allocationStatus) {
      case 'unallocated':
        offenderResults = offenderResults.filter(
          (offender) => !offenderKeyworkers.find((keyWorker) => keyWorker.offenderNo === offender.offenderNo)
        )
        break
      case 'allocated':
        offenderResults = offenderResults.filter((offender) =>
          offenderKeyworkers.find((keyWorker) => keyWorker.offenderNo === offender.offenderNo)
        )
        break
      default:
        break
    }

    return offenderResults
  }

  /**
   *
   * @param context
   * @param staffId
   * @param agencyId
   * @returns {Promise<{}>} of { staffId, firstName, lastName, keyworkerDisplay, numberAllocated }
   */
  const getKeyworkerDetails = async (context, staffId, agencyId) => {
    try {
      const keyworkerData = await keyworkerApi.keyworker(context, staffId, agencyId)
      return keyworkerData
        ? {
            staffId: keyworkerData.staffId,
            firstName: keyworkerData.firstName,
            lastName: keyworkerData.lastName,
            keyworkerDisplay: formatName(keyworkerData.firstName, keyworkerData.lastName),
            numberAllocated: keyworkerData.numberAllocated,
          }
        : {
            keyworkerDisplay: '--',
            numberAllocated: 'n/a',
          }
    } catch (error) {
      logError('Not available', error, 'Error in addMissingKeyworkerDetails')
      throw error
    }
  }

  /**
   * 1) Run the auto-allocation process for an agency/prison
   * 2) Return information about the keyworker allocations for an agency/prison.
   * @param context
   * @param agencyId
   * @returns {Promise<{keyworkerResponse: *, allocatedResponse: *, warning: string}>}
   */
  const allocated = async (context, agencyId) => {
    let insufficientKeyworkers = ''
    try {
      await keyworkerApi.autoAllocate(context, agencyId)
    } catch (error) {
      const msg = warning(error)
      if (msg) {
        log.warn({ data: error.response }, 'Caught warning')
        insufficientKeyworkers = msg
      } else {
        throw error
      }
    }

    const availableKeyworkers = await keyworkerApi.availableKeyworkers(context, agencyId)

    const offenderWithAllocatedKeyworkerDtos = await keyworkerApi.autoallocated(context, agencyId)

    if (telemetry) {
      telemetry.trackEvent({ name: 'Auto allocation' })
    }
    return {
      keyworkerResponse: availableKeyworkers,
      allocatedResponse:
        offenderWithAllocatedKeyworkerDtos.length > 0
          ? await offendersWithKeyworkersGettingPrisoners(
              context,
              offenderWithAllocatedKeyworkerDtos,
              availableKeyworkers,
              getKeyworkerDetails
            )
          : [],
      warning: insufficientKeyworkers,
    }
  }

  const keyworkerAllocations = async (context, staffId, agencyId) => {
    const keyworkers = await keyworkerApi.availableKeyworkers(context, agencyId)
    const keyworkerAllocationDetailsDtos = await keyworkerApi.keyworkerAllocations(context, staffId, agencyId)

    const offenderNumbers = keyworkerAllocationDetailsDtos.map(
      (keyworkerAllocationDetails) => keyworkerAllocationDetails.offenderNo
    )
    if (offenderNumbers.length > 0) {
      const systemContext = await systemOauthClient.getClientCredentialsTokens(context.username)
      const allPrisoners = await prisonerSearchApi.getOffenders(systemContext, offenderNumbers)

      const kwDates = await elite2Api.caseNoteUsageList(systemContext, offenderNumbers, staffId)

      const allocatedResponse = keyworkerAllocationDetailsDtos.map((keyworkerAllocation) => ({
        ...keyworkerAllocation,
        ...findForOffender(allPrisoners, keyworkerAllocation.offenderNo),
        lastKeyWorkerSessionDate: findKeyworkerCaseNoteDate(kwDates, keyworkerAllocation.offenderNo),
        numKeyWorkerSessions: findKeyworkerNumKeyWorkerSessions(kwDates, keyworkerAllocation.offenderNo),
      }))

      return {
        allocatedResponse,
        keyworkerResponse: keyworkers,
      }
    }

    return {
      keyworkerResponse: keyworkers,
      allocatedResponse: keyworkerAllocationDetailsDtos,
    }
  }

  const searchOffendersPaginated = async (context, { agencyId, locationPrefix, pageRequest }) => {
    const systemContext = await systemOauthClient.getClientCredentialsTokens(context.username)

    const [availableKeyworkers, offenders] = await Promise.all([
      keyworkerApi.availableKeyworkers(context, agencyId),
      prisonerSearchApi.searchOffendersPaginated(systemContext, agencyId, locationPrefix, pageRequest),
    ])

    const totalRecords = systemContext.totalElements
    const pageOffset = Number(systemContext.pageOffset)

    if (totalRecords === 0) {
      return {
        keyworkerResponse: availableKeyworkers,
        offenderResponse: offenders,
        totalRecords: 0,
        pageNumber: 0,
      }
    }

    const offenderNumbers = getOffenderNumbers(offenders)
    const offenderKeyworkers = await keyworkerApi.offenderKeyworkerList(context, agencyId, offenderNumbers)

    return {
      keyworkerResponse: availableKeyworkers,
      totalRecords,
      pageOffset,
      offenderResponse:
        offenders.length > 0
          ? await offendersWithKeyworkers(
              context,
              decorate(offenders, offenderKeyworkers),
              availableKeyworkers,
              getKeyworkerDetails,
              offenders
            )
          : [],
    }
  }

  const searchOffenders = async (context, { agencyId, keywords, locationPrefix, allocationStatus }) => {
    const offenderReturnSize = allocationStatus === 'all' ? offenderSearchResultMax + 1 : 3000

    const systemContext = await systemOauthClient.getClientCredentialsTokens(context.username)

    const [availableKeyworkers, offenders] = await Promise.all([
      keyworkerApi.availableKeyworkers(context, agencyId),
      prisonerSearchApi.searchOffenders(systemContext, keywords, locationPrefix, offenderReturnSize),
    ])

    if (!(offenders && offenders.length > 0)) {
      return {
        keyworkerResponse: availableKeyworkers,
        offenderResponse: offenders,
        partialResults: false,
      }
    }

    const offenderNumbers = getOffenderNumbers(offenders)
    const offenderKeyworkers = await keyworkerApi.offenderKeyworkerList(context, agencyId, offenderNumbers)
    const filteredOffenders = decorate(
      applyAllocationStatusFilter(allocationStatus, offenders, offenderKeyworkers),
      offenderKeyworkers
    ) // adjust results if filtering by unallocated

    const partialResults = filteredOffenders.length > offenderSearchResultMax
    if (partialResults) {
      filteredOffenders.length = offenderSearchResultMax
    }

    return {
      keyworkerResponse: availableKeyworkers,
      offenderResponse:
        filteredOffenders.length > 0
          ? await offendersWithKeyworkers(
              context,
              filteredOffenders,
              availableKeyworkers,
              getKeyworkerDetails,
              offenders
            )
          : [],
      partialResults,
    }
  }

  return {
    unallocated,
    allocated,
    keyworkerAllocations,
    searchOffenders,
    searchOffendersPaginated,
  }
}

module.exports = {
  serviceFactory,
}
