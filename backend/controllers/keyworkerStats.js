const moment = require('moment')
const asyncMiddleware = require('../middleware/asyncHandler')
const log = require('../log')

const totalNumberOfSessionCaseNotesWritten = (currentStats, pastStats, period) => ({
  name: 'totalNumberOfSessionCaseNotesWritten',
  heading: 'Number of recorded key worker sessions in the last month',
  value: currentStats.caseNoteSessionCount,
  change: {
    value: pastStats && currentStats.caseNoteSessionCount - pastStats.caseNoteSessionCount,
    period,
  },
})

const totalNumberOfEntryAndSessionCaseNoteWritten = (currentStats, pastStats, period) => ({
  name: 'totalNumberOfEntryAndSessionCaseNoteWritten',
  heading: 'Total number of key worker case notes written',
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
  heading: 'Compliance rate',
  value: currentStats.complianceRate,
  percentage: true,
  change: {
    value: pastStats && Number(parseFloat(currentStats.complianceRate - pastStats.complianceRate).toFixed(2)),
    period,
  },
})

const numberOfProjectedKeyworkerSessions = (currentStats, pastStats, period) => ({
  name: 'numberOfProjectedKeyworkerSessions',
  heading: 'Number of projected key worker sessions in the last month',
  value: currentStats.projectedKeyworkerSessions,
  change: {
    value: pastStats && currentStats.projectedKeyworkerSessions - pastStats.projectedKeyworkerSessions,
    period,
  },
})

const keyworkerStatsFactory = keyworkerApi => {
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

  const getStatsForStaffRoute = asyncMiddleware(async (req, res) => {
    const { agencyId, staffId, fromDate, toDate, period } = req.query
    const stats = await getStatsForStaff({ locals: res.locals, agencyId, staffId, fromDate, toDate, period })
    log.debug({ data: stats }, 'Response from keyworker stats request')
    res.json(stats)
  })

  return {
    getStatsForStaffRoute,
    getStatsForStaff,
  }
}

module.exports = {
  keyworkerStatsFactory,
}
