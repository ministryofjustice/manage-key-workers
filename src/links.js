const getOffenderLink = (offenderNo) => {
  return `${links.notmEndpointUrl}offenders/${offenderNo}/personal`;
};

const getHomeLink = () => {
  return `${links.notmEndpointUrl}`;
};

const getStaffLink = (staffId) => {
  return `/keyworker/${staffId}/profile`;
};


const links = {
  notmEndpointUrl: '', // set from env by /api/config call
  getOffenderLink,
  getHomeLink,
  getStaffLink
};

module.exports = links;
