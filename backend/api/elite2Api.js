const config = require('../config')
const contextProperties = require('../contextProperties')

const encodeOffenderNumbers = offenderNumbers => offenderNumbers.map(offenderNo => `offenderNo=${offenderNo}`).join('&')

const encodeQueryString = input => encodeURIComponent(input)

const elite2ApiFactory = client => {
  const processResponse = context => response => {
    contextProperties.setResponsePagination(context, response.headers)
    return response.data
  }

  const get = (context, url, resultsLimit) => client.get(context, url, resultsLimit).then(processResponse(context))

  const post = (context, url, data) => client.post(context, url, data).then(processResponse(context))

  const put = (context, url, data) => client.put(context, url, data).then(processResponse(context))

  const del = (context, url, data) => client.del(context, url, data).then(processResponse(context))

  const caseNoteUsageList = (context, offenderNumbers, staffId) =>
    get(
      context,
      `api/case-notes/usage?type=KA&subType=KS&staffId=${staffId}&numMonths=1&${encodeOffenderNumbers(offenderNumbers)}`
    )
  const csraList = (context, offenderNumbers) => post(context, 'api/offender-assessments/csra/list', offenderNumbers)
  const userCaseLoads = context => get(context, 'api/users/me/caseLoads')
  const currentUser = context => get(context, 'api/users/me')
  const userLocations = context => get(context, 'api/users/me/locations')
  const getUserAccessRoles = context => get(context, 'api/users/me/roles')
  const getAgencyDetails = (context, caseloadId) => get(context, `api/agencies/caseload/${caseloadId}`)
  const enableNewNomis = (context, agencyId) => put(context, `api/users/add/default/${agencyId}`, {})
  const userSearch = (context, { agencyId, nameFilter, roleFilter }) =>
    get(
      context,
      `api/users/local-administrator/caseload/${agencyId}?nameFilter=${encodeQueryString(
        nameFilter
      )}&accessRole=${roleFilter}`
    )
  const userSearchAdmin = (context, { nameFilter, roleFilter }) =>
    get(context, `api/users?nameFilter=${encodeQueryString(nameFilter)}&accessRole=${roleFilter}`)
  const getRoles = context => get(context, 'api/access-roles')
  const getRolesAdmin = context => get(context, 'api/access-roles?includeAdmin=true')
  const contextUserRoles = (context, username, hasAdminRole) =>
    get(
      context,
      `api/users/${username}/access-roles/caseload/${config.app.applicationCaseload}?includeAdmin=${hasAdminRole}`
    )
  const removeRole = (context, agencyId, username, roleCode) =>
    del(context, `api/users/${username}/caseload/${config.app.applicationCaseload}/access-role/${roleCode}`)
  const addRole = (context, agencyId, username, roleCode) =>
    put(context, `api/users/${username}/caseload/${config.app.applicationCaseload}/access-role/${roleCode}`)
  const getUser = (context, username) => get(context, `api/users/${username}`)

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
  // TODO: Tech Debt: This might be better expressed as a PUT of the desired active caseload id to users/me/activeCaseloadId
  const setActiveCaseload = (context, caseload) => put(context, 'api/users/me/activeCaseLoad', caseload)

  return {
    caseNoteUsageList,
    currentUser,
    csraList,
    userCaseLoads,
    userLocations,
    searchOffenders,
    sentenceDetailList,
    setActiveCaseload,
    getUserAccessRoles,
    enableNewNomis,
    userSearch,
    getRoles,
    getRolesAdmin,
    contextUserRoles,
    removeRole,
    addRole,
    getUser,
    userSearchAdmin,
    getAgencyDetails,
  }
}

module.exports = { elite2ApiFactory }
