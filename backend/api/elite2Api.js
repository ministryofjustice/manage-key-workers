const contextProperties = require('../contextProperties')

const encodeOffenderNumbers = (offenderNumbers) =>
  offenderNumbers.map((offenderNo) => `offenderNo=${offenderNo}`).join('&')

const isNomisUser = (context) => context.authSource !== 'auth'

const elite2ApiFactory = (client) => {
  const processResponse = (context) => (response) => {
    contextProperties.setResponsePagination(context, response.headers)
    return response.body
  }

  const get = (context, url, resultsLimit) => client.get(context, url, resultsLimit).then(processResponse(context))

  const put = (context, url, data) => client.put(context, url, data).then(processResponse(context))

  const caseNoteUsageList = (context, offenderNumbers, staffId) =>
    get(
      context,
      `/api/case-notes/usage?type=KA&subType=KS&staffId=${staffId}&numMonths=1&${encodeOffenderNumbers(
        offenderNumbers
      )}`
    )

  const userCaseLoads = (context) => (isNomisUser(context) ? get(context, '/api/users/me/caseLoads') : [])
  const userLocations = (context) => (isNomisUser(context) ? get(context, '/api/users/me/locations') : [])

  // NB. This function expects a caseload object.
  // The object *must* have non-blank caseLoadId,  description and type properties.
  // However, only 'caseLoadId' has meaning.  The other two properties can take *any* non-blank value and these will be ignored.
  const setActiveCaseload = (context, caseload) => put(context, '/api/users/me/activeCaseLoad', caseload)

  return {
    caseNoteUsageList,
    userCaseLoads,
    userLocations,
    setActiveCaseload,
  }
}

module.exports = { elite2ApiFactory }
