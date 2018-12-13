const links = {
  notmEndpointUrl: '', // set from env by /api/config call
  getOffenderLink: offenderNo => `${links.notmEndpointUrl}offenders/${offenderNo}/quick-look`,
  getHomeLink: () => `${links.notmEndpointUrl}`,
  getStaffLink: staffId => `/keyworker/${staffId}`,
  getKeyWorkerHistoryLink: offenderNo => `/offender-history/${offenderNo}`,
}

module.exports = links
