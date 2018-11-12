import { keyworkerPrisonStatsFactory } from '../controllers/keyworkerPrisonStats'

describe('Key worker prison stats', async () => {
  const keyworkerApi = {}
  const controller = keyworkerPrisonStatsFactory(keyworkerApi)
  const agencyId = 'LEI'
  const prisonStatsResponse = {
    summary: {
      requestedFromDate: '2018-01-01',
      requestedToDate: '2018-01-31',
      current: {
        dataRangeFrom: '2018-01-01',
        dataRangeTo: '2018-01-31',
        numPrisonersAssignedKeyWorker: 600,
        totalNumPrisoners: 600,
        numberKeyWorkerSessions: 2400,
        numberKeyWorkerEntries: 400,
        numberOfActiveKeyworkers: 100,
        percentagePrisonersWithKeyworker: 100,
        numProjectedKeyworkerSessions: 2400,
        complianceRate: 100,
        avgNumDaysFromReceptionToAllocationDays: 1,
        avgNumDaysFromReceptionToKeyWorkingSession: 2,
      },
    },
  }

  beforeEach(() => {
    keyworkerApi.prisonStats = jest.fn().mockReturnValue(prisonStatsResponse)
  })

  it('should make a call to get the stats for the correct prison', async () => {
    await controller.getPrisonStats({}, agencyId)

    expect(keyworkerApi.prisonStats).toBeCalledWith({}, agencyId)
  })

  describe('prison stats with no previous stats', () => {
    it('should return the correct payload ', async () => {
      const getPrisonStatsWithNoPreviousPayload = [
        {
          change: { period: 'period', value: 100 },
          heading: 'Total number of active key workers',
          name: 'numberOfActiveKeyworkers',
          type: 'number',
          value: 100,
        },
        {
          change: { period: 'period', value: 2400 },
          heading: 'Number of recorded key worker sessions',
          name: 'numberKeyWorkerSessions',
          type: 'number',
          value: 2400,
        },
        {
          change: { period: 'period', value: 100 },
          heading: 'Percentage of prisoners with allocated key worker',
          name: 'percentagePrisonersWithKeyworker',
          type: 'percentage',
          value: 100,
        },
        {
          change: { period: 'period', value: 2400 },
          heading: 'Number of projected key worker sessions',
          name: 'numProjectedKeyworkerSessions',
          type: 'number',
          value: 2400,
        },
        {
          change: { period: 'period', value: 100 },
          heading: 'Compliance rate',
          name: 'complianceRate',
          type: 'percentage',
          value: 100,
        },
        {
          change: { period: 'period', value: 1 },
          heading: 'Average time from reception to allocation',
          name: 'avgNumDaysFromReceptionToAllocationDays',
          type: 'day',
          value: 1,
        },
        {
          change: { period: 'period', value: 2 },
          heading: 'Average time from reception to first session',
          name: 'avgNumDaysFromReceptionToKeyWorkingSession',
          type: 'day',
          value: 2,
        },
      ]

      const payload = await controller.getPrisonStats({}, agencyId)

      expect(payload).toEqual(getPrisonStatsWithNoPreviousPayload)
    })
  })

  describe('prison stats with previous stats', () => {
    it('should return the correct payload ', async () => {
      prisonStatsResponse.summary.previous = {
        dataRangeFrom: '2017-12-01',
        dataRangeTo: '2017-12-31',
        numPrisonersAssignedKeyWorker: 300,
        totalNumPrisoners: 600,
        numberKeyWorkerSessions: 1200,
        numberKeyWorkerEntries: 200,
        numberOfActiveKeyworkers: 50,
        percentagePrisonersWithKeyworker: 50,
        numProjectedKeyworkerSessions: 1200,
        complianceRate: 50,
        avgNumDaysFromReceptionToAllocationDays: 3,
        avgNumDaysFromReceptionToKeyWorkingSession: 4,
      }

      const getPrisonStatsWithPreviousPayload = [
        {
          change: { period: 'period', value: 50 },
          heading: 'Total number of active key workers',
          name: 'numberOfActiveKeyworkers',
          type: 'number',
          value: 100,
        },
        {
          change: { period: 'period', value: 1200 },
          heading: 'Number of recorded key worker sessions',
          name: 'numberKeyWorkerSessions',
          type: 'number',
          value: 2400,
        },
        {
          change: { period: 'period', value: 50 },
          heading: 'Percentage of prisoners with allocated key worker',
          name: 'percentagePrisonersWithKeyworker',
          type: 'percentage',
          value: 100,
        },
        {
          change: { period: 'period', value: 1200 },
          heading: 'Number of projected key worker sessions',
          name: 'numProjectedKeyworkerSessions',
          type: 'number',
          value: 2400,
        },
        {
          change: { period: 'period', value: 50 },
          heading: 'Compliance rate',
          name: 'complianceRate',
          type: 'percentage',
          value: 100,
        },
        {
          change: { period: 'period', value: -2 },
          heading: 'Average time from reception to allocation',
          name: 'avgNumDaysFromReceptionToAllocationDays',
          type: 'day',
          value: 1,
        },
        {
          change: { period: 'period', value: -2 },
          heading: 'Average time from reception to first session',
          name: 'avgNumDaysFromReceptionToKeyWorkingSession',
          type: 'day',
          value: 2,
        },
      ]

      const payload = await controller.getPrisonStats({}, agencyId)

      expect(payload).toEqual(getPrisonStatsWithPreviousPayload)
    })
  })
})
