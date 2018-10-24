const log = require('../log')
const { logError } = require('../logError')
const { properCaseName } = require('../../src/stringUtils')
const telemetry = require('../azure-appinsights')

// TODO: There's a lot of duplication in this module...

const serviceFactory = (elite2Api, keyworkerApi, offenderSearchResultMax) => {
  const findCrsaForOffender = (csras, offenderNo) => {
    const details = csras.filter(details => details.offenderNo === offenderNo)
    if (details.length < 1) {
      return
    }
    const detail = details[0]
    return detail && detail.classification
  }

  const findReleaseDateForOffender = (allReleaseDates, offenderNo) => {
    const details = allReleaseDates.filter(details => details.offenderNo === offenderNo)
    if (details.length < 1) {
      return
    }
    const detail = details[0]
    return detail && detail.sentenceDetail && detail.sentenceDetail.releaseDate
  }

  const findKeyworkerCaseNoteDate = (kwDates, offenderNo) => {
    const details = kwDates.filter(details => details.offenderNo === offenderNo)
    if (details.length < 1) {
      return
    }
    return details.reduce(
      (previous, current, index) => (current.latestCaseNote > previous.latestCaseNote && index ? current : previous)
    ).latestCaseNote
  }

  const unallocated = async (context, agencyId) => {
    const offenderWithLocationDtos = await keyworkerApi.unallocated(context, agencyId)
    log.debug({ data: offenderWithLocationDtos }, 'Response from unallocated offenders request')

    const offenderNumbers = offenderWithLocationDtos.map(offenderWithLocation => offenderWithLocation.offenderNo)
    if (offenderNumbers.length > 0) {
      const allReleaseDates = await elite2Api.sentenceDetailList(context, offenderNumbers)
      log.debug({ data: allReleaseDates }, 'Response from sentenceDetailList request')

      const allCsras = await elite2Api.csraList(context, offenderNumbers)
      log.debug({ data: allCsras }, 'Response from csraList request')

      for (const offenderWithLocation of offenderWithLocationDtos) {
        const { offenderNo } = offenderWithLocation
        offenderWithLocation.crsaClassification = findCrsaForOffender(allCsras, offenderNo)
        offenderWithLocation.confirmedReleaseDate = findReleaseDateForOffender(allReleaseDates, offenderNo)
      }
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

  const getOffenderNumbers = offenderResults =>
    offenderResults && offenderResults.length && offenderResults.map(row => row.offenderNo)

  const findKeyworkerStaffIdForOffender = (offenderKeyworkers, offenderNo) => {
    const keyworkerAssignmentsForOffender = offenderKeyworkers.filter(
      offenderKeyworker => offenderKeyworker.offenderNo === offenderNo
    )
    if (keyworkerAssignmentsForOffender.length >= 1) {
      const offenderKeyworker = keyworkerAssignmentsForOffender[0]
      return offenderKeyworker && offenderKeyworker.staffId
    }
  }

  const applyAllocationStatusFilter = (allocationStatus, currentOffenderResults, offenderKeyworkers) => {
    let offenderResults = currentOffenderResults

    switch (allocationStatus) {
      case 'unallocated':
        offenderResults = offenderResults.filter(
          offender => !offenderKeyworkers.find(keyWorker => keyWorker.offenderNo === offender.offenderNo)
        )
        break
      case 'allocated':
        offenderResults = offenderResults.filter(offender =>
          offenderKeyworkers.find(keyWorker => keyWorker.offenderNo === offender.offenderNo)
        )
        break
      default:
        break
    }
    log.debug(`After allocation status filter of ${allocationStatus} - new offender list is:`, {
      searchOffenders: offenderResults,
    })
    return offenderResults
  }

  /**
   *
   * @param context
   * @param staffId
   * @param agencyId
   * @returns {Promise<{}>} of { keyworkerDisplay, numberAllocated }
   */
  const getKeyworkerDetails = async (context, staffId, agencyId) => {
    try {
      const keyworkerData = await keyworkerApi.keyworker(context, staffId, agencyId)
      return keyworkerData
        ? {
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
    log.debug({ availableKeyworkers }, 'Response from available keyworker request')

    const offenderWithAllocatedKeyworkerDtos = await keyworkerApi.autoallocated(context, agencyId)
    log.debug({ offenders: offenderWithAllocatedKeyworkerDtos }, 'Response from allocated offenders request')

    if (telemetry) {
      telemetry.trackEvent({ name: 'Auto allocation' })
    }

    const offenderNumbers = offenderWithAllocatedKeyworkerDtos.map(offender => offender.offenderNo)
    if (offenderNumbers.length > 0) {
      const allReleaseDates = await elite2Api.sentenceDetailList(context, offenderNumbers)
      log.debug({ data: allReleaseDates }, 'Response from sentenceDetailList request')

      const allCsras = await elite2Api.csraList(context, offenderNumbers)
      log.debug({ data: allCsras }, 'Response from csraList request')

      for (const offenderWithAllocatedKeyworker of offenderWithAllocatedKeyworkerDtos) {
        const keyworker = availableKeyworkers.find(
          keyworker => keyworker.staffId === offenderWithAllocatedKeyworker.staffId
        )
        if (keyworker) {
          offenderWithAllocatedKeyworker.keyworkerDisplay = `${properCaseName(keyworker.lastName)}, ${properCaseName(
            keyworker.firstName
          )}`
          offenderWithAllocatedKeyworker.numberAllocated = keyworker.numberAllocated
        } else {
          const details = await getKeyworkerDetails(
            context,
            offenderWithAllocatedKeyworker.staffId,
            offenderWithAllocatedKeyworker.agencyId
          )

          offenderWithAllocatedKeyworker.keyworkerDisplay = details.keyworkerDisplay
          offenderWithAllocatedKeyworker.numberAllocated = details.numberAllocated
        }
        const { offenderNo } = offenderWithAllocatedKeyworker
        offenderWithAllocatedKeyworker.crsaClassification = findCrsaForOffender(allCsras, offenderNo)
        offenderWithAllocatedKeyworker.confirmedReleaseDate = findReleaseDateForOffender(allReleaseDates, offenderNo)
      }
    }
    return {
      keyworkerResponse: availableKeyworkers,
      allocatedResponse: offenderWithAllocatedKeyworkerDtos,
      warning: insufficientKeyworkers,
    }
  }

  const keyworkerAllocations = async (context, staffId, agencyId) => {
    const keyworkers = await keyworkerApi.availableKeyworkers(context, agencyId)
    log.debug({ data: keyworkers }, 'Response from availableKeyworkers request')
    const keyworkerAllocationDetailsDtos = await keyworkerApi.keyworkerAllocations(context, staffId, agencyId)
    log.debug({ data: keyworkerAllocationDetailsDtos }, 'Response from keyworkerAllocations request')

    const offenderNumbers = keyworkerAllocationDetailsDtos.map(
      keyworkerAllocationDetails => keyworkerAllocationDetails.offenderNo
    )
    if (offenderNumbers.length > 0) {
      const allReleaseDates = await elite2Api.sentenceDetailList(context, offenderNumbers)
      log.debug({ data: allReleaseDates }, 'Response from sentenceDetailList request')

      const allCsras = await elite2Api.csraList(context, offenderNumbers)
      log.debug({ data: allCsras }, 'Response from csraList request')

      const kwDates = await elite2Api.caseNoteUsageList(context, offenderNumbers)
      log.debug({ data: kwDates }, 'Response from case note usage request')

      for (const keyworkerAllocation of keyworkerAllocationDetailsDtos) {
        const { offenderNo } = keyworkerAllocation
        keyworkerAllocation.crsaClassification = findCrsaForOffender(allCsras, offenderNo)
        keyworkerAllocation.confirmedReleaseDate = findReleaseDateForOffender(allReleaseDates, offenderNo)
        keyworkerAllocation.lastKeyWorkerSessionDate = findKeyworkerCaseNoteDate(kwDates, offenderNo)
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
    log.debug({ availableKeyworkers }, 'Response from available keyworker request')

    const offenders = await elite2Api.searchOffenders(context, keywords, locationPrefix, offenderReturnSize)
    log.debug({ searchOffenders: offenders }, 'Response from searchOffenders request')

    if (!(offenders && offenders.length > 0)) {
      return {
        keyworkerResponse: availableKeyworkers,
        offenderResponse: offenders,
        partialResults: false,
      }
    }

    const offenderNumbers = getOffenderNumbers(offenders)
    const offenderKeyworkers = await keyworkerApi.offenderKeyworkerList(context, agencyId, offenderNumbers)
    log.debug({ data: offenderKeyworkers }, 'Response from getOffenders request')

    const filteredOffenders = applyAllocationStatusFilter(allocationStatus, offenders, offenderKeyworkers) // adjust results if filtering by unallocated

    const partialResults = filteredOffenders.length > offenderSearchResultMax
    if (partialResults) {
      filteredOffenders.length = offenderSearchResultMax
    }

    if (filteredOffenders.length > 0) {
      const filteredOffenderNumbers = getOffenderNumbers(filteredOffenders)
      const allReleaseDates = await elite2Api.sentenceDetailList(context, filteredOffenderNumbers)
      log.debug({ data: allReleaseDates }, 'Response from sentenceDetailList request')

      const allCsras = await elite2Api.csraList(context, filteredOffenderNumbers)
      log.debug({ data: allCsras }, 'Response from csraList request')

      for (const offender of filteredOffenders) {
        const { offenderNo } = offender
        const staffId = findKeyworkerStaffIdForOffender(offenderKeyworkers, offenderNo)

        offender.staffId = staffId

        if (staffId) {
          const keyworker = availableKeyworkers.find(keyworker => keyworker.staffId === staffId)
          if (keyworker) {
            // eslint-disable-line max-depth
            offender.keyworkerDisplay = `${properCaseName(keyworker.lastName)}, ${properCaseName(keyworker.firstName)}`
            offender.numberAllocated = keyworker.numberAllocated
          } else {
            const details = await getKeyworkerDetails(context, staffId, offender.agencyId)
            offender.keyworkerDisplay = details.keyworkerDisplay
            offender.numberAllocated = details.numberAllocated
          }
        }
        offender.crsaClassification = findCrsaForOffender(allCsras, offenderNo)
        offender.confirmedReleaseDate = findReleaseDateForOffender(allReleaseDates, offenderNo)
      }
    }
    return {
      keyworkerResponse: availableKeyworkers,
      offenderResponse: filteredOffenders,
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
