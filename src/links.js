const links = {
  notmEndpointUrl: '', // set from env by /api/config call
  getOffenderLink: offenderNo => `${links.notmEndpointUrl}offenders/${offenderNo}/quick-look`,
  getHomeLink: () => `${links.notmEndpointUrl}`,
  getStaffLink: staffId => `/key-worker/${staffId}`,
  getKeyWorkerHistoryLink: offenderNo => `/offender-history/${offenderNo}`,
}

module.exports = links
