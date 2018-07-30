const encodeOffenderNumbers = (offenderNumbers) => offenderNumbers.map(offenderNo => `offenderNo=${offenderNo}`).join('&');

const encodeQueryString = input => encodeURIComponent(input);

const elite2ApiFactory = (client) => {
  const processResponse = (context) => (response) => {
    return response.data;
  };

  const get = (context, url, resultsLimit) =>
    client
      .get(context, url, resultsLimit)
      .then(processResponse(context));

  const post = (context, url, data) =>
    client
      .post(context, url, data)
      .then(processResponse(context));

  const put = (context, url, data) =>
    client
      .put(context, url, data)
      .then(processResponse(context));

  const caseNoteUsageList = (context, offenderNumbers) => get(context, `api/case-notes/usage?type=KA&numMonths=6&${encodeOffenderNumbers(offenderNumbers)}`);
  const csraList = (context, offenderNumbers) => post(context, 'api/offender-assessments/CSR', offenderNumbers);
  const userCaseLoads = (context) => get(context, 'api/users/me/caseLoads');
  const currentUser = (context) => get(context, 'api/users/me');
  const userLocations = (context) => get(context, 'api/users/me/locations');

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
  const searchOffenders = (context, keywords, locationPrefix, resultsLimit) => get(context, `api/locations/description/${locationPrefix}/inmates?keywords=${encodeQueryString(keywords)}`, resultsLimit);
  const sentenceDetailList = (context, offenderNumbers) => post(context, 'api/offender-sentences', offenderNumbers);

  // NB. This function expects a caseload object.
  // The object *must* have non-blank caseLoadId,  description and type properties.
  // However, only 'caseLoadId' has meaning.  The other two properties can take *any* non-blank value and these will be ignored.
  // TODO: Tech Debt: This might be better expressed as a PUT of the desired active caseload id to users/me/activeCaseloadId
  const setActiveCaseload = (context, caseload) => put(context, 'api/users/me/activeCaseLoad', caseload);

  return {
    caseNoteUsageList,
    currentUser,
    csraList,
    userCaseLoads,
    userLocations,
    searchOffenders,
    sentenceDetailList,
    setActiveCaseload
  };
};

module.exports = { elite2ApiFactory };
