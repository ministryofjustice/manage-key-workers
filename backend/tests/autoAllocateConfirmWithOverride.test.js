const { factory } = require('../controllers/autoAllocateConfirmWithOverride')

const keyworkerApi = {}

describe('auto allocate with confirm override', () => {
  let res = {}

  beforeEach(() => {
    keyworkerApi.autoAllocateConfirm = jest.fn()
    keyworkerApi.allocate = jest.fn()
    res = {
      locals: {},
      json: jest.fn(),
    }
  })
  it('should confirm auto allocation', async () => {
    const { autoAllocate } = factory(keyworkerApi)

    const req = {
      query: { agencyId: 'LEI' },
      body: {
        allocatedKeyworkers: [],
      },
    }

    await autoAllocate(req, res)

    expect(keyworkerApi.autoAllocateConfirm).toHaveBeenCalledWith({}, 'LEI')
  })

  it('call attempt to allocate each offender and gracefully handle bad input', async () => {
    const { autoAllocate } = factory(keyworkerApi)

    const req = {
      query: { agencyId: 'LEI' },
      body: {
        allocatedKeyworkers: [{ offenderNo: 'A12345', staffId: 1 }, null],
      },
    }

    await autoAllocate(req, res)

    expect(keyworkerApi.allocate).toHaveBeenCalledWith(
      {},
      {
        offenderNo: 'A12345',
        staffId: 1,
        prisonId: 'LEI',
        allocationType: 'M',
        allocationReason: 'MANUAL',
        deallocationReason: 'OVERRIDE',
      }
    )
  })
})
