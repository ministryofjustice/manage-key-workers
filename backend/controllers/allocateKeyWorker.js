const { formatName, putLastNameFirst, formatTimestampToDate } = require('../utils')

module.exports = ({ allocationService, elite2Api, keyworkerApi }) => {
  const formatNumberAllocated = (number) => (number ? `(${number})` : '')

  const renderTemplate = async (req, res, offenderResponse, allocationMode = 'manual') => {
    const { activeCaseLoadId } = req.session?.userDetails || {}

    const availableKeyworkers = await keyworkerApi.availableKeyworkers(res.locals, activeCaseLoadId)

    const recentlyAllocated = req.flash('recentlyAllocated')

    const recentlyAllocatedOffenderNumbers = recentlyAllocated.map((allocation) => allocation.offenderNo)

    const offenderKeyworkers = recentlyAllocatedOffenderNumbers.length
      ? await keyworkerApi.offenderKeyworkerList(res.locals, activeCaseLoadId, recentlyAllocatedOffenderNumbers)
      : []

    const offenderNumbers = [...recentlyAllocated, ...offenderResponse].map((o) => o.offenderNo)

    const allocationHistoryData = offenderNumbers.length
      ? await Promise.all(
          offenderNumbers.map(async (offenderNo) => {
            const history = await keyworkerApi.allocationHistory(res.locals, offenderNo)
            return { offenderNo, hasHistory: Boolean(history?.allocationHistory?.length) }
          })
        )
      : []

    const recentlyAllocatedSentenceDetails = recentlyAllocatedOffenderNumbers.length
      ? await elite2Api.sentenceDetailList(res.locals, recentlyAllocatedOffenderNumbers)
      : []

    const recentlyUpdatedAllocations = offenderKeyworkers.map((offender) => {
      const keyworkerUser = availableKeyworkers.find((keyworker) => offender.staffId === keyworker.staffId)
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
      formValues: req.query,
      recentlyAllocated: JSON.stringify(recentlyAllocated),
      prisoners: allPrisoners.map((offender) => {
        const { confirmedReleaseDate, offenderNo, staffId } = offender
        const otherKeyworkers = availableKeyworkers.filter((keyworker) => keyworker.staffId !== offender.staffId)

        return {
          hasHistory: allocationHistoryData.find((history) => history.offenderNo === offenderNo)?.hasHistory,
          keyworkerName: staffId && `${offender.keyworkerDisplay} ${formatNumberAllocated(offender.numberAllocated)}`,
          keyworkerStaffId: staffId,
          keyworkerList: otherKeyworkers.map((keyworker) => ({
            text: `${formatName(keyworker.firstName, keyworker.lastName)} ${formatNumberAllocated(
              keyworker.numberAllocated
            )}`,
            value: `${keyworker.staffId}:${offenderNo}`,
          })),
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
    const { allocateKeyworker, allocationMode, recentlyAllocated } = req.body

    const selectedKeyworkerAllocations = allocateKeyworker.filter((keyworker) => keyworker)

    const keyworkerAllocations = selectedKeyworkerAllocations.map((keyworker) => {
      const [staffId, offenderNo] = keyworker.split(':')

      return { staffId, offenderNo }
    })

    console.log({ recentlyAllocated })

    if (allocationMode === 'manual')
      req.flash('recentlyAllocated', [...keyworkerAllocations, ...JSON.parse(recentlyAllocated)])

    if (allocationMode === 'auto') await keyworkerApi.autoAllocateConfirm(res.locals, activeCaseLoadId)

    await Promise.all(
      keyworkerAllocations.map(async ({ staffId, offenderNo }) => {
        await keyworkerApi.allocate(res.locals, {
          offenderNo,
          staffId,
          prisonId: activeCaseLoadId,
          allocationType: 'M',
          allocationReason: 'MANUAL',
          deallocationReason: 'OVERRIDE',
        })
      })
    )

    return res.redirect(`/manage-key-workers/allocate-key-worker`)
  }

  return { auto, index, post }
}

// {
//   "offenderNo": "G4982VX",
//   "bookingId": 877013,
//   "firstName": "ANATOLE",
//   "lastName": "ALTWIES",
//   "dateOfBirth": "1993-02-17",
//   "agencyId": "MDI",
//   "assignedLivingUnitId": 25779,
//   "assignedLivingUnitDesc": "3-1-007",
//   "facialImageId": 3490504,
//   "crsaClassification": "High",
//   "confirmedReleaseDate": "2020-12-01"
// location: 'MDI-1',
//   },

// AUTO========
// {
//   offenderNo: 'G1214VA',
//   firstName: 'EDUARDO',
//   lastName: 'KEANY',
//   staffId: 485588,
//   agencyId: 'MDI',
//   prisonId: 'MDI',
//   assigned: '2021-04-08T09:01:03.51242',
//   allocationType: 'P',
//   internalLocationDesc: '5-2-A-045',
//   deallocOnly: false
// },
