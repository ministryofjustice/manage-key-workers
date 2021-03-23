const { formatName, putLastNameFirst, formatTimestampToDate } = require('../utils')

module.exports = ({ allocationService, elite2Api, keyworkerApi }) => {
  const renderTemplate = async (req, res) => {
    const { residentialLocation } = req.query
    try {
      const {
        user: { activeCaseLoad },
      } = res.locals
      const residentialLocations = await elite2Api.userLocations(res.locals)

      const { keyworkerResponse, offenderResponse } = residentialLocation
        ? await allocationService.searchOffenders(res.locals, {
            agencyId: activeCaseLoad.caseLoadId,
            keywords: '',
            locationPrefix: residentialLocation,
            allocationStatus: 'all',
          })
        : { keyworkerResponse: [], offenderResponse: [] }

      const prisoners = offenderResponse.map((offender) => {
        const keyworkersWithoutCurrentKeyworker = keyworkerResponse.filter(
          (keyworker) => keyworker.staffId !== offender.staffId
        )

        const formattedNumberAllocated = (number) => (number ? `(${number})` : '')

        return {
          name: putLastNameFirst(offender.firstName, offender.lastName),
          prisonNumber: offender.offenderNo,
          location: offender.assignedLivingUnitDesc,
          releaseDate: offender.confirmedReleaseDate
            ? formatTimestampToDate(offender.confirmedReleaseDate)
            : 'Not entered',
          keyworkerName:
            offender.staffId && `${offender.keyworkerDisplay} ${formattedNumberAllocated(offender.numberAllocated)}`,
          keyworkerStaffId: offender.staffId,
          keyworkerList: [
            ...(offender.staffId
              ? [
                  {
                    text: 'Deallocate',
                    value: `${offender.staffId}:${offender.offenderNo}:true`,
                  },
                ]
              : []),
            ...keyworkersWithoutCurrentKeyworker.map((keyworker) => ({
              text: `${formatName(keyworker.firstName, keyworker.lastName)} ${formattedNumberAllocated(
                keyworker.numberAllocated
              )}`,
              value: `${keyworker.staffId}:${offender.offenderNo}`,
            })),
          ],
        }
      })

      return res.render('viewResidentialLocation.njk', {
        formValues: req.query,
        prisoners,
        residentialLocations: residentialLocations.map((location) => ({
          text: location.description,
          value: location.locationPrefix,
        })),
      })
    } catch (error) {
      console.log({ error })
      res.locals.redirectUrl = '/manage-prisoner-whereabouts'
      throw error
    }
  }

  const index = async (req, res) => renderTemplate(req, res)

  const post = async (req, res) => {
    const {
      user: { activeCaseLoad },
    } = res.locals
    const { allocateKeyworker } = req.body
    const selectedKeyworkerChanges = allocateKeyworker
      .filter((keyworker) => keyworker)
      .map((keyworker) => {
        const [staffId, offenderNo, deallocate] = keyworker.split(':')

        return { staffId, offenderNo, deallocate }
      })

    await Promise.all(
      selectedKeyworkerChanges.map(async ({ staffId, offenderNo, deallocate }) => {
        if (deallocate) {
          await keyworkerApi.deallocate(res.locals, offenderNo, {
            offenderNo,
            staffId,
            prisonId: activeCaseLoad.caseLoadId,
            deallocationReason: 'MANUAL',
          })
        } else {
          await keyworkerApi.allocate(res.locals, {
            offenderNo,
            staffId,
            prisonId: activeCaseLoad.caseLoadId,
            allocationType: 'M',
            allocationReason: 'MANUAL',
            deallocationReason: 'OVERRIDE',
          })
        }
      })
    )

    return renderTemplate(req, res)
  }

  return { index, post }
}

// {
//   bookingId: 1141710,
//   bookingNo: 'W79545',
//   offenderNo: 'G5232UD',
//   firstName: 'ERASMUS',
//   lastName: 'BERNATH',
//   dateOfBirth: '1989-07-02',
//   age: 31,
//   agencyId: 'MDI',
//   assignedLivingUnitId: 27184,
//   assignedLivingUnitDesc: '2-2-032',
//   facialImageId: 3755201,
//   convictedStatus: 'Convicted',
//   imprisonmentStatus: 'ADIMP_ORA',
//   alertsCodes: [],
//   alertsDetails: [],
//   legalStatus: 'SENTENCED',
//   staffId: 485704,
//   keyworkerDisplay: 'Keyworker1, Test',
//   numberAllocated: 25,
//   crsaClassification: 'Standard',
//   confirmedReleaseDate: '2017-04-20'
// },
