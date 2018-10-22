const getOffenderLink = offenderNo => `${links.notmEndpointUrl}offenders/${offenderNo}/quick-look`

const getHomeLink = () => `${links.notmEndpointUrl}`

const getStaffLink = staffId => `/keyworker/${staffId}/profile`

const getKeyWorkerHistoryLink = offenderNo => `/offender/${offenderNo}/history`

const links = {
  notmEndpointUrl: '', // set from env by /api/config call
  getOffenderLink,
  getHomeLink,
  getStaffLink,
  getKeyWorkerHistoryLink,
}

module.exports = links
