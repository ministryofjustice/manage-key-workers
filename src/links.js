const getOffenderLink = (offenderNo) => {
  return `${(process.env.NN_ENDPOINT_URL || 'http://notm-dev.hmpps.dsd.test:3000/')}offenders/${offenderNo}/personal`;
};

const links = {
  getOffenderLink
};

module.exports = links;
