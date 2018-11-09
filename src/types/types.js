import { shape, number, string, arrayOf, bool, object, oneOfType } from 'prop-types'

const caseLoadOptions = shape({
  caseLoadId: string.isRequired,
  caseloadFunction: string.isRequired,
  description: string.isRequired,
  type: string.isRequired,
})

export const userType = shape({
  activeCaseLoadId: string.isRequired,
  caseLoadOptions: arrayOf(caseLoadOptions).isRequired,
  expiredFlag: bool.isRequired,
  firstName: string.isRequired,
  lastName: string.isRequired,
  lockedFlag: bool.isRequired,
  maintainAccess: bool.isRequired,
  maintainAccessAdmin: bool.isRequired,
  migration: bool.isRequired,
  staffId: number.isRequired,
  username: string.isRequired,
  writeAccess: bool.isRequired,
})

export const userListType = arrayOf(
  shape({
    expiredFlag: bool.isRequired,
    firstName: string.isRequired,
    lastName: string.isRequired,
    lockedFlag: bool.isRequired,
    staffId: number.isRequired,
    username: string.isRequired,
  })
)

export const contextUserType = shape({
  activeCaseLoadId: string.isRequired,
  agencyDescription: string.isRequired,
  expiredFlag: bool.isRequired,
  firstName: string.isRequired,
  lastName: string.isRequired,
  lockedFlag: bool.isRequired,
  staffId: number.isRequired,
  username: string.isRequired,
})

export const configType = shape({
  keyworkerProfileStatsEnabled: string.isRequired,
  keyworkerDashboardStatsEnabled: bool.isRequired,
  mailTo: string.isRequired,
  maintainRolesEnabled: string.isRequired,
  notmEndpointUrl: string.isRequired,
})

export const keyworkerType = shape({
  agencyDescription: string.isRequired,
  agencyId: string.isRequired,
  autoAllocationAllowed: bool.isRequired,
  capacity: oneOfType([number, string]).isRequired,
  firstName: string.isRequired,
  lastName: string.isRequired,
  numberAllocated: number.isRequired,
  scheduleType: string.isRequired,
  staffId: number.isRequired,
  stats: arrayOf(object),
  status: string.isRequired,
})

export const keyworkerListType = arrayOf(
  shape({
    agencyId: string.isRequired,
    autoAllocationAllowed: bool.isRequired,
    capacity: oneOfType([number, string]).isRequired,
    firstName: string.isRequired,
    lastName: string.isRequired,
    numberAllocated: number.isRequired,
    staffId: number.isRequired,
    status: string.isRequired,
  })
)

export const keyworkerChangeListType = arrayOf(
  shape({
    staffId: string.isRequired,
    offenderNo: string.isRequired,
  })
)

export const keyworkerSearchResultsListType = arrayOf(
  shape({
    agencyDescription: string.isRequired,
    agencyId: string.isRequired,
    autoAllocationAllowed: bool.isRequired,
    capacity: oneOfType([number, string]).isRequired,
    firstName: string.isRequired,
    lastName: string.isRequired,
    numKeyWorkerSessions: number.isRequired,
    numberAllocated: number.isRequired,
    scheduleType: string.isRequired,
    staffId: number.isRequired,
    status: string.isRequired,
  })
)

export const keyworkerAllocationsType = arrayOf(
  shape({
    agencyId: string,
    allocationType: string,
    assigned: string,
    bookingId: number,
    confirmedReleaseDate: string,
    crsaClassification: string,
    deallocOnly: bool,
    firstName: string,
    internalLocationDesc: string,
    lastKeyWorkerSessionDate: string,
    lastName: string,
    offenderNo: string,
    prisonId: string,
    staffId: number,
  })
)

const roleType = shape({
  roleCode: string.isRequired,
  roleFunction: string.isRequired,
  roleId: number.isRequired,
  roleName: string.isRequired,
})

export const roleFilterListType = arrayOf(roleType)

export const roleListType = arrayOf(roleType)

const unallocatedOffenderType = shape({
  agencyId: string.isRequired,
  assignedLivingUnitDesc: string.isRequired,
  assignedLivingUnitId: number.isRequired,
  bookingId: number.isRequired,
  confirmedReleaseDate: string,
  crsaClassification: string.isRequired,
  dateOfBirth: string.isRequired,
  facialImageId: number.isRequired,
  firstName: string.isRequired,
  lastName: string.isRequired,
  middleName: string,
  offenderNo: string.isRequired,
})

export const unallocatedListType = arrayOf(unallocatedOffenderType)

const allocatedOffenderType = shape({
  agencyId: string.isRequired,
  allocationType: string.isRequired,
  assigned: string.isRequired,
  confirmedReleaseDate: string,
  crsaClassification: string.isRequired,
  deallocOnly: bool.isRequired,
  firstName: string.isRequired,
  internalLocationDesc: string.isRequired,
  keyworkerDisplay: string,
  lastName: string.isRequired,
  numberAllocated: number.isRequired,
  offenderNo: string.isRequired,
  prisonId: string.isRequired,
  staffId: number.isRequired,
})

export const allocatedListType = arrayOf(allocatedOffenderType)

const locationType = shape({
  agencyId: string.isRequired,
  description: string.isRequired,
  locationId: number.isRequired,
  locationPrefix: string.isRequired,
  locationType: string.isRequired,
})

export const locationsType = arrayOf(locationType)

export const allocatedKeyworkersType = arrayOf(
  shape({
    offenderNo: string.isRequired,
    staffId: string.isRequired,
  })
)

const offenderResponseType = arrayOf(
  shape({
    age: number.isRequired,
    agencyId: string.isRequired,
    assignedLivingUnitDesc: string.isRequired,
    assignedLivingUnitId: number.isRequired,
    bookingId: number.isRequired,
    bookingNo: string.isRequired,
    confirmedReleaseDate: string,
    crsaClassification: string,
    dateOfBirth: string.isRequired,
    facialImageId: number.isRequired,
    firstName: string.isRequired,
    keyworkerDisplay: string,
    lastName: string.isRequired,
    middleName: string,
    numberAllocated: number.isRequired,
    offenderNo: string.isRequired,
    rnum: number.isRequired,
    staffId: number.isRequired,
  })
)

export const offenderResultsType = shape({
  keyworkerResponse: keyworkerListType.isRequired,
  offenderResponse: offenderResponseType.isRequired,
  partialResults: bool.isRequired,
})