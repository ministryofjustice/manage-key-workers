const moment = require('moment')
const log = require('../log')

const totalNumberOfSessionCaseNotesWritten = (currentStats, pastStats, period) => ({
  name: 'totalNumberOfSessionCaseNotesWritten',
  heading: 'Recorded sessions',
  value: currentStats.caseNoteSessionCount,
  change: {
    value: pastStats && currentStats.caseNoteSessionCount - pastStats.caseNoteSessionCount,
    period,
  },
})

const totalNumberOfEntryAndSessionCaseNoteWritten = (currentStats, pastStats, period) => ({
  name: 'totalNumberOfEntryAndSessionCaseNoteWritten',
  heading: 'Case notes written',
  value: currentStats.caseNoteEntryCount + currentStats.caseNoteSessionCount,
  change: {
    value:
      pastStats &&
      currentStats.caseNoteEntryCount +
        currentStats.caseNoteSessionCount -
        (pastStats.caseNoteEntryCount + pastStats.caseNoteSessionCount),
    period,
  },
})

const complianceRate = (currentStats, pastStats, period) => ({
  name: 'complianceRate',
  heading: 'Session compliance',
  value: currentStats.complianceRate,
  type: 'percentage',
  change: {
    value: pastStats && Number(parseFloat(currentStats.complianceRate - pastStats.complianceRate).toFixed(2)),
    period,
  },
})

const numberOfProjectedKeyworkerSessions = (currentStats, pastStats, period) => ({
  name: 'numberOfProjectedKeyworkerSessions',
  heading: 'Projected sessions',
  value: currentStats.projectedKeyworkerSessions,
  change: {
    value: pastStats && currentStats.projectedKeyworkerSessions - pastStats.projectedKeyworkerSessions,
    period,
  },
})

const keyworkerStatsFactory = (keyworkerApi) => {
  const getPastStats = async (locals, agencyId, staffId, fromDate, toDate) => {
    const format = 'YYYY-MM-DD'
    const days = moment(toDate, format).diff(moment(fromDate, format), 'days')
    const pastFromDate = moment(fromDate).subtract(days, 'day')
    const pastToDate = moment(toDate).subtract(days, 'day')

    return keyworkerApi.stats(locals, agencyId, staffId, pastFromDate.format(format), pastToDate.format(format))
  }

  const getStatsForStaff = async ({ locals, agencyId, staffId, fromDate, toDate, period }) => {
    const getStats = [
      keyworkerApi.stats(locals, agencyId, staffId, fromDate, toDate),
      getPastStats(locals, agencyId, staffId, fromDate, toDate),
    ]

    const [currentStats, pastStats] = await Promise.all(getStats)

    return (
      currentStats && [
        numberOfProjectedKeyworkerSessions(currentStats, pastStats, period),
        totalNumberOfSessionCaseNotesWritten(currentStats, pastStats, period),
        complianceRate(currentStats, pastStats, period),
        totalNumberOfEntryAndSessionCaseNoteWritten(currentStats, pastStats, period),
      ]
    )
  }

  const getStatsForStaffRoute = async (req, res) => {
    const { agencyId, staffId, fromDate, toDate, period } = req.query
    const stats = await getStatsForStaff({ locals: res.locals, agencyId, staffId, fromDate, toDate, period })
    log.debug('Response from keyworker stats request')
    res.json(stats)
  }

  return {
    getStatsForStaffRoute,
    getStatsForStaff,
  }
}

module.exports = {
  keyworkerStatsFactory,
}
