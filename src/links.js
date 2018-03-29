const getOffenderLink = (offenderNo) => {
  return `${links.notmEndpointUrl}/offenders/${offenderNo}/personal`;
};

const links = {
  notmEndpointUrl: '', // set from env by /user/me call
  getOffenderLink
};

module.exports = links;
