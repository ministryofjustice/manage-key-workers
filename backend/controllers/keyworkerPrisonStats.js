const asyncMiddleware = require('../middleware/asyncHandler')
const log = require('../log')

const keyworkerPrisonStatsFactory = keyworkerApi => {
  const createPayload = (current, previous) => {
    const items = {
      numberOfActiveKeyworkers: { heading: 'Total number of active key workers' },
      numberKeyWorkerSessions: { heading: 'Number of recorded key worker sessions' },
      percentagePrisonersWithKeyworker: {
        heading: 'Percentage of prisoners with allocated key worker',
        type: 'percentage',
      },
      numProjectedKeyworkerSessions: { heading: 'Number of projected key worker sessions' },
      complianceRate: { heading: 'Compliance rate', type: 'percentage' },
      avgNumDaysFromReceptionToAllocationDays: { heading: 'Average time from reception to allocation', type: 'day' },
      avgNumDaysFromReceptionToKeyWorkingSession: {
        heading: 'Average time from reception to first session',
        type: 'day',
      },
    }

    return Object.entries(items).map(([key, val]) => ({
      name: key,
      heading: val.heading,
      value: current[key],
      change: {
        value: current[key] - previous[key] || 0,
        period: 'month',
      },
      type: val.type,
    }))
  }

  const getPrisonStats = asyncMiddleware(async (req, res) => {
    const { agencyId } = req.query
    const { locals } = res
    const prisonStats = await keyworkerApi.prisonStats(locals, agencyId)
    const { current, previous } = prisonStats.summary

    const data = await createPayload(current, previous)
    log.debug({ data }, 'Response from keyworker prison stats request')
    res.json(data)
  })

  return {
    getPrisonStats,
  }
}

module.exports = {
  keyworkerPrisonStatsFactory,
}
