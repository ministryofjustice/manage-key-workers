const { sortAndFormatKeyworkerNameAndAllocationCount } = require('../controllers/keyworkerShared')

const keyWorkers = [
  {
    staffId: 1,
    firstName: 'BOB',
    lastName: 'BALL',
    capacity: 6,
    numberAllocated: 6,
    agencyId: 'MDI',
    status: 'ACTIVE',
    autoAllocationAllowed: true,
  },
  {
    staffId: 2,
    firstName: 'BOB',
    lastName: 'DUKE',
    capacity: 6,
    numberAllocated: 6,
    agencyId: 'MDI',
    status: 'ACTIVE',
    autoAllocationAllowed: true,
  },
  {
    staffId: 2,
    firstName: 'JULIAN',
    lastName: 'DOE',
    capacity: 6,
    numberAllocated: 9,
    agencyId: 'MDI',
    status: 'ACTIVE',
    autoAllocationAllowed: true,
  },
  {
    staffId: 3,
    firstName: 'ANDY',
    lastName: 'SMITH',
    capacity: 6,
    numberAllocated: 1,
    agencyId: 'MDI',
    status: 'ACTIVE',
    autoAllocationAllowed: true,
  },
]
describe('Key worker shared', () => {
  describe('key worker lists', () => {
    it('should sort by number allocated, then by last name', async () => {
      const results = sortAndFormatKeyworkerNameAndAllocationCount(keyWorkers)

      expect(results).toEqual([
        expect.objectContaining({
          formattedName: '1 - Smith, Andy',
        }),
        expect.objectContaining({
          formattedName: '6 - Ball, Bob',
        }),
        expect.objectContaining({
          formattedName: '6 - Duke, Bob',
        }),
        expect.objectContaining({
          formattedName: '9 - Doe, Julian',
        }),
      ])
    })

    it('should display a zero when the key worker does not have allocations', async () => {
      const results = sortAndFormatKeyworkerNameAndAllocationCount([
        {
          staffId: 2,
          firstName: 'JULIAN',
          lastName: 'DOE',
          capacity: 6,
          agencyId: 'MDI',
          status: 'ACTIVE',
          autoAllocationAllowed: true,
        },
      ])

      expect(results).toEqual([
        expect.objectContaining({
          formattedName: '0 - Doe, Julian',
        }),
      ])
    })
  })
})
