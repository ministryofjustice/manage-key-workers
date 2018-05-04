const getOffenderLink = (offenderNo) => {
  return `${links.notmEndpointUrl}offenders/${offenderNo}/personal`;
};

const getStaffLink = (staffId) => {
  return `/keyworker/${staffId}/profile`;
};


const links = {
  notmEndpointUrl: '', // set from env by /api/config call
  getOffenderLink,
  getStaffLink
};

module.exports = links;
