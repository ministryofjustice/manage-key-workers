const allocateKeyWorker = require('../controllers/allocateKeyWorker')

describe('Allocate key worker', () => {
  const allocationService = {}
  const elite2Api = {}
  const keyworkerApi = {}

  let req
  let res
  let controller

  beforeEach(() => {
    req = {
      session: {
        userDetails: {
          activeCaseLoadId: 'MDI',
        },
      },
      flash: jest.fn().mockReturnValue([]),
    }
    res = {
      locals: {},
      render: jest.fn(),
      redirect: jest.fn(),
    }

    allocationService.allocated = jest.fn().mockResolvedValue({ allocatedResponse: [] })
    allocationService.unallocated = jest.fn().mockResolvedValue([])

    keyworkerApi.availableKeyworkers = jest.fn().mockResolvedValue([
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
        firstName: 'JULIAN',
        lastName: 'DOE',
        capacity: 6,
        numberAllocated: 9,
        agencyId: 'MDI',
        status: 'ACTIVE',
        autoAllocationAllowed: true,
      },
    ])
    keyworkerApi.offenderKeyworkerList = jest.fn()
    keyworkerApi.allocationHistory = jest.fn()

    elite2Api.sentenceDetailList = jest.fn()

    controller = allocateKeyWorker({ allocationService, elite2Api, keyworkerApi })
  })

  describe('index', () => {
    describe('with no unallocated prisoners', () => {
      it('should make the expected calls', async () => {
        await controller.index(req, res)

        expect(allocationService.unallocated).toHaveBeenCalledWith(res.locals, 'MDI')
        expect(keyworkerApi.availableKeyworkers).not.toHaveBeenCalled()
        expect(keyworkerApi.offenderKeyworkerList).not.toHaveBeenCalled()
        expect(keyworkerApi.allocationHistory).not.toHaveBeenCalled()
        expect(elite2Api.sentenceDetailList).not.toHaveBeenCalled()
      })

      it('should render the correct template with the correct values', async () => {
        await controller.index(req, res)

        expect(res.render).toHaveBeenCalledWith('allocateKeyWorker', {
          activeCaseLoadId: 'MDI',
          allocationMode: 'manual',
          prisoners: [],
          recentlyAllocated: '[]',
        })
      })
    })

    describe('with unallocated prisoners', () => {
      beforeEach(() => {
        allocationService.unallocated.mockResolvedValue([
          {
            offenderNo: 'ABC123',
            firstName: 'FERINAND',
            lastName: 'ALFF',
            dateOfBirth: '1982-04-06',
            agencyId: 'MDI',
            assignedLivingUnitId: 11,
            assignedLivingUnitDesc: 'MDI-1-1',
            confirmedReleaseDate: '2022-04-30',
          },
          {
            offenderNo: 'ABC456',
            firstName: 'JOHN',
            lastName: 'SMITH',
            dateOfBirth: '1986-03-01',
            agencyId: 'MDI',
            assignedLivingUnitId: 12,
            assignedLivingUnitDesc: 'MDI-1-2',
            confirmedReleaseDate: '2030-05-30',
          },
        ])
        keyworkerApi.allocationHistory
          .mockResolvedValueOnce({ offender: { offenderNo: 'ABC123' }, allocationHistory: [] })
          .mockResolvedValueOnce({ offender: { offenderNo: 'ABC456' }, allocationHistory: [{ staffId: 2 }] })
      })

      it('should make the expected calls', async () => {
        await controller.index(req, res)

        expect(allocationService.unallocated).toHaveBeenCalledWith(res.locals, 'MDI')
        expect(keyworkerApi.availableKeyworkers).toHaveBeenCalledWith(res.locals, 'MDI')
        expect(keyworkerApi.offenderKeyworkerList).not.toHaveBeenCalled()
        expect(keyworkerApi.allocationHistory).toHaveBeenCalledTimes(2)
        expect(keyworkerApi.allocationHistory).toHaveBeenCalledWith(res.locals, 'ABC123')
        expect(keyworkerApi.allocationHistory).toHaveBeenCalledWith(res.locals, 'ABC456')
        expect(elite2Api.sentenceDetailList).not.toHaveBeenCalled()
      })

      it('should render the correct template with the correct values', async () => {
        await controller.index(req, res)

        expect(res.render).toHaveBeenCalledWith('allocateKeyWorker', {
          activeCaseLoadId: 'MDI',
          allocationMode: 'manual',
          prisoners: [
            {
              hasHistory: false,
              keyworkerList: [
                {
                  selected: false,
                  text: 'Bob Ball (6)',
                  value: '1:ABC123:M',
                },
                {
                  selected: false,
                  text: 'Julian Doe (9)',
                  value: '2:ABC123:M',
                },
              ],
              keyworkerName: undefined,
              keyworkerStaffId: undefined,
              location: 'MDI-1-1',
              name: 'Alff, Ferinand',
              prisonNumber: 'ABC123',
              releaseDate: '30/04/2022',
            },
            {
              hasHistory: true,
              keyworkerList: [
                {
                  selected: false,
                  text: 'Bob Ball (6)',
                  value: '1:ABC456:M',
                },
                {
                  selected: false,
                  text: 'Julian Doe (9)',
                  value: '2:ABC456:M',
                },
              ],
              keyworkerName: undefined,
              keyworkerStaffId: undefined,
              location: 'MDI-1-2',
              name: 'Smith, John',
              prisonNumber: 'ABC456',
              releaseDate: '30/05/2030',
            },
          ],
          recentlyAllocated: '[]',
        })
      })

      describe('and a recently allocated prisoner', () => {
        beforeEach(() => {
          req.flash.mockReturnValue([{ staffId: 1, offenderNo: 'ABC789' }])

          keyworkerApi.offenderKeyworkerList.mockResolvedValue([
            {
              offenderKeyworkerId: 21380,
              offenderNo: 'ABC789',
              staffId: 2,
              agencyId: 'MDI',
              assigned: '2021-04-09T09:44:47.581306',
              userId: 'TEST_USER',
              active: 'Y',
            },
          ])
          elite2Api.sentenceDetailList.mockResolvedValue([
            {
              offenderNo: 'ABC789',
              firstName: 'SIMON',
              lastName: 'GRAY',
              agencyLocationId: 'MDI',
              sentenceDetail: {
                confirmedReleaseDate: '2029-02-28',
              },
              dateOfBirth: '1995-01-11',
              agencyLocationDesc: 'Moorland (HMP & YOI)',
              internalLocationDesc: 'MDI-1-3',
            },
          ])
        })
        it('should make the expected calls', async () => {
          await controller.index(req, res)

          expect(allocationService.unallocated).toHaveBeenCalledWith(res.locals, 'MDI')
          expect(keyworkerApi.availableKeyworkers).toHaveBeenCalledWith(res.locals, 'MDI')
          expect(keyworkerApi.offenderKeyworkerList).toHaveBeenCalledWith(res.locals, 'MDI', ['ABC789'])
          expect(keyworkerApi.allocationHistory).toHaveBeenCalledTimes(3)
          expect(keyworkerApi.allocationHistory).toHaveBeenCalledWith(res.locals, 'ABC123')
          expect(keyworkerApi.allocationHistory).toHaveBeenCalledWith(res.locals, 'ABC456')
          expect(keyworkerApi.allocationHistory).toHaveBeenCalledWith(res.locals, 'ABC789')
          expect(elite2Api.sentenceDetailList).toHaveBeenCalledWith(res.locals, ['ABC789'])
        })

        it('should render the correct template with the correct values', async () => {
          await controller.index(req, res)

          expect(res.render).toHaveBeenCalledWith('allocateKeyWorker', {
            activeCaseLoadId: 'MDI',
            allocationMode: 'manual',
            prisoners: [
              {
                hasHistory: true,
                keyworkerList: [
                  {
                    selected: false,
                    text: 'Bob Ball (6)',
                    value: '1:ABC123:M',
                  },
                  {
                    selected: false,
                    text: 'Julian Doe (9)',
                    value: '2:ABC123:M',
                  },
                ],
                keyworkerName: undefined,
                keyworkerStaffId: undefined,
                location: 'MDI-1-1',
                name: 'Alff, Ferinand',
                prisonNumber: 'ABC123',
                releaseDate: '30/04/2022',
              },
              {
                hasHistory: false,
                keyworkerList: [
                  {
                    selected: false,
                    text: 'Bob Ball (6)',
                    value: '1:ABC789:M',
                  },
                ],
                keyworkerName: 'Julian Doe (9)',
                keyworkerStaffId: 2,
                location: 'MDI-1-3',
                name: 'Gray, Simon',
                prisonNumber: 'ABC789',
                releaseDate: '28/02/2029',
              },
              {
                hasHistory: false,
                keyworkerList: [
                  {
                    selected: false,
                    text: 'Bob Ball (6)',
                    value: '1:ABC456:M',
                  },
                  {
                    selected: false,
                    text: 'Julian Doe (9)',
                    value: '2:ABC456:M',
                  },
                ],
                keyworkerName: undefined,
                keyworkerStaffId: undefined,
                location: 'MDI-1-2',
                name: 'Smith, John',
                prisonNumber: 'ABC456',
                releaseDate: '30/05/2030',
              },
            ],
            recentlyAllocated: '[{"staffId":1,"offenderNo":"ABC789"}]',
          })
        })
      })
    })
  })

  describe('auto', () => {
    describe('with no allocated prisoners', () => {
      it('should make the expected calls', async () => {
        await controller.auto(req, res)

        expect(allocationService.allocated).toHaveBeenCalledWith(res.locals, 'MDI')
        expect(keyworkerApi.availableKeyworkers).not.toHaveBeenCalled()
        expect(keyworkerApi.offenderKeyworkerList).not.toHaveBeenCalled()
        expect(keyworkerApi.allocationHistory).not.toHaveBeenCalled()
        expect(elite2Api.sentenceDetailList).not.toHaveBeenCalled()
      })

      it('should render the correct template with the correct values', async () => {
        await controller.auto(req, res)

        expect(res.render).toHaveBeenCalledWith('allocateKeyWorker', {
          activeCaseLoadId: 'MDI',
          allocationMode: 'auto',
          prisoners: [],
          recentlyAllocated: '[]',
        })
      })
    })

    describe('with allocated prisoners', () => {
      beforeEach(() => {
        allocationService.allocated.mockResolvedValue({
          allocatedResponse: [
            {
              offenderNo: 'ABC123',
              firstName: 'FERINAND',
              lastName: 'ALFF',
              dateOfBirth: '1982-04-06',
              agencyId: 'MDI',
              assignedLivingUnitId: 11,
              internalLocationDesc: 'MDI-1-1',
              confirmedReleaseDate: '2022-04-30',
              staffId: 1,
              keyworkerDisplay: 'Ball, Bob',
              numberAllocated: '6',
              allocationType: 'P',
            },
            {
              offenderNo: 'ABC456',
              firstName: 'JOHN',
              lastName: 'SMITH',
              dateOfBirth: '1986-03-01',
              agencyId: 'MDI',
              assignedLivingUnitId: 12,
              internalLocationDesc: 'MDI-1-2',
              confirmedReleaseDate: '2030-05-30',
              staffId: 2,
              keyworkerDisplay: 'Doe, Julian',
              numberAllocated: '9',
              allocationType: 'P',
            },
          ],
        })
        keyworkerApi.allocationHistory
          .mockResolvedValueOnce({ offender: { offenderNo: 'ABC123' }, allocationHistory: [] })
          .mockResolvedValueOnce({ offender: { offenderNo: 'ABC456' }, allocationHistory: [{ staffId: 2 }] })
      })

      it('should make the expected calls', async () => {
        await controller.auto(req, res)

        expect(allocationService.allocated).toHaveBeenCalledWith(res.locals, 'MDI')
        expect(keyworkerApi.availableKeyworkers).toHaveBeenCalledWith(res.locals, 'MDI')
        expect(keyworkerApi.offenderKeyworkerList).not.toHaveBeenCalled()
        expect(keyworkerApi.allocationHistory).toHaveBeenCalledTimes(2)
        expect(keyworkerApi.allocationHistory).toHaveBeenCalledWith(res.locals, 'ABC123')
        expect(keyworkerApi.allocationHistory).toHaveBeenCalledWith(res.locals, 'ABC456')
        expect(elite2Api.sentenceDetailList).not.toHaveBeenCalled()
      })

      it('should render the correct template with the correct values', async () => {
        await controller.auto(req, res)

        expect(res.render).toHaveBeenCalledWith('allocateKeyWorker', {
          activeCaseLoadId: 'MDI',
          allocationMode: 'auto',
          prisoners: [
            {
              hasHistory: false,
              keyworkerList: [
                {
                  selected: true,
                  text: 'Bob Ball (6)',
                  value: '1:ABC123:A',
                },
                {
                  selected: false,
                  text: 'Julian Doe (9)',
                  value: '2:ABC123:M',
                },
              ],
              keyworkerName: false,
              keyworkerStaffId: 1,
              location: 'MDI-1-1',
              name: 'Alff, Ferinand',
              prisonNumber: 'ABC123',
              releaseDate: '30/04/2022',
            },
            {
              hasHistory: true,
              keyworkerList: [
                {
                  selected: false,
                  text: 'Bob Ball (6)',
                  value: '1:ABC456:M',
                },
                {
                  selected: true,
                  text: 'Julian Doe (9)',
                  value: '2:ABC456:A',
                },
              ],
              keyworkerName: false,
              keyworkerStaffId: 2,
              location: 'MDI-1-2',
              name: 'Smith, John',
              prisonNumber: 'ABC456',
              releaseDate: '30/05/2030',
            },
          ],
          recentlyAllocated: '[]',
        })
      })
    })
  })

  describe('post', () => {
    beforeEach(() => {
      keyworkerApi.allocate = jest.fn()
      keyworkerApi.autoAllocateConfirm = jest.fn()
    })

    describe('manual', () => {
      beforeEach(() => {
        req.body = {
          allocateKeyworker: ['1:ABC123:M', '', ''],
          recentlyAllocated: '[]',
        }
      })

      it('should make the correct calls', async () => {
        await controller.post(req, res)

        expect(req.flash).toHaveBeenCalledWith('recentlyAllocated', [
          {
            allocationType: 'M',
            offenderNo: 'ABC123',
            staffId: '1',
          },
        ])

        expect(keyworkerApi.autoAllocateConfirm).not.toHaveBeenCalled()
        expect(keyworkerApi.allocate).toHaveBeenCalledWith(res.locals, {
          offenderNo: 'ABC123',
          staffId: '1',
          prisonId: 'MDI',
          allocationType: 'M',
          allocationReason: 'MANUAL',
          deallocationReason: 'OVERRIDE',
        })

        expect(res.redirect).toHaveBeenCalledWith('/manage-key-workers/allocate-key-worker')
      })
    })

    describe('auto', () => {
      beforeEach(() => {
        req.body = {
          allocateKeyworker: ['1:ABC123:A', '', ''],
          recentlyAllocated: '[]',
        }
      })

      it('should make the correct calls', async () => {
        await controller.post(req, res)

        expect(req.flash).toHaveBeenCalled()

        // expect(keyworkerApi.autoAllocateConfirm).toHaveBeenCalledWith(res.locals, 'MDI')
        expect(keyworkerApi.allocate).toHaveBeenCalledWith(res.locals, {
          offenderNo: 'ABC123',
          staffId: '1',
          prisonId: 'MDI',
          allocationType: 'A',
          allocationReason: 'AUTO',
          deallocationReason: 'OVERRIDE',
        })

        expect(res.redirect).toHaveBeenCalledWith('/manage-key-workers/allocate-key-worker')
      })
    })
  })
})
