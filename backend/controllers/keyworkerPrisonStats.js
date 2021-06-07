const formatNumber = (value, type) => {
  if (type === 'percentage') return Number(parseFloat(value).toFixed(2))
  return value
}

const keyworkerPrisonStatsFactory = (keyworkerApi) => {
  const createPayload = (current, previous) => {
    if (!current) return []

    const items = {
      numberOfActiveKeyworkers: { heading: 'Total number of active key workers' },
      percentagePrisonersWithKeyworker: {
        heading: 'Percentage of prisoners with an allocated key worker',
        type: 'percentage',
      },
      avgNumDaysFromReceptionToAllocationDays: {
        heading: 'Average time from reception to key worker allocation',
        type: 'day',
      },
      avgNumDaysFromReceptionToKeyWorkingSession: {
        heading: 'Average time from reception to first key worker session',
        type: 'day',
      },
      numProjectedKeyworkerSessions: { heading: 'Number of projected key worker sessions' },
      numberKeyWorkerSessions: { heading: 'Number of recorded key worker sessions' },
      complianceRate: { heading: 'Compliance rate', type: 'percentage' },
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

  const getPrisonStats = async (locals, agencyId, fromDate, toDate) => {
    const prisonStats = await keyworkerApi.prisonStats(locals, agencyId, fromDate, toDate)
    const { capacityTier1 } = await keyworkerApi.getPrisonMigrationStatus(locals, agencyId)

    const {
      summary: { current, previous },
    } = prisonStats

    const stats = createPayload(current, previous)

    return {
      stats,
      prisonerToKeyWorkerRatio: capacityTier1,
    }
  }

  return {
    getPrisonStats,
  }
}

module.exports = {
  keyworkerPrisonStatsFactory,
}
