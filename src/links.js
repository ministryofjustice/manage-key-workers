const getOffenderLink = (offenderNo) => {
  return `https://notm-dev.hmpps.dsd.io/offenders/${offenderNo}/personal`;
};

const links = {
  getOffenderLink
};

module.exports = links;
