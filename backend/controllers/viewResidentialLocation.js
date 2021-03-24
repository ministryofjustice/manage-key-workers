const { formatName, putLastNameFirst, formatTimestampToDate } = require('../utils')

module.exports = ({ allocationService, elite2Api, keyworkerApi, complexityOfNeedApi }) => {
  const index = async (req, res) => {
    const { residentialLocation } = req.query
    const { activeCaseLoadId } = req.session?.userDetails || {}

    const currentUserLocations = await elite2Api.userLocations(res.locals)

    const residentialLocations = currentUserLocations?.filter(
      (location) => location.locationPrefix !== activeCaseLoadId
    )

    const { keyworkerResponse, offenderResponse } = residentialLocation
      ? await allocationService.searchOffenders(res.locals, {
          agencyId: activeCaseLoadId,
          allocationStatus: 'all',
          keywords: '',
          locationPrefix: residentialLocation,
        })
      : { keyworkerResponse: [], offenderResponse: [] }

    const offenderNumbers = offenderResponse.map((o) => o.offenderNo)
    const complexOffenders = offenderNumbers.length
      ? await complexityOfNeedApi.getComplexOffenders(res.locals, offenderNumbers)
      : []

    return res.render('viewResidentialLocation', {
      activeCaseLoadId,
      formValues: req.query,
      prisoners: offenderResponse.map((offender) => {
        const { confirmedReleaseDate, offenderNo, staffId } = offender
        const otherKeyworkers = keyworkerResponse.filter((keyworker) => keyworker.staffId !== offender.staffId)
        const formatNumberAllocated = (number) => (number ? `(${number})` : '')
        const isHighComplexity = Boolean(
          complexOffenders.find((complex) => complex.offenderNo === offender.offenderNo && complex.level === 'high')
        )

        return {
          isHighComplexity,
          keyworkerName: staffId && `${offender.keyworkerDisplay} ${formatNumberAllocated(offender.numberAllocated)}`,
          keyworkerStaffId: staffId,
          keyworkerList: !isHighComplexity && [
            ...(staffId
              ? [
                  {
                    text: 'Deallocate',
                    value: `${staffId}:${offender.offenderNo}:true`,
                  },
                ]
              : []),
            ...otherKeyworkers.map((keyworker) => ({
              text: `${formatName(keyworker.firstName, keyworker.lastName)} ${formatNumberAllocated(
                keyworker.numberAllocated
              )}`,
              value: `${keyworker.staffId}:${offenderNo}`,
            })),
          ],
          location: offender.assignedLivingUnitDesc,
          name: putLastNameFirst(offender.firstName, offender.lastName),
          prisonNumber: offenderNo,
          releaseDate: confirmedReleaseDate ? formatTimestampToDate(confirmedReleaseDate) : 'Not entered',
        }
      }),
      residentialLocations: residentialLocations.map((location) => ({
        text: location.description,
        value: location.locationPrefix,
      })),
    })
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

  return { index, post }
}
