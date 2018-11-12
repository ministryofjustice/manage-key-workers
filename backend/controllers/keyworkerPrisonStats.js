const formatNumber = (value, type) => {
  if (type === 'percentage') return Number(parseFloat(value).toFixed(2))
  return value
}

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
        value: previous ? formatNumber(current[key] - previous[key], val.type) : current[key],
        period: 'period',
      },
      type: val.type || 'number',
    }))
  }

  const getPrisonStats = async (locals, agencyId) => {
    const prisonStats = await keyworkerApi.prisonStats(locals, agencyId)
    const {
      summary: { current, previous },
    } = prisonStats
    const payload = createPayload(current, previous)

    return payload
  }

  return {
    getPrisonStats,
  }
}

module.exports = {
  keyworkerPrisonStatsFactory,
}
