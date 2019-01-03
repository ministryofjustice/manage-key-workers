const links = {
  notmEndpointUrl: '', // set from env by /api/config call
  getOffenderLink: offenderNo => `${links.notmEndpointUrl}offenders/${offenderNo}/quick-look`,
  getHomeLink: () => `${links.notmEndpointUrl}`,
  getStaffLink: staffId => `/manage-key-workers/key-worker/${staffId}`,
  getKeyWorkerHistoryLink: offenderNo => `/manage-key-workers/offender-history/${offenderNo}`,
}

module.exports = links
