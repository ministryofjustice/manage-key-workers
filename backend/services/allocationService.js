const log = require('../log')
const { logError } = require('../logError')
const { properCaseName } = require('../../src/stringUtils')
const telemetry = require('../azure-appinsights')

// TODO: There's a lot of duplication in this module...

const serviceFactory = (elite2Api, keyworkerApi, offenderSearchResultMax) => {
  const getOffenderNumbers = (offenderResults) =>
    offenderResults && offenderResults.length && offenderResults.map((row) => row.offenderNo)

  const findCrsaForOffender = (csras, offenderNo) =>
    csras
      .filter((d) => d.offenderNo === offenderNo)
      .map((d) => d.classification)
      .find((e) => !!e) || null

  const findReleaseDateForOffender = (allReleaseDates, offenderNo) =>
    allReleaseDates
      .filter((d) => d.offenderNo === offenderNo)
      .map((d) => d.sentenceDetail && d.sentenceDetail.releaseDate)
      .find((d) => !!d) || null

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

  const offendersWithKeyworkers = async (context, offenders, availableKeyworkers, getKeyworkerDetails) => {
    const offenderNumbers = getOffenderNumbers(offenders)

    const allReleaseDates = await elite2Api.sentenceDetailList(context, offenderNumbers)
    log.debug('Response from sentenceDetailList request')

    const allCsras = await elite2Api.csraList(context, offenderNumbers)
    log.debug('Response from csraList request')

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
        keyworkerDetails.keyworkerDisplay ||
        `${properCaseName(keyworkerDetails.lastName)}, ${properCaseName(keyworkerDetails.firstName)}`

      const { offenderNo } = offenderWithAllocatedKeyworker
      const { numberAllocated } = keyworkerDetails

      return {
        ...offenderWithAllocatedKeyworker,
        keyworkerDisplay,
        numberAllocated,
        crsaClassification: findCrsaForOffender(allCsras, offenderNo),
        confirmedReleaseDate: findReleaseDateForOffender(allReleaseDates, offenderNo),
      }
    })
  }

  const unallocated = async (context, agencyId) => {
    const offenderWithLocationDtos = await keyworkerApi.unallocated(context, agencyId)
    log.debug('Response from unallocated offenders request')

    const offenderNumbers = offenderWithLocationDtos.map((offenderWithLocation) => offenderWithLocation.offenderNo)

    if (offenderNumbers.length > 0) {
      const allReleaseDates = await elite2Api.sentenceDetailList(context, offenderNumbers)
      log.debug('Response from sentenceDetailList request')

      const allCsras = await elite2Api.csraList(context, offenderNumbers)
      log.debug('Response from csraList request')

      return offenderWithLocationDtos.map((offenderWithLocation) => ({
        ...offenderWithLocation,
        crsaClassification: findCrsaForOffender(allCsras, offenderWithLocation.offenderNo),
        confirmedReleaseDate: findReleaseDateForOffender(allReleaseDates, offenderWithLocation.offenderNo),
      }))
    }
    return offenderWithLocationDtos
  }

  function warning(error) {
    if (error.response && error.response.data) {
      const msg = error.response.data.userMessage
      if (
        msg === 'No Key workers available for allocation.' ||
        msg === 'All available Key workers are at full capacity.'
      ) {
        return msg
      }
    }
    return null
  }

  const findKeyworkerStaffIdForOffender = (offenderKeyworkers, offenderNo) =>
    offenderKeyworkers
      .filter((k) => k.offenderNo === offenderNo)
      .map((k) => k.staffId)
      .find((e) => !!e) || null

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
    log.debug(`After allocation status filter of ${allocationStatus}`)

    return offenderResults.map((offender) => ({
      ...offender,
      staffId: findKeyworkerStaffIdForOffender(offenderKeyworkers, offender.offenderNo),
    }))
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
            keyworkerDisplay: `${properCaseName(keyworkerData.lastName)}, ${properCaseName(keyworkerData.firstName)}`,
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
    log.debug('Response from available keyworker request')

    const offenderWithAllocatedKeyworkerDtos = await keyworkerApi.autoallocated(context, agencyId)
    log.debug('Response from allocated offenders request')

    if (telemetry) {
      telemetry.trackEvent({ name: 'Auto allocation' })
    }
    return {
      keyworkerResponse: availableKeyworkers,
      allocatedResponse:
        offenderWithAllocatedKeyworkerDtos.length > 0
          ? await offendersWithKeyworkers(
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
    log.debug('Response from availableKeyworkers request')
    const keyworkerAllocationDetailsDtos = await keyworkerApi.keyworkerAllocations(context, staffId, agencyId)
    log.debug('Response from keyworkerAllocations request')

    const offenderNumbers = keyworkerAllocationDetailsDtos.map(
      (keyworkerAllocationDetails) => keyworkerAllocationDetails.offenderNo
    )
    if (offenderNumbers.length > 0) {
      const allReleaseDates = await elite2Api.sentenceDetailList(context, offenderNumbers)
      log.debug('Response from sentenceDetailList request')

      const allCsras = await elite2Api.csraList(context, offenderNumbers)
      log.debug('Response from csraList request')

      const kwDates = await elite2Api.caseNoteUsageList(context, offenderNumbers, staffId)
      log.debug('Response from case note usage request')

      const allocatedResponse = keyworkerAllocationDetailsDtos.map((keyworkerAllocation) => ({
        ...keyworkerAllocation,
        crsaClassification: findCrsaForOffender(allCsras, keyworkerAllocation.offenderNo),
        confirmedReleaseDate: findReleaseDateForOffender(allReleaseDates, keyworkerAllocation.offenderNo),
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

  const searchOffenders = async (context, { agencyId, keywords, locationPrefix, allocationStatus }) => {
    const offenderReturnSize = allocationStatus === 'all' ? offenderSearchResultMax + 1 : 3000
    const availableKeyworkers = await keyworkerApi.availableKeyworkers(context, agencyId)
    log.debug('Response from available keyworker request')

    const offenders = await elite2Api.searchOffenders(context, keywords, locationPrefix, offenderReturnSize)
    log.debug('Response from searchOffenders request')

    if (!(offenders && offenders.length > 0)) {
      return {
        keyworkerResponse: availableKeyworkers,
        offenderResponse: offenders,
        partialResults: false,
      }
    }

    const offenderNumbers = getOffenderNumbers(offenders)
    const offenderKeyworkers = await keyworkerApi.offenderKeyworkerList(context, agencyId, offenderNumbers)
    log.debug('Response from getOffenders request')

    const filteredOffenders = applyAllocationStatusFilter(allocationStatus, offenders, offenderKeyworkers) // adjust results if filtering by unallocated

    const partialResults = filteredOffenders.length > offenderSearchResultMax
    if (partialResults) {
      filteredOffenders.length = offenderSearchResultMax
    }

    return {
      keyworkerResponse: availableKeyworkers,
      offenderResponse:
        filteredOffenders.length > 0
          ? await offendersWithKeyworkers(context, filteredOffenders, availableKeyworkers, getKeyworkerDetails)
          : [],
      partialResults,
    }
  }

  return {
    unallocated,
    allocated,
    keyworkerAllocations,
    searchOffenders,
  }
}

module.exports = {
  serviceFactory,
}
