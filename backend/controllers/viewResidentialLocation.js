import pagination from '../util/pagination'

const { putLastNameFirst, formatTimestampToDate, ensureIsArray } = require('../utils')
const {
  apis: { complexity },
} = require('../config')

const pageSize = 20

const { sortAndFormatKeyworkerNameAndAllocationCount, getDeallocateRow } = require('./keyworkerShared')

const isComplexityEnabledFor = (agencyId) => complexity.enabled_prisons?.includes(agencyId)

module.exports = ({ allocationService, elite2Api, keyworkerApi, complexityOfNeedApi, systemOauthClient }) => {
  const index = async (req, res) => {
    const { residentialLocation } = req.query
    const { activeCaseLoadId, username } = req.session?.userDetails || {}

    const validationErrors =
      residentialLocation?.length === 0
        ? [
            {
              href: '#residentialLocation',
              html: 'Select a residential location',
            },
          ]
        : []

    const currentUserLocations = await elite2Api.userLocations(res.locals)

    const residentialLocations = currentUserLocations?.filter(
      (location) => location.locationPrefix !== activeCaseLoadId
    )

    const page = req.query.page || 1

    const { keyworkerResponse, offenderResponse, totalRecords, pageNumber } = residentialLocation
      ? await allocationService.searchOffendersPaginated(res.locals, {
          agencyId: activeCaseLoadId,
          pageRequest: {
            'page-offset': (+page - 1) * pageSize,
            'page-limit': pageSize,
          },
          keywords: '',
          locationPrefix: residentialLocation,
        })
      : { keyworkerResponse: [], offenderResponse: [] }

    const systemContext =
      isComplexityEnabledFor(activeCaseLoadId) && (await systemOauthClient.getClientCredentialsTokens(username))

    const offenderNumbers = offenderResponse.map((o) => o.offenderNo)
    const complexOffenders =
      isComplexityEnabledFor(activeCaseLoadId) && offenderNumbers.length
        ? await complexityOfNeedApi.getComplexOffenders(systemContext, offenderNumbers)
        : []

    const allocationHistoryData = offenderNumbers.length
      ? await keyworkerApi.allocationHistorySummary(res.locals, offenderNumbers)
      : []

    return res.render('viewResidentialLocation', {
      activeCaseLoadId,
      formValues: req.query,
      errors: validationErrors,
      pagination: pagination(pageNumber / pageSize, totalRecords, req.originalUrl),
      prisoners: offenderResponse.map((offender) => {
        const { confirmedReleaseDate, offenderNo, staffId } = offender
        const otherKeyworkers = keyworkerResponse.filter((keyworker) => keyworker.staffId !== offender.staffId)
        const formatNumberAllocated = (number) => (number ? `(${number})` : '')
        const isHighComplexity = Boolean(
          complexOffenders.find((complex) => complex.offenderNo === offender.offenderNo && complex.level === 'high')
        )

        return {
          isHighComplexity,
          hasHistory: allocationHistoryData.find((history) => history.offenderNo === offenderNo).hasHistory,
          keyworkerName: staffId && `${offender.keyworkerDisplay} ${formatNumberAllocated(offender.numberAllocated)}`,
          keyworkerStaffId: staffId,
          keyworkerList: !isHighComplexity && [
            ...getDeallocateRow(staffId, offenderNo),
            ...sortAndFormatKeyworkerNameAndAllocationCount(otherKeyworkers).map((keyworker) => ({
              text: keyworker.formattedName,
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

    const selectedKeyworkerAllocations = ensureIsArray(allocateKeyworker).filter((keyworker) => keyworker)

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
