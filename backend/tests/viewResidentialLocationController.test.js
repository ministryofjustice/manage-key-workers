const config = require('../config')
const viewResidentialLocation = require('../controllers/viewResidentialLocation')

describe('View residential location', () => {
  const allocationService = {}
  const complexityOfNeedApi = {}
  const elite2Api = {}
  const keyworkerApi = {}
  const systemOauthClient = {}

  let req
  let res
  let controller

  beforeEach(() => {
    config.apis.complexity.enabled_prisons = ['MDI']
    req = {
      originalUrl: 'bla',
      session: {
        userDetails: {
          activeCaseLoadId: 'MDI',
          username: 'user123',
        },
      },
    }
    res = {
      locals: {},
      render: jest.fn(),
      redirect: jest.fn(),
    }

    allocationService.searchOffendersPaginated = jest
      .fn()
      .mockResolvedValue({ keyworkerResponse: [], offenderResponse: [] })

    complexityOfNeedApi.getComplexOffenders = jest.fn().mockResolvedValue([])

    keyworkerApi.allocationHistorySummary = jest.fn().mockResolvedValue([])

    systemOauthClient.getClientCredentialsTokens = jest.fn()

    elite2Api.userLocations = jest.fn().mockResolvedValue([
      {
        locationId: 1,
        locationType: 'INST',
        description: 'Moorland (HMP & YOI)',
        agencyId: 'MDI',
        locationPrefix: 'MDI',
      },
      {
        locationId: 2,
        locationType: 'WING',
        description: 'Houseblock 1',
        agencyId: 'MDI',
        locationPrefix: 'MDI-1',
        userDescription: 'Houseblock 1',
      },
      {
        locationId: 3,
        locationType: 'WING',
        description: 'Houseblock 2',
        agencyId: 'MDI',
        locationPrefix: 'MDI-2',
        userDescription: 'Houseblock 2',
      },
    ])

    keyworkerApi.deallocate = jest.fn()
    keyworkerApi.allocate = jest.fn()

    controller = viewResidentialLocation({
      allocationService,
      complexityOfNeedApi,
      elite2Api,
      keyworkerApi,
      systemOauthClient,
    })
  })

  describe('index', () => {
    describe('with no residential location selected', () => {
      beforeEach(() => {
        req.query = {}
      })

      it('should make the expected calls', async () => {
        await controller.index(req, res)

        expect(elite2Api.userLocations).toHaveBeenCalledWith(res.locals)
        expect(allocationService.searchOffendersPaginated).not.toHaveBeenCalled()
        expect(complexityOfNeedApi.getComplexOffenders).not.toHaveBeenCalled()
        expect(keyworkerApi.allocationHistorySummary).not.toHaveBeenCalled()
      })

      it('should render the template with the correct data', async () => {
        await controller.index(req, res)

        expect(res.render).toHaveBeenCalledWith('viewResidentialLocation', {
          activeCaseLoadId: 'MDI',
          formValues: {},
          pagination: {
            items: [],
            next: false,
            previous: false,
            results: {
              count: undefined,
              from: NaN,
              to: NaN,
            },
          },
          errors: [],
          prisoners: [],
          residentialLocations: [
            {
              text: 'Houseblock 1',
              value: 'MDI-1',
            },
            {
              text: 'Houseblock 2',
              value: 'MDI-2',
            },
          ],
        })
      })
    })

    describe('with the default residential location label selected', () => {
      beforeEach(() => {
        req.query = {
          residentialLocation: '',
        }
      })

      it('should make the expected calls', async () => {
        await controller.index(req, res)

        expect(elite2Api.userLocations).toHaveBeenCalledWith(res.locals)
        expect(allocationService.searchOffendersPaginated).not.toHaveBeenCalled()
        expect(complexityOfNeedApi.getComplexOffenders).not.toHaveBeenCalled()
        expect(keyworkerApi.allocationHistorySummary).not.toHaveBeenCalled()
      })

      it('should render the template with the correct error', async () => {
        await controller.index(req, res)

        expect(res.render).toHaveBeenCalledWith('viewResidentialLocation', {
          activeCaseLoadId: 'MDI',
          errors: [
            {
              href: '#residentialLocation',
              html: 'Select a residential location',
            },
          ],
          formValues: {
            residentialLocation: '',
          },
          pagination: {
            items: [],
            next: false,
            previous: false,
            results: {
              count: undefined,
              from: NaN,
              to: NaN,
            },
          },
          prisoners: [],
          residentialLocations: [
            {
              text: 'Houseblock 1',
              value: 'MDI-1',
            },
            {
              text: 'Houseblock 2',
              value: 'MDI-2',
            },
          ],
        })
      })
    })

    describe('with a residential location selected', () => {
      beforeEach(() => {
        req.query = { residentialLocation: 'MDI-1' }

        allocationService.searchOffendersPaginated.mockResolvedValue({
          keyworkerResponse: [
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
          ],
          offenderResponse: [
            {
              offenderNo: 'ABC123',
              firstName: 'FERINAND',
              lastName: 'ALFF',
              dateOfBirth: '1982-04-06',
              agencyId: 'MDI',
              assignedLivingUnitId: 11,
              assignedLivingUnitDesc: 'MDI-1-1',
              staffId: null,
              keyworkerDisplay: '--',
              numberAllocated: null,
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
              staffId: 2,
              keyworkerDisplay: 'Doe, Julian',
              numberAllocated: '9',
              confirmedReleaseDate: '2030-05-30',
            },
            {
              offenderNo: 'ABC789',
              firstName: 'SIMON',
              lastName: 'GRAY',
              dateOfBirth: '1980-04-03',
              agencyId: 'MDI',
              assignedLivingUnitId: 13,
              assignedLivingUnitDesc: 'MDI-1-3',
              staffId: null,
              keyworkerDisplay: '--',
              numberAllocated: null,
              confirmedReleaseDate: '2029-02-28',
            },
          ],
        })
        complexityOfNeedApi.getComplexOffenders.mockResolvedValue([
          {
            offenderNo: 'ABC123',
            level: 'high',
          },
        ])
        keyworkerApi.allocationHistorySummary.mockResolvedValue([
          {
            offenderNo: 'ABC123',
            hasHistory: false,
          },
          {
            offenderNo: 'ABC456',
            hasHistory: true,
          },
          {
            offenderNo: 'ABC789',
            hasHistory: false,
          },
        ])
      })

      it('should make the expected calls', async () => {
        await controller.index(req, res)

        expect(elite2Api.userLocations).toHaveBeenCalledWith(res.locals)
        expect(allocationService.searchOffendersPaginated).toHaveBeenCalledWith(res.locals, {
          agencyId: 'MDI',
          keywords: '',
          pageRequest: {
            'page-offset': 0,
            'page-limit': 20,
          },
          locationPrefix: 'MDI-1',
        })
        expect(complexityOfNeedApi.getComplexOffenders).toHaveBeenCalledWith(undefined, ['ABC123', 'ABC456', 'ABC789'])
      })

      it('should render the template with the correct data', async () => {
        await controller.index(req, res)

        expect(res.render).toHaveBeenCalledWith(
          'viewResidentialLocation',
          expect.objectContaining({
            activeCaseLoadId: 'MDI',
            formValues: {
              residentialLocation: 'MDI-1',
            },
            residentialLocations: [
              {
                text: 'Houseblock 1',
                value: 'MDI-1',
              },
              {
                text: 'Houseblock 2',
                value: 'MDI-2',
              },
            ],
          })
        )
      })

      it('should indicate a high complexity prisoner and not return keyworker list', async () => {
        await controller.index(req, res)

        expect(res.render).toHaveBeenCalledWith(
          'viewResidentialLocation',
          expect.objectContaining({
            prisoners: expect.arrayContaining([
              {
                hasHistory: false,
                isHighComplexity: true,
                keyworkerList: false,
                keyworkerName: null,
                keyworkerStaffId: null,
                location: 'MDI-1-1',
                name: 'Alff, Ferinand',
                prisonNumber: 'ABC123',
                releaseDate: '30/04/2022',
              },
            ]),
          })
        )
      })

      it('should only check for complex offenders when the feature is enabled', async () => {
        config.apis.complexity.enabled_prisons = ['LEI']
        await controller.index(req, res)

        expect(res.render).toHaveBeenCalledWith(
          'viewResidentialLocation',
          expect.objectContaining({
            prisoners: expect.arrayContaining([
              expect.objectContaining({
                isHighComplexity: false,
              }),
            ]),
          })
        )

        expect(complexityOfNeedApi.getComplexOffenders).not.toHaveBeenCalled()
      })

      it('should use client credentials when making request to the complexity api', async () => {
        const systemContext = { client_creds: true }

        systemOauthClient.getClientCredentialsTokens = jest.fn().mockResolvedValue(systemContext)

        await controller.index(req, res)

        expect(systemOauthClient.getClientCredentialsTokens).toHaveBeenCalledWith('user123')
        expect(complexityOfNeedApi.getComplexOffenders).toHaveBeenCalledWith(systemContext, [
          'ABC123',
          'ABC456',
          'ABC789',
        ])
      })

      it('should return deallocate as an option and other keyworkers except for the current one in the keyworker list', async () => {
        await controller.index(req, res)

        expect(res.render).toHaveBeenCalledWith(
          'viewResidentialLocation',
          expect.objectContaining({
            prisoners: expect.arrayContaining([
              {
                hasHistory: true,
                isHighComplexity: false,
                keyworkerList: [
                  { text: 'Deallocate', value: '2:ABC456:true' },
                  { text: '6 - Ball, Bob', value: '1:ABC456' },
                ],
                keyworkerName: 'Doe, Julian (9)',
                keyworkerStaffId: 2,
                location: 'MDI-1-2',
                name: 'Smith, John',
                prisonNumber: 'ABC456',
                releaseDate: '30/05/2030',
              },
            ]),
          })
        )
      })

      it('should not return deallocate as an option for a prisoner with no current keyworker', async () => {
        await controller.index(req, res)

        expect(res.render).toHaveBeenCalledWith(
          'viewResidentialLocation',
          expect.objectContaining({
            prisoners: expect.arrayContaining([
              {
                hasHistory: false,
                isHighComplexity: false,
                keyworkerList: [
                  { text: '6 - Ball, Bob', value: '1:ABC789' },
                  { text: '9 - Doe, Julian', value: '2:ABC789' },
                ],
                keyworkerName: null,
                keyworkerStaffId: null,
                location: 'MDI-1-3',
                name: 'Gray, Simon',
                prisonNumber: 'ABC789',
                releaseDate: '28/02/2029',
              },
            ]),
          })
        )
      })
    })
  })

  describe('post', () => {
    beforeEach(() => {
      req.query = { residentialLocation: 'MDI-1' }
    })

    describe('when there are allocations', () => {
      beforeEach(() => {
        req.body = { allocateKeyworker: ['', '1:ABC123', '', '2:ABC456', '', ''] }
      })

      it('should make the expected calls', async () => {
        await controller.post(req, res)

        expect(keyworkerApi.allocate).toHaveBeenCalledTimes(2)
        expect(keyworkerApi.allocate).toHaveBeenCalledWith(res.locals, {
          offenderNo: 'ABC123',
          staffId: '1',
          prisonId: 'MDI',
          allocationType: 'M',
          allocationReason: 'MANUAL',
          deallocationReason: 'OVERRIDE',
        })
        expect(keyworkerApi.allocate).toHaveBeenCalledWith(res.locals, {
          offenderNo: 'ABC456',
          staffId: '2',
          prisonId: 'MDI',
          allocationType: 'M',
          allocationReason: 'MANUAL',
          deallocationReason: 'OVERRIDE',
        })

        expect(res.redirect).toHaveBeenCalledWith(
          '/manage-key-workers/view-residential-location?residentialLocation=MDI-1'
        )
      })

      it('should handle single entries', async () => {
        req.body = { searchText: 'smith', allocateKeyworker: '2:ABC456' }

        await controller.post(req, res)

        expect(keyworkerApi.allocate).toHaveBeenCalledWith(res.locals, {
          offenderNo: 'ABC456',
          staffId: '2',
          prisonId: 'MDI',
          allocationType: 'M',
          allocationReason: 'MANUAL',
          deallocationReason: 'OVERRIDE',
        })
      })
    })

    describe('when there are deallocations', () => {
      beforeEach(() => {
        req.body = { allocateKeyworker: ['3:ABC789:true', '', '', '', '', ''] }
      })

      it('should make the expected calls', async () => {
        await controller.post(req, res)

        expect(keyworkerApi.deallocate).toHaveBeenCalledTimes(1)
        expect(keyworkerApi.deallocate).toHaveBeenCalledWith(res.locals, 'ABC789', {
          offenderNo: 'ABC789',
          staffId: '3',
          prisonId: 'MDI',
          deallocationReason: 'MANUAL',
        })

        expect(res.redirect).toHaveBeenCalledWith(
          '/manage-key-workers/view-residential-location?residentialLocation=MDI-1'
        )
      })
    })
  })
})
