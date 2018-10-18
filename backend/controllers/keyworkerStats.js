const moment = require('moment');
const asyncMiddleware = require('../middleware/asyncHandler');
const log = require('../log');


const keyworkerStatsFactory = (keyworkerApi) => {
  const getStatsForStaffRoute = asyncMiddleware(async (req, res) => {
    const { agencyId, staffId, fromDate, toDate, period } = req.query;
    const stats = await getStatsForStaff({ locals: res.locals, agencyId, staffId, fromDate, toDate, period });
    log.debug({ data: stats }, 'Response from keyworker stats request');
    res.json(stats);
  });

  const getStatsForStaff = async ({ locals, agencyId, staffId, fromDate, toDate, period }) => {
    const getStats = [
      keyworkerApi.stats(locals, agencyId, staffId, fromDate, toDate),
      getPastStats(locals, agencyId, staffId, fromDate, toDate)
    ];

    const [
      currentStats,
      pastStats
    ] = await Promise.all(getStats);

    return currentStats && [
      numberOfProjectedKeyworkerSessions(currentStats, pastStats, period),
      totalNumberOfSessionCaseNotesWritten(currentStats, pastStats, period),
      complianceRate(currentStats, pastStats, period),
      totalNumberOfEntryAndSessionCaseNoteWritten(currentStats, pastStats, period)
    ];
  };

  const getPastStats = async (locals, agencyId, staffId, fromDate, toDate) => {
    const format = 'YYYY-MM-DD';
    const days = moment(toDate, format).diff(moment(fromDate, format), 'days');
    const pastFromDate = moment(fromDate).subtract(days, 'day');
    const pastToDate = moment(toDate).subtract(days, 'day');

    return keyworkerApi.stats(locals, agencyId, staffId, pastFromDate.format(format), pastToDate.format(format));
  };

  return {
    getStatsForStaffRoute,
    getStatsForStaff
  };
};

const totalNumberOfSessionCaseNotesWritten = (currentStats, pastStats, period) => ({
  name: 'totalNumberOfSessionCaseNotesWritten',
  heading: 'Number of recorded key worker sessions last month',
  value: currentStats.caseNoteSessionCount,
  change: {
    value: pastStats && currentStats.caseNoteSessionCount - pastStats.caseNoteSessionCount,
    period
  }
});

const totalNumberOfEntryAndSessionCaseNoteWritten = (currentStats, pastStats, period) => ({
  name: 'totalNumberOfEntryAndSessionCaseNoteWritten',
  heading: 'Total number of key worker case notes written',
  value: currentStats.caseNoteEntryCount + currentStats.caseNoteSessionCount,
  change: {
    value: pastStats && (currentStats.caseNoteEntryCount + currentStats.caseNoteSessionCount) -
        (pastStats.caseNoteEntryCount + pastStats.caseNoteSessionCount),
    period
  }
});


const complianceRate = (currentStats, pastStats, period) => ({
  name: 'complianceRate',
  heading: 'Compliance rate',
  value: currentStats.complianceRate,
  change: {
    value: pastStats && Number(parseFloat(currentStats.complianceRate - pastStats.complianceRate).toFixed(2)),
    period
  }
});

const numberOfProjectedKeyworkerSessions = (currentStats, pastStats, period) => ({
  name: 'numberOfProjectedKeyworkerSessions',
  heading: 'Number of projected key worker sessions last month',
  value: currentStats.numberOfProjectedKeyworkerSessions,
  change: {
    value: pastStats && currentStats.numberOfProjectedKeyworkerSessions - pastStats.numberOfProjectedKeyworkerSessions,
    period
  }
});


module.exports = {
  keyworkerStatsFactory
};
