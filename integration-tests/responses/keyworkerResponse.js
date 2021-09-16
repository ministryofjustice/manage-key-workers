const keyworkerResponse = {
  staffId: -3,
  firstName: 'HPA',
  lastName: 'AUser',
  thumbnailId: 1,
  capacity: 6,
  numberAllocated: 4,
  scheduleType: 'Full Time',
  agencyId: 'LEI',
  agencyDescription: 'Moorland (HMP & YOI)',
  status: 'ACTIVE',
  autoAllocationAllowed: true,
}

const keyworkerInactiveResponse = {
  staffId: -3,
  firstName: 'HPA',
  lastName: 'AUser',
  capacity: 6,
  numberAllocated: 0,
  scheduleType: 'Full Time',
  agencyId: 'LEI',
  agencyDescription: 'LEEDS',
  status: 'INACTIVE',
  autoAllocationAllowed: true,
  numKeyWorkerSessions: 2,
}

export default { keyworkerResponse, keyworkerInactiveResponse }
