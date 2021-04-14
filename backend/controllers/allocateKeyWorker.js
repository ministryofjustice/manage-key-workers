const { formatName, putLastNameFirst, formatTimestampToDate } = require('../utils')

module.exports = ({ allocationService, elite2Api, keyworkerApi, oauthApi }) => {
  const formatNumberAllocated = (number) => (number ? `(${number})` : '')

  const renderTemplate = async (req, res, offenderResponse, allocationMode = 'manual') => {
    const { activeCaseLoadId } = req.session?.userDetails || {}

    const [currentRoles, prisonStatus] = await Promise.all([
      oauthApi.currentRoles(res.locals),
      keyworkerApi.getPrisonMigrationStatus(res.locals, activeCaseLoadId),
    ])
    const isKeyWorkerAdmin = currentRoles.some((role) => role.roleCode === 'OMIC_ADMIN')

    const recentlyAllocated = req.flash('recentlyAllocated')

    const recentlyAllocatedOffenderNumbers = recentlyAllocated.map((allocation) => allocation.offenderNo)

    const offenderKeyworkers = recentlyAllocatedOffenderNumbers.length
      ? await keyworkerApi.offenderKeyworkerList(res.locals, activeCaseLoadId, recentlyAllocatedOffenderNumbers)
      : []

    const offenderNumbers = [...recentlyAllocated, ...offenderResponse].map((o) => o.offenderNo)

    const allKeyworkers = offenderNumbers.length
      ? await keyworkerApi.keyworkerSearch(res.locals, { agencyId: activeCaseLoadId, searchText: '', statusFilter: '' })
      : []

    const allocationHistoryData = offenderNumbers.length
      ? await keyworkerApi.allocationHistorySummary(res.locals, offenderNumbers)
      : []

    const recentlyAllocatedSentenceDetails = recentlyAllocatedOffenderNumbers.length
      ? await elite2Api.sentenceDetailList(res.locals, recentlyAllocatedOffenderNumbers)
      : []

    const recentlyUpdatedAllocations = offenderKeyworkers.map((offender) => {
      const keyworkerUser = allKeyworkers.find((keyworker) => offender.staffId === keyworker.staffId)
      const offenderDetails = recentlyAllocatedSentenceDetails.find((o) => offender.offenderNo === o.offenderNo)

      return {
        confirmedReleaseDate: offenderDetails.sentenceDetail?.confirmedReleaseDate,
        firstName: offenderDetails.firstName,
        internalLocationDesc: offenderDetails.internalLocationDesc,
        keyworkerDisplay: formatName(keyworkerUser.firstName, keyworkerUser.lastName),
        lastName: offenderDetails.lastName,
        numberAllocated: keyworkerUser.numberAllocated,
        offenderNo: offender.offenderNo,
        staffId: offender.staffId,
      }
    })

    const allPrisoners = [...recentlyUpdatedAllocations, ...offenderResponse]
      .map((offender) => ({ ...offender, name: putLastNameFirst(offender.firstName, offender.lastName) }))
      .sort((left, right) => left.name.localeCompare(right.name))

    return res.render('allocateKeyWorker', {
      activeCaseLoadId,
      allocationMode,
      canAutoAllocate: Boolean(prisonStatus.migrated && prisonStatus.autoAllocatedSupported && isKeyWorkerAdmin),
      recentlyAllocated: JSON.stringify(recentlyAllocated),
      prisoners: allPrisoners.map((offender) => {
        const { confirmedReleaseDate, offenderNo, staffId } = offender
        const isManualAllocation = allocationMode === 'manual'
        const selectableKeyworkers = isManualAllocation
          ? allKeyworkers.filter((keyworker) => keyworker.staffId !== offender.staffId && keyworker.status === 'ACTIVE')
          : allKeyworkers.filter((keyworker) => keyworker.staffId === offender.staffId || keyworker.status === 'ACTIVE')
        const sortedSelectableKeyworkers = selectableKeyworkers.sort(
          (left, right) => left.numberAllocated - right.numberAllocated
        )

        return {
          hasHistory: allocationHistoryData.find((history) => history.offenderNo === offenderNo)?.hasHistory,
          keyworkerName:
            staffId &&
            isManualAllocation &&
            `${offender.keyworkerDisplay} ${formatNumberAllocated(offender.numberAllocated)}`,
          keyworkerStaffId: staffId,
          keyworkerList: sortedSelectableKeyworkers.map((keyworker) => {
            const isAutoAllocated = keyworker.staffId === offender.staffId
            return {
              text: `${formatName(keyworker.firstName, keyworker.lastName)} ${formatNumberAllocated(
                keyworker.numberAllocated
              )}`,
              value: `${keyworker.staffId}:${offenderNo}:${isAutoAllocated ? 'A' : 'M'}`,
              selected: isAutoAllocated,
            }
          }),
          location: offender.assignedLivingUnitDesc || offender.internalLocationDesc,
          name: offender.name,
          prisonNumber: offenderNo,
          releaseDate: confirmedReleaseDate ? formatTimestampToDate(confirmedReleaseDate) : 'Not entered',
        }
      }),
    })
  }

  const index = async (req, res) => {
    const { activeCaseLoadId } = req.session?.userDetails || {}

    const offenderResponse = await allocationService.unallocated(res.locals, activeCaseLoadId)

    return renderTemplate(req, res, offenderResponse)
  }

  const auto = async (req, res) => {
    const { activeCaseLoadId } = req.session?.userDetails || {}

    const { allocatedResponse } = await allocationService.allocated(res.locals, activeCaseLoadId)

    return renderTemplate(req, res, allocatedResponse, 'auto')
  }

  const post = async (req, res) => {
    const { activeCaseLoadId } = req.session?.userDetails || {}
    const { allocateKeyworker, recentlyAllocated, allocationMode } = req.body

    const selectedKeyworkerAllocations = allocateKeyworker.filter((keyworker) => keyworker)

    const keyworkerAllocations = selectedKeyworkerAllocations.map((keyworker) => {
      const [staffId, offenderNo, allocationType] = keyworker.split(':')

      return { staffId, offenderNo, allocationType }
    })

    const allAllocations = [...keyworkerAllocations, ...JSON.parse(recentlyAllocated)]

    if (allAllocations.length) req.flash('recentlyAllocated', allAllocations)

    if (allocationMode === 'auto') await keyworkerApi.autoAllocateConfirm(res.locals, activeCaseLoadId)

    await Promise.all(
      keyworkerAllocations.map(async ({ staffId, offenderNo, allocationType }) => {
        if (allocationType === 'M') {
          await keyworkerApi.allocate(res.locals, {
            offenderNo,
            staffId,
            prisonId: activeCaseLoadId,
            allocationType,
            allocationReason: 'MANUAL',
            deallocationReason: 'OVERRIDE',
          })
        }
      })
    )

    return res.redirect('/manage-key-workers/allocate-key-worker')
  }

  return { auto, index, post }
}
