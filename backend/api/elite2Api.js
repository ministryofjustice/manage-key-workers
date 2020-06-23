const contextProperties = require('../contextProperties')

const encodeOffenderNumbers = offenderNumbers => offenderNumbers.map(offenderNo => `offenderNo=${offenderNo}`).join('&')

const encodeQueryString = input => encodeURIComponent(input)

const isNomisUser = context => context.authSource !== 'auth'

const elite2ApiFactory = client => {
  const processResponse = context => response => {
    contextProperties.setResponsePagination(context, response.headers)
    return response.data
  }

  const get = (context, url, resultsLimit) => client.get(context, url, resultsLimit).then(processResponse(context))

  const post = (context, url, data) => client.post(context, url, data).then(processResponse(context))

  const put = (context, url, data) => client.put(context, url, data).then(processResponse(context))

  const caseNoteUsageList = (context, offenderNumbers, staffId) =>
    get(
      context,
      `api/case-notes/usage?type=KA&subType=KS&staffId=${staffId}&numMonths=1&${encodeOffenderNumbers(offenderNumbers)}`
    )
  const csraList = (context, offenderNumbers) => post(context, 'api/offender-assessments/csra/list', offenderNumbers)
  const userCaseLoads = context => (isNomisUser(context) ? get(context, 'api/users/me/caseLoads') : [])
  const userLocations = context => (isNomisUser(context) ? get(context, 'api/users/me/locations') : [])

  /**
   * Retrive information about offender bookings that satisfy the provided selection criteria.
   * @param context
   * @param keywords keywords to match?
   * @param locationPrefix The prison (agencyId)
   * @param resultsLimit The maximum number of OffenderBooking objects to return.
   * @returns array of OffenderBooking. Each OffenderBooking looks like:
   * {
    private Long bookingId;
    private String bookingNo;
    private String offenderNo;
    private String firstName;
    private String middleName;
    private String lastName;
    private LocalDate dateOfBirth;
    private Integer age;
    private List<String> alertsCodes = new ArrayList<String>();
    private String agencyId;
    private Long assignedLivingUnitId;
    private String assignedLivingUnitDesc;
    private Long facialImageId;
    private String assignedOfficerUserId;
    private List<String> aliases;
    private String iepLevel;
   * }
   */
  const searchOffenders = (context, keywords, locationPrefix, resultsLimit) =>
    get(
      context,
      `api/locations/description/${locationPrefix}/inmates?keywords=${encodeQueryString(keywords)}`,
      resultsLimit
    )
  const sentenceDetailList = (context, offenderNumbers) => post(context, 'api/offender-sentences', offenderNumbers)

  // NB. This function expects a caseload object.
  // The object *must* have non-blank caseLoadId,  description and type properties.
  // However, only 'caseLoadId' has meaning.  The other two properties can take *any* non-blank value and these will be ignored.
  const setActiveCaseload = (context, caseload) => put(context, 'api/users/me/activeCaseLoad', caseload)

  return {
    caseNoteUsageList,
    csraList,
    userCaseLoads,
    userLocations,
    searchOffenders,
    sentenceDetailList,
    setActiveCaseload,
  }
}

module.exports = { elite2ApiFactory }
