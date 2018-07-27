const processResponse = (response) => {
  return response.data;
};

const processError = error => {
  if (!error.response) throw error;
  if (!error.response.status) throw error;
  if (error.response.status !== 404) throw error; // Not Found
  return {};
};

const encodeQueryString = (input) => encodeURIComponent(input);

const keyworkerApiFactory = (client) => {
  const get = (context, url) =>
    client
      .get(context, url)
      .then(processResponse)
      .catch(processError);

  const post = (context, url, data) =>
    client
      .post(context, url, data)
      .then(processResponse);

  const put = (context, url, data) =>
    client
      .put(context, url, data)
      .then(processResponse);

  const allocate = (context, data) => post(context, 'key-worker/allocate', data);
  const allocated = (context, agencyId) => get(context, `key-worker/${agencyId}/allocations`);
  const allocationHistory = (context, offenderNo) => get(context, `key-worker/allocation-history/${offenderNo}`);
  const autoAllocate = (context, agencyId) => post(context, `key-worker/${agencyId}/allocate/start`);
  const autoAllocateConfirm = (context, agencyId) => post(context, `key-worker/${agencyId}/allocate/confirm`);

  /**
   *
   * @param context
   * @param agencyId
   * @returns An array of KeyworkerAllocationDetailsDto. Each KeyworkerAllocationDetailsDto looks like:
   * {
       private Long bookingId;
       private String offenderNo;
       private String firstName;
       private String middleNames;
       private String lastName;
       private Long staffId;
       private String agencyId;
       private String prisonId;
       private LocalDateTime assigned;
       private AllocationType allocationType;
       private String internalLocationDesc;
     }
   */
  const autoallocated = (context, agencyId) => get(context, `key-worker/${agencyId}/allocations?allocationType=P`);

  /**
   *
   * @param context
   * @param agencyId
   * @returns array of KeyworkerDto. Each keywokerDto looks like:
   * {
    private Long staffId;
    private String firstName;
    private String lastName;
    private String email;
    private Long thumbnailId;
    private Integer capacity;
    private Integer numberAllocated;
    private String scheduleType;
    private String agencyId;
    private String agencyDescription;
    private KeyworkerStatus status;
    private Boolean autoAllocationAllowed;
    private LocalDate activeDate;
    private Integer numKeyWorkerSessions;
    }
   */
  const availableKeyworkers = (context, agencyId) => get(context, `key-worker/${agencyId}/available`);

  const deallocate = (context, offenderNo) => put(context, `key-worker/deallocate/${offenderNo}`);
  const keyworker = (context, staffId, agencyId) => get(context, `key-worker/${staffId}/prison/${agencyId}`);

  /**
   *
   * @param context
   * @param staffId
   * @param agencyId
   * @returns array of KeyworkerAllocationDetailsDto. See autoallocated above...
   */
  const keyworkerAllocations = (context, staffId, agencyId) => get(context, `key-worker/${staffId}/prison/${agencyId}/offenders`);
  const keyworkerSearch = (context, { agencyId, searchText, statusFilter }) => get(context, `key-worker/${agencyId}/members?statusFilter=${statusFilter}&nameFilter=${encodeQueryString(searchText)}`);
  const keyworkerUpdate = (context, staffId, agencyId, data) => post(context, `key-worker/${staffId}/prison/${agencyId}`, data);

  /**
   *
   * @param context
   * @param agencyId
   * @param data
   * @returns array of OffenderKeyworkerDto. Each OffenderKeyworkerDto looks like:
   {
    private Long offenderKeyworkerId;
    private String offenderNo;
    private Long staffId;
    private String agencyId;
    private LocalDateTime assigned;
    private LocalDateTime expired;
    private String userId;
    private String active;
   }
   */
  const offenderKeyworkerList = (context, agencyId, data) => post(context, `key-worker/${agencyId}/offenders`, data);

  /**
   * @param context
   * @param agencyId
   * @returns an array of OffenderLocationDto. Each OffenderLocationDto Looks like:
   * {
       private String offenderNo;
       private Long bookingId;
       private String firstName;
       private String middleName;
       private String lastName;
       private LocalDate dateOfBirth;
       private String agencyId;
       private Long assignedLivingUnitId;
       private String assignedLivingUnitDesc;
       private Long facialImageId;
       private String assignedOfficerUserId;
       private List<String> aliases;
       private String iepLevel;
     }
   */
  const unallocated = (context, agencyId) => get(context, `key-worker/${agencyId}/offenders/unallocated`);

  return {
    allocate,
    allocated,
    allocationHistory,
    autoAllocate,
    autoAllocateConfirm,
    autoallocated,
    availableKeyworkers,
    deallocate,
    keyworker,
    keyworkerAllocations,
    keyworkerSearch,
    keyworkerUpdate,
    offenderKeyworkerList,
    unallocated
  };
};

module.exports = {
  keyworkerApiFactory
};
