const allocateKeyWorker = require('../controllers/allocateKeyWorker')

describe('Allocate key worker', () => {
  const allocationService = {}
  const keyworkerApi = {}
  const oauthApi = {}

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

    keyworkerApi.keyworkerSearch = jest.fn().mockResolvedValue([
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
      {
        staffId: 3,
        firstName: 'ANDY',
        lastName: 'SMITH',
        capacity: 6,
        numberAllocated: 1,
        agencyId: 'MDI',
        status: 'UNAVAILABLE_LONG_TERM_ABSENCE',
        autoAllocationAllowed: true,
      },
    ])
    keyworkerApi.offenderKeyworkerList = jest.fn()
    keyworkerApi.allocationHistorySummary = jest.fn()
    keyworkerApi.getPrisonMigrationStatus = jest.fn().mockResolvedValue({})

    oauthApi.currentRoles = jest.fn().mockResolvedValue([])

    controller = allocateKeyWorker({ allocationService, keyworkerApi, oauthApi })
  })

  describe('index', () => {
    describe('with no unallocated prisoners', () => {
      it('should make the expected calls', async () => {
        await controller.index(req, res)

        expect(allocationService.unallocated).toHaveBeenCalledWith(res.locals, 'MDI')
        expect(keyworkerApi.keyworkerSearch).not.toHaveBeenCalled()
        expect(keyworkerApi.offenderKeyworkerList).not.toHaveBeenCalled()
        expect(keyworkerApi.allocationHistorySummary).not.toHaveBeenCalled()
      })

      it('should render the correct template with the correct values', async () => {
        await controller.index(req, res)

        expect(res.render).toHaveBeenCalledWith('allocateKeyWorker', {
          activeCaseLoadId: 'MDI',
          allocationMode: 'manual',
          canAutoAllocate: false,
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
        keyworkerApi.allocationHistorySummary.mockResolvedValue([
          {
            offenderNo: 'ABC789',
            hasHistory: false,
          },
          {
            offenderNo: 'ABC123',
            hasHistory: false,
          },
          {
            offenderNo: 'ABC456',
            hasHistory: true,
          },
        ])
      })

      it('should make the expected calls', async () => {
        await controller.index(req, res)

        expect(oauthApi.currentRoles).toHaveBeenCalledWith({})
        expect(allocationService.unallocated).toHaveBeenCalledWith(res.locals, 'MDI')
        expect(keyworkerApi.getPrisonMigrationStatus).toHaveBeenCalledWith({}, 'MDI')
        expect(keyworkerApi.keyworkerSearch).toHaveBeenCalledWith(res.locals, {
          agencyId: 'MDI',
          searchText: '',
          statusFilter: '',
        })
        expect(keyworkerApi.offenderKeyworkerList).not.toHaveBeenCalled()
        expect(keyworkerApi.allocationHistorySummary).toHaveBeenCalledWith(res.locals, ['ABC123', 'ABC456'])
      })

      it('should render the correct template with the correct values', async () => {
        await controller.index(req, res)

        expect(res.render).toHaveBeenCalledWith('allocateKeyWorker', {
          activeCaseLoadId: 'MDI',
          allocationMode: 'manual',
          canAutoAllocate: false,
          prisoners: [
            {
              hasHistory: false,
              keyworkerList: [
                {
                  selected: false,
                  text: 'Bob Ball (6)',
                  value:
                    '{"allocationType":"M","firstName":"FERINAND","lastName":"ALFF","location":"MDI-1-1","offenderNo":"ABC123","releaseDate":"2022-04-30","staffId":1}',
                },
                {
                  selected: false,
                  text: 'Julian Doe (9)',
                  value:
                    '{"allocationType":"M","firstName":"FERINAND","lastName":"ALFF","location":"MDI-1-1","offenderNo":"ABC123","releaseDate":"2022-04-30","staffId":2}',
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
                  value:
                    '{"allocationType":"M","firstName":"JOHN","lastName":"SMITH","location":"MDI-1-2","offenderNo":"ABC456","releaseDate":"2030-05-30","staffId":1}',
                },
                {
                  selected: false,
                  text: 'Julian Doe (9)',
                  value:
                    '{"allocationType":"M","firstName":"JOHN","lastName":"SMITH","location":"MDI-1-2","offenderNo":"ABC456","releaseDate":"2030-05-30","staffId":2}',
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
          req.flash.mockReturnValue([
            {
              allocationType: 'M',
              firstName: 'Simon',
              lastName: 'Gray',
              location: 'MDI-1-3',
              offenderNo: 'ABC789',
              releaseDate: '2029-02-28',
              staffId: 1,
            },
          ])

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
        })
        it('should make the expected calls', async () => {
          await controller.index(req, res)

          expect(allocationService.unallocated).toHaveBeenCalledWith(res.locals, 'MDI')
          expect(keyworkerApi.keyworkerSearch).toHaveBeenCalledWith(res.locals, {
            agencyId: 'MDI',
            searchText: '',
            statusFilter: '',
          })
          expect(keyworkerApi.offenderKeyworkerList).toHaveBeenCalledWith(res.locals, 'MDI', ['ABC789'])
          expect(keyworkerApi.allocationHistorySummary).toHaveBeenCalledWith(res.locals, ['ABC789', 'ABC123', 'ABC456'])
        })

        it('should render the correct template with the correct values', async () => {
          await controller.index(req, res)

          expect(res.render).toHaveBeenCalledWith('allocateKeyWorker', {
            activeCaseLoadId: 'MDI',
            allocationMode: 'manual',
            canAutoAllocate: false,
            prisoners: [
              {
                hasHistory: false,
                keyworkerList: [
                  {
                    selected: false,
                    text: 'Bob Ball (6)',
                    value:
                      '{"allocationType":"M","firstName":"FERINAND","lastName":"ALFF","location":"MDI-1-1","offenderNo":"ABC123","releaseDate":"2022-04-30","staffId":1}',
                  },
                  {
                    selected: false,
                    text: 'Julian Doe (9)',
                    value:
                      '{"allocationType":"M","firstName":"FERINAND","lastName":"ALFF","location":"MDI-1-1","offenderNo":"ABC123","releaseDate":"2022-04-30","staffId":2}',
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
                    value:
                      '{"allocationType":"M","firstName":"Simon","lastName":"Gray","location":"MDI-1-3","offenderNo":"ABC789","releaseDate":"2029-02-28","staffId":1}',
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
                hasHistory: true,
                keyworkerList: [
                  {
                    selected: false,
                    text: 'Bob Ball (6)',
                    value:
                      '{"allocationType":"M","firstName":"JOHN","lastName":"SMITH","location":"MDI-1-2","offenderNo":"ABC456","releaseDate":"2030-05-30","staffId":1}',
                  },
                  {
                    selected: false,
                    text: 'Julian Doe (9)',
                    value:
                      '{"allocationType":"M","firstName":"JOHN","lastName":"SMITH","location":"MDI-1-2","offenderNo":"ABC456","releaseDate":"2030-05-30","staffId":2}',
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
            recentlyAllocated:
              '[{"allocationType":"M","firstName":"Simon","lastName":"Gray","location":"MDI-1-3","offenderNo":"ABC789","releaseDate":"2029-02-28","staffId":1}]',
          })
        })
      })

      it('should let the template know that the user can auto allocate', async () => {
        oauthApi.currentRoles.mockResolvedValue([{ roleCode: 'OMIC_ADMIN' }])
        keyworkerApi.getPrisonMigrationStatus.mockResolvedValue({ migrated: true, autoAllocatedSupported: true })

        await controller.index(req, res)

        expect(res.render).toHaveBeenCalledWith(
          'allocateKeyWorker',
          expect.objectContaining({
            canAutoAllocate: true,
          })
        )
      })
    })
  })

  describe('auto', () => {
    describe('with no allocated prisoners', () => {
      it('should make the expected calls', async () => {
        await controller.auto(req, res)

        expect(allocationService.allocated).toHaveBeenCalledWith(res.locals, 'MDI')
        expect(keyworkerApi.keyworkerSearch).not.toHaveBeenCalled()
        expect(keyworkerApi.offenderKeyworkerList).not.toHaveBeenCalled()
        expect(keyworkerApi.allocationHistorySummary).not.toHaveBeenCalled()
      })

      it('should render the correct template with the correct values', async () => {
        await controller.auto(req, res)

        expect(res.render).toHaveBeenCalledWith('allocateKeyWorker', {
          activeCaseLoadId: 'MDI',
          allocationMode: 'auto',
          canAutoAllocate: false,
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
              staffId: 3,
              keyworkerDisplay: 'Doe, Julian',
              numberAllocated: '9',
              allocationType: 'P',
            },
          ],
        })
        keyworkerApi.allocationHistorySummary.mockResolvedValue([
          {
            offenderNo: 'ABC123',
            hasHistory: false,
          },
          {
            offenderNo: 'ABC456',
            hasHistory: true,
          },
        ])
      })

      it('should make the expected calls', async () => {
        await controller.auto(req, res)

        expect(allocationService.allocated).toHaveBeenCalledWith(res.locals, 'MDI')
        expect(keyworkerApi.keyworkerSearch).toHaveBeenCalledWith(res.locals, {
          agencyId: 'MDI',
          searchText: '',
          statusFilter: '',
        })
        expect(keyworkerApi.offenderKeyworkerList).not.toHaveBeenCalled()
        expect(keyworkerApi.allocationHistorySummary).toHaveBeenCalledWith(res.locals, ['ABC123', 'ABC456'])
      })

      it('should render the correct template with the correct values', async () => {
        await controller.auto(req, res)

        expect(res.render).toHaveBeenCalledWith('allocateKeyWorker', {
          activeCaseLoadId: 'MDI',
          allocationMode: 'auto',
          canAutoAllocate: false,
          prisoners: [
            {
              hasHistory: false,
              keyworkerList: [
                {
                  selected: true,
                  text: 'Bob Ball (6)',
                  value:
                    '{"allocationType":"A","firstName":"FERINAND","lastName":"ALFF","location":"MDI-1-1","offenderNo":"ABC123","releaseDate":"2022-04-30","staffId":1}',
                },
                {
                  selected: false,
                  text: 'Julian Doe (9)',
                  value:
                    '{"allocationType":"M","firstName":"FERINAND","lastName":"ALFF","location":"MDI-1-1","offenderNo":"ABC123","releaseDate":"2022-04-30","staffId":2}',
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
                  selected: true,
                  text: 'Andy Smith (1)',
                  value:
                    '{"allocationType":"A","firstName":"JOHN","lastName":"SMITH","location":"MDI-1-2","offenderNo":"ABC456","releaseDate":"2030-05-30","staffId":3}',
                },
                {
                  selected: false,
                  text: 'Bob Ball (6)',
                  value:
                    '{"allocationType":"M","firstName":"JOHN","lastName":"SMITH","location":"MDI-1-2","offenderNo":"ABC456","releaseDate":"2030-05-30","staffId":1}',
                },
                {
                  selected: false,
                  text: 'Julian Doe (9)',
                  value:
                    '{"allocationType":"M","firstName":"JOHN","lastName":"SMITH","location":"MDI-1-2","offenderNo":"ABC456","releaseDate":"2030-05-30","staffId":2}',
                },
              ],
              keyworkerName: false,
              keyworkerStaffId: 3,
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
          allocateKeyworker: [
            '{"allocationType":"M","firstName":"FERINAND","lastName":"ALFF","location":"MDI-1-1","offenderNo":"ABC123","releaseDate":"2022-04-30","staffId":1}',
            '',
            '',
          ],
          recentlyAllocated: '[]',
        }
      })

      it('should make the correct calls', async () => {
        await controller.post(req, res)

        expect(req.flash).toHaveBeenCalledWith('recentlyAllocated', [
          {
            allocationType: 'M',
            firstName: 'FERINAND',
            lastName: 'ALFF',
            location: 'MDI-1-1',
            offenderNo: 'ABC123',
            releaseDate: '2022-04-30',
            staffId: 1,
          },
        ])

        expect(keyworkerApi.autoAllocateConfirm).not.toHaveBeenCalled()
        expect(keyworkerApi.allocate).toHaveBeenCalledWith(res.locals, {
          offenderNo: 'ABC123',
          staffId: 1,
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
          allocateKeyworker: [
            '{"allocationType":"A","firstName":"FERINAND","lastName":"ALFF","location":"MDI-1-1","offenderNo":"ABC123","releaseDate":"2022-04-30","staffId":1}',
            '',
            '',
          ],
          allocationMode: 'auto',
          recentlyAllocated: '[]',
        }
      })

      it('should make the correct calls', async () => {
        await controller.post(req, res)

        expect(req.flash).toHaveBeenCalled()

        expect(keyworkerApi.autoAllocateConfirm).toHaveBeenCalledWith(res.locals, 'MDI')
        expect(keyworkerApi.allocate).not.toHaveBeenCalled()

        expect(res.redirect).toHaveBeenCalledWith('/manage-key-workers/allocate-key-worker')
      })
    })
  })
})
