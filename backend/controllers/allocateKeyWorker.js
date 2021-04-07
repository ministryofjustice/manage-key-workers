const { formatName, putLastNameFirst, formatTimestampToDate } = require('../utils')

module.exports = ({ allocationService, elite2Api, keyworkerApi, complexityOfNeedApi }) => {
  const renderTemplate = async (req, res, offenderResponse) => {
    const { activeCaseLoadId } = req.session?.userDetails || {}

    const currentUserLocations = await elite2Api.userLocations(res.locals)
    const availableKeyworkers = await keyworkerApi.availableKeyworkers(res.locals, activeCaseLoadId)

    const offenderNumbers = offenderResponse.map((o) => o.offenderNo)
    const complexOffenders = offenderNumbers.length
      ? await complexityOfNeedApi.getComplexOffenders(res.locals, offenderNumbers)
      : []

    const allocationHistoryData = offenderNumbers.length
      ? await Promise.all(
          offenderResponse.map(async ({ offenderNo }) => {
            const history = await keyworkerApi.allocationHistory(res.locals, offenderNo)
            return { offenderNo, hasHistory: Boolean(history?.allocationHistory?.length) }
          })
        )
      : []

    return res.render('allocateKeyWorker', {
      activeCaseLoadId,
      formValues: req.query,
      prisoners: offenderResponse.map((offender) => {
        const { confirmedReleaseDate, offenderNo, staffId } = offender
        const formatNumberAllocated = (number) => (number ? `(${number})` : '')
        const isHighComplexity = Boolean(
          complexOffenders.find((complex) => complex.offenderNo === offender.offenderNo && complex.level === 'high')
        )

        return {
          isHighComplexity,
          hasHistory: allocationHistoryData.find((history) => history.offenderNo === offenderNo).hasHistory,
          keyworkerName: staffId && `${offender.keyworkerDisplay} ${formatNumberAllocated(offender.numberAllocated)}`,
          keyworkerStaffId: staffId,
          keyworkerList: availableKeyworkers.map((keyworker) => ({
            text: `${formatName(keyworker.firstName, keyworker.lastName)} ${formatNumberAllocated(
              keyworker.numberAllocated
            )}`,
            value: `${keyworker.staffId}:${offenderNo}`,
          })),
          location: offender.assignedLivingUnitDesc,
          name: putLastNameFirst(offender.firstName, offender.lastName),
          prisonNumber: offenderNo,
          releaseDate: confirmedReleaseDate ? formatTimestampToDate(confirmedReleaseDate) : 'Not entered',
        }
      }),
      residentialLocations: currentUserLocations.map((location) => ({
        text: location.description,
        value: location.locationPrefix,
      })),
    })
  }

  // const index = async (req, res) => renderTemplate(req, res)
  const index = async (req, res) => {
    const { residentialLocation } = req.query
    const { activeCaseLoadId } = req.session?.userDetails || {}

    // Group

    const offenderResponse = await allocationService.unallocated(res.locals, residentialLocation || activeCaseLoadId)

    return renderTemplate(req, res, offenderResponse)

    // return res.render('allocateKeyWorker', {
    //   activeCaseLoadId,
    //   formValues: req.query,
    //   prisoners: offenderResponse.map((offender) => {
    //     const { confirmedReleaseDate, offenderNo, staffId } = offender
    //     const formatNumberAllocated = (number) => (number ? `(${number})` : '')
    //     const isHighComplexity = Boolean(
    //       complexOffenders.find((complex) => complex.offenderNo === offender.offenderNo && complex.level === 'high')
    //     )

    //     return {
    //       isHighComplexity,
    //       hasHistory: allocationHistoryData.find((history) => history.offenderNo === offenderNo).hasHistory,
    //       keyworkerName: staffId && `${offender.keyworkerDisplay} ${formatNumberAllocated(offender.numberAllocated)}`,
    //       keyworkerStaffId: staffId,
    //       keyworkerList: availableKeyworkers.map((keyworker) => ({
    //         text: `${formatName(keyworker.firstName, keyworker.lastName)} ${formatNumberAllocated(
    //           keyworker.numberAllocated
    //         )}`,
    //         value: `${keyworker.staffId}:${offenderNo}`,
    //       })),
    //       location: offender.assignedLivingUnitDesc,
    //       name: putLastNameFirst(offender.firstName, offender.lastName),
    //       prisonNumber: offenderNo,
    //       releaseDate: confirmedReleaseDate ? formatTimestampToDate(confirmedReleaseDate) : 'Not entered',
    //     }
    //   }),
    //   residentialLocations: currentUserLocations.map((location) => ({
    //     text: location.description,
    //     value: location.locationPrefix,
    //   })),
    // })
  }

  const auto = async (req, res) => {
    const { residentialLocation } = req.query
    const { activeCaseLoadId } = req.session?.userDetails || {}
    const { allocatedResponse } = await allocationService.allocated(res.locals, residentialLocation || activeCaseLoadId)
    res.json({ allocatedResponse })
    // return renderTemplate(req, res, allocatedResponse)
  }

  const post = async (req, res) => {
    const { residentialLocation } = req.query
    const { activeCaseLoadId } = req.session?.userDetails || {}
    const { allocateKeyworker } = req.body

    const selectedKeyworkerAllocations = allocateKeyworker.filter((keyworker) => keyworker)

    const keyworkerAllocations = selectedKeyworkerAllocations.map((keyworker) => {
      const [staffId, offenderNo, deallocate] = keyworker.split(':')

      return { staffId, offenderNo, deallocate }
    })

    await Promise.all(
      keyworkerAllocations.map(async ({ staffId, offenderNo, deallocate }) => {
        if (deallocate) {
          await keyworkerApi.deallocate(res.locals, offenderNo, {
            offenderNo,
            staffId,
            prisonId: activeCaseLoadId,
            deallocationReason: 'MANUAL',
          })
        } else {
          await keyworkerApi.allocate(res.locals, {
            offenderNo,
            staffId,
            prisonId: activeCaseLoadId,
            allocationType: 'M',
            allocationReason: 'MANUAL',
            deallocationReason: 'OVERRIDE',
          })
        }
      })
    )

    return res.redirect(`/manage-key-workers/view-residential-location?residentialLocation=${residentialLocation}`)
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
