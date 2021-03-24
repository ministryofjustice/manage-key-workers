const { properCaseName } = require('../utils')

module.exports = ({ allocationService, complexityOfNeedApi }) => {
  const index = async (req, res, next) => {
    const { searchText } = req?.query || {}
    const { activeCaseLoadId } = req?.session?.userDetails || {}

    if (!activeCaseLoadId) return next()

    if (searchText) {
      const { offenderResponse, keyworkerResponse } = await allocationService.searchOffenders(res.locals, {
        agencyId: activeCaseLoadId,
        keywords: searchText,
        locationPrefix: activeCaseLoadId,
      })

      if (!offenderResponse?.length) {
        return res.render('offenderSearch.njk', {
          offenders: [],
          keyworkersDropdownValues: [],
        })
      }

      const offenderNumbers = offenderResponse.map((o) => o.offenderNo)
      const complexOffenders = await complexityOfNeedApi.getComplexOffenders(res.locals, offenderNumbers)

      const offenders = offenderResponse.map((offender) => ({
        name: `${properCaseName(offender.lastName)}, ${properCaseName(offender.firstName)}`,
        prisonNumber: offender.offenderNo,
        location: offender.assignedLivingUnitDesc,
        releaseDate: offender.confirmedReleaseDate || 'Not entered',
        keyworker: offender.keyworkerDisplay === '--' ? 'Not allocated' : offender.keyworkerDisplay,
        highComplexityOfNeed: Boolean(
          complexOffenders.find((complex) => complex.offenderNo === offender.offenderNo && complex.level === 'high')
        ),
      }))

      const keyworkersDropdownValues = keyworkerResponse.map((keyworker) => ({
        text: `${properCaseName(keyworker.lastName)}, ${properCaseName(keyworker.firstName)} (${keyworker.capacity})`,
        value: keyworker.staffId,
      }))

      return res.render('offenderSearch.njk', {
        offenders,
        keyworkersDropdownValues,
        initialPageLoad: false,
      })
    }

    return res.render('offenderSearch.njk', {
      errors: req.flash('errors'),
      initialPageLoad: true,
    })
  }

  const post = async (req, res) => {
    const { searchText } = req?.body || {}

    if (!searchText) {
      req.flash('errors', [
        {
          href: '#search-text',
          html: 'Please enter the prisoner&#39;s name or number',
        },
      ])

      return res.redirect('/manage-key-workers/search-for-prisoner')
    }

    return res.redirect(`/manage-key-workers/search-for-prisoner?searchText=${searchText}`)
  }

  return {
    index,
    post,
  }
}
