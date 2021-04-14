const contextProperties = require('../contextProperties')
const { createQueryParamString } = require('../../src/stringUtils')

const processError = (error) => {
  if (!error.response) throw error
  if (!error.response.status) throw error
  if (error.response.status !== 404) throw error // Not Found
  return null
}

const encodeQueryString = (input) => encodeURIComponent(input)

const keyworkerApiFactory = (client) => {
  const processResponse = (context) => (response) => {
    contextProperties.setResponsePagination(context, response.headers)
    return response.body
  }

  const get = (context, url) => client.get(context, url).then(processResponse(context)).catch(processError)

  const post = (context, url, data) => client.post(context, url, data).then(processResponse(context))

  const put = (context, url, data) => client.put(context, url, data).then(processResponse(context))

  const allocate = (context, data) => post(context, '/key-worker/allocate', data)
  const allocated = (context, agencyId) => get(context, `/key-worker/${agencyId}/allocations`)
  const allocationHistory = (context, offenderNo) => get(context, `/key-worker/allocation-history/${offenderNo}`)
  const allocationHistorySummary = (context, offenderNos) =>
    post(context, `/key-worker/allocation-history/summary`, offenderNos)
  const autoAllocate = (context, agencyId) => post(context, `/key-worker/${agencyId}/allocate/start`)
  const autoAllocateConfirm = (context, agencyId) => post(context, `/key-worker/${agencyId}/allocate/confirm`)
  const getPrisonMigrationStatus = (context, prisonId) => get(context, `/key-worker/prison/${prisonId}`)
  const enableAutoAllocationAndMigrate = (context, agencyId, migrate, capacity, frequency) =>
    post(
      context,
      `/key-worker/enable/${agencyId}/auto-allocate?migrate=${migrate}&capacity=${capacity}&frequency=${frequency}`,
      {}
    )
  const enableManualAllocationAndMigrate = (context, agencyId, migrate, capacity, frequency) =>
    post(
      context,
      `/key-worker/enable/${agencyId}/manual?migrate=${migrate}&capacity=${capacity}&frequency=${frequency}`,
      {}
    )

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
  const autoallocated = (context, agencyId) => get(context, `/key-worker/${agencyId}/allocations?allocationType=P`)

  /**
   *
   * @param context
   * @param agencyId
   * @returns array of KeyworkerDto. Each keyworkerDto looks like:
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
  const availableKeyworkers = (context, agencyId) => get(context, `/key-worker/${agencyId}/available`)

  const deallocate = (context, offenderNo) => put(context, `/key-worker/deallocate/${offenderNo}`)
  const keyworker = (context, staffId, agencyId) => get(context, `/key-worker/${staffId}/prison/${agencyId}`)

  /**
   *
   * @param context
   * @param staffId
   * @param agencyId
   * @returns array of KeyworkerAllocationDetailsDto. See autoallocated above...
   */
  const keyworkerAllocations = (context, staffId, agencyId) =>
    get(context, `/key-worker/${staffId}/prison/${agencyId}/offenders`)
  const keyworkerSearch = (context, { agencyId, searchText, statusFilter }) =>
    get(
      context,
      `/key-worker/${agencyId}/members?statusFilter=${statusFilter}&nameFilter=${encodeQueryString(searchText)}`
    )
  const keyworkerUpdate = (context, staffId, agencyId, data) =>
    post(context, `/key-worker/${staffId}/prison/${agencyId}`, data)

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
  const offenderKeyworkerList = (context, agencyId, data) => post(context, `/key-worker/${agencyId}/offenders`, data)

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
  const unallocated = (context, agencyId) => get(context, `/key-worker/${agencyId}/offenders/unallocated`)

  const stats = (context, agencyId, staffId, fromDate, toDate) =>
    get(context, `/key-worker-stats/${staffId}/prison/${agencyId}?fromDate=${fromDate}&toDate=${toDate}`)

  /**
   * @param context
   * @param prisonId
   * @param fromDate
   * @param toDate
   * @returns an Object which contains summary and prisons
   */
  const prisonStats = (context, prisonId, fromDate, toDate) =>
    get(context, `/key-worker-stats?${createQueryParamString({ prisonId, fromDate, toDate })}`)

  return {
    allocate,
    allocated,
    allocationHistory,
    allocationHistorySummary,
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
    unallocated,
    getPrisonMigrationStatus,
    enableAutoAllocationAndMigrate,
    enableManualAllocationAndMigrate,
    stats,
    prisonStats,
  }
}

module.exports = {
  keyworkerApiFactory,
}
