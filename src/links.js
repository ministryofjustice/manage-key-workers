const getOffenderLink = (offenderNo) => {
  return `${links.notmEndpointUrl}offenders/${offenderNo}/quick-look`;
};

const getHomeLink = () => {
  return `${links.notmEndpointUrl}`;
};

const getStaffLink = (staffId) => {
  return `/keyworker/${staffId}/profile`;
};

const getKeyWorkerHistoryLink = (offenderNo) => {
  return `/offender/${offenderNo}/history`;
};

const links = {
  notmEndpointUrl: '', // set from env by /api/config call
  getOffenderLink,
  getHomeLink,
  getStaffLink,
  getKeyWorkerHistoryLink
};

module.exports = links;
