const config = require('../config')
const controllerFactory = require('../controllers/searchOffendersController')

const searchTextError = {
  href: '#search-text',
  html: 'Enter a prisoner&#39;s name or number',
}

const searchOffendersResponse = {
  keyworkerResponse: [
    {
      staffId: 34353,
      firstName: 'BOB',
      lastName: 'BALL',
      capacity: 6,
      numberAllocated: 6,
      agencyId: 'MDI',
      status: 'ACTIVE',
      autoAllocationAllowed: true,
    },
    {
      staffId: 485593,
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
      bookingId: 1146219,
      bookingNo: 'W97053',
      offenderNo: 'G0276VC',
      firstName: 'FERINAND',
      middleName: 'ANTHOINE',
      lastName: 'ALFF',
      dateOfBirth: '1982-04-06',
      age: 38,
      agencyId: 'MDI',
      assignedLivingUnitId: 722023,
      assignedLivingUnitDesc: 'CSWAP',
      facialImageId: 3759710,
      convictedStatus: 'Convicted',
      imprisonmentStatus: 'ADIMP_ORA',
      alertsCodes: [],
      alertsDetails: [],
      legalStatus: 'SENTENCED',
      staffId: 1,
      keyworkerDisplay: 'First last',
      numberAllocated: 'n/a',
      crsaClassification: 'High',
      confirmedReleaseDate: '2012-04-30',
    },
  ],
  partialResults: false,
}

const allocationHistoryResponse = [
  {
    offenderNo: 'G0276VC',
    hasHistory: false,
  },
]

describe('Search offenders controller', () => {
  let controller
  let req
  let res
  const allocationService = {}
  const complexityOfNeedApi = {}
  const keyworkerApi = {}
  const systemOauthClient = {}

  beforeEach(() => {
    req = {
      flash: jest.fn(),
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

    complexityOfNeedApi.getComplexOffenders = jest.fn().mockResolvedValue([])
    allocationService.searchOffenders = jest.fn().mockResolvedValue(searchOffendersResponse)
    keyworkerApi.deallocate = jest.fn()
    keyworkerApi.allocate = jest.fn()
    keyworkerApi.allocationHistorySummary = jest.fn().mockResolvedValue(allocationHistoryResponse)
    systemOauthClient.getClientCredentialsTokens = jest.fn()

    controller = controllerFactory({ allocationService, complexityOfNeedApi, keyworkerApi, systemOauthClient })
    config.apis.complexity.enabled_prisons = ['MDI']
  })

  describe('Search offenders', () => {
    it('should render the view with empty data sets then there is no data', async () => {
      req.query = {
        searchText: 'Smith',
      }
      allocationService.searchOffenders = jest.fn().mockResolvedValue({})
      await controller.searchOffenders(req, res)

      expect(res.render).toHaveBeenCalledWith('offenderSearch.njk', {
        keyworkersDropdownValues: [],
        offenders: [],
        errors: undefined,
        formValues: {
          searchText: 'Smith',
        },
      })
    })

    it('should not make a call to the complexity api when no offenders are returned', async () => {
      allocationService.searchOffenders = jest.fn().mockResolvedValue({})
      await controller.searchOffenders(req, res)

      expect(complexityOfNeedApi.getComplexOffenders).not.toBeCalled()
    })

    it('should render the correct template', async () => {
      await controller.searchOffenders(req, res)
      expect(res.render).toHaveBeenCalledWith('offenderSearch.njk', {
        errors: undefined,
      })
    })

    it('should unpack errors and pass them through to the view', async () => {
      req.flash.mockImplementation(() => [searchTextError])

      await controller.searchOffenders(req, res)

      expect(res.render).toHaveBeenCalledWith('offenderSearch.njk', {
        errors: [searchTextError],
      })
    })

    it('should make a request to search offenders passing the correct parameters', async () => {
      req.query = {
        searchText: 'Smith',
      }

      await controller.searchOffenders(req, res)

      expect(allocationService.searchOffenders).toHaveBeenCalledWith(
        {},
        {
          agencyId: 'MDI',
          keywords: 'Smith',
          locationPrefix: 'MDI',
        }
      )
    })

    it('should map offenders into a data structure the gov table can consume', async () => {
      req.query = {
        searchText: 'Smith',
      }

      await controller.searchOffenders(req, res)

      expect(res.render).toHaveBeenCalledWith('offenderSearch.njk', {
        formValues: {
          searchText: 'Smith',
        },
        prisoners: [
          {
            hasHistory: false,
            isHighComplexity: false,
            keyworkerList: [
              {
                text: 'Deallocate',
                value: '1:G0276VC:true',
              },
              {
                text: 'Bob Ball (6)',
                value: '34353:G0276VC',
              },
              {
                text: 'Julian Doe (9)',
                value: '485593:G0276VC',
              },
            ],
            keyworkerName: 'First last (n/a)',
            keyworkerStaffId: 1,
            location: 'CSWAP',
            name: 'Alff, Ferinand',
            prisonNumber: 'G0276VC',
            releaseDate: '30/04/2012',
          },
        ],
      })
    })

    describe('Complex offenders', () => {
      beforeEach(() => {
        complexityOfNeedApi.getComplexOffenders = jest.fn().mockResolvedValue([
          {
            offenderNo: 'G0276VC',
            level: 'high',
          },
        ])
      })

      it('should make a call to get the complexity of needs information', async () => {
        req.query = {
          searchText: 'G0276VC',
        }
        await controller.searchOffenders(req, res)

        expect(complexityOfNeedApi.getComplexOffenders).toHaveBeenCalledWith(undefined, ['G0276VC'])
      })

      it('should only check for complex offenders when the feature is enabled', async () => {
        config.apis.complexity.enabled_prisons = ['LEI']

        req.query = {
          searchText: 'G0276VC',
        }
        await controller.searchOffenders(req, res)

        expect(complexityOfNeedApi.getComplexOffenders).not.toHaveBeenCalled()
      })

      it('should mark offenders with high complexity of need', async () => {
        req.query = {
          searchText: 'G0276VC',
        }
        await controller.searchOffenders(req, res)

        expect(res.render).toHaveBeenCalledWith(
          'offenderSearch.njk',
          expect.objectContaining({
            formValues: { searchText: 'G0276VC' },
            prisoners: [
              {
                hasHistory: false,
                isHighComplexity: true,
                keyworkerList: false,
                keyworkerName: 'First last (n/a)',
                keyworkerStaffId: 1,
                location: 'CSWAP',
                name: 'Alff, Ferinand',
                prisonNumber: 'G0276VC',
                releaseDate: '30/04/2012',
              },
            ],
          })
        )
      })

      it('should use client credentials when making request to the complexity api', async () => {
        const offenderNo = 'G0276VC'
        const systemContext = { client_creds: true }

        complexityOfNeedApi.getComplexOffenders = jest.fn().mockResolvedValue([{ offenderNo, level: 'high' }])
        systemOauthClient.getClientCredentialsTokens = jest.fn().mockResolvedValue(systemContext)

        req.query = { searchText: offenderNo }

        await controller.searchOffenders(req, res)

        expect(systemOauthClient.getClientCredentialsTokens).toHaveBeenCalledWith('user123')
        expect(complexityOfNeedApi.getComplexOffenders).toHaveBeenCalledWith(systemContext, [offenderNo])
      })
    })
  })

  describe('Validate search text', () => {
    it('should respond with validation messages when the search text is null', async () => {
      await controller.validateSearchText(req, res)
      expect(req.flash).toBeCalledWith('errors', [searchTextError])
      expect(res.redirect).toHaveBeenCalledWith('/manage-key-workers/search-for-prisoner')
    })
    it('should redirect to index with the search text', async () => {
      req.body = {
        searchText: 'A123456',
      }
      await controller.validateSearchText(req, res)
      expect(res.redirect).toHaveBeenCalledWith('/manage-key-workers/search-for-prisoner?searchText=A123456')
    })
  })

  describe('When the offender has an allocation history', () => {
    beforeEach(() => {
      const allocationHistory = [
        {
          offenderNo: 'G0276VC',
          hasHistory: true,
        },
      ]
      keyworkerApi.allocationHistorySummary = jest.fn().mockResolvedValue(allocationHistory)
    })

    it('should show the history link', async () => {
      req.query = {
        searchText: 'G0276VC',
      }
      await controller.searchOffenders(req, res)

      expect(res.render).toHaveBeenCalledWith(
        'offenderSearch.njk',
        expect.objectContaining({
          formValues: { searchText: 'G0276VC' },
          prisoners: [
            {
              hasHistory: true,
              isHighComplexity: false,
              keyworkerList: [
                {
                  text: 'Deallocate',
                  value: '1:G0276VC:true',
                },
                {
                  text: 'Bob Ball (6)',
                  value: '34353:G0276VC',
                },
                {
                  text: 'Julian Doe (9)',
                  value: '485593:G0276VC',
                },
              ],
              keyworkerName: 'First last (n/a)',
              keyworkerStaffId: 1,
              location: 'CSWAP',
              name: 'Alff, Ferinand',
              prisonNumber: 'G0276VC',
              releaseDate: '30/04/2012',
            },
          ],
        })
      )
    })
  })

  describe('Save', () => {
    describe('when there are allocations', () => {
      beforeEach(() => {
        req.body = { searchText: 'smith', allocateKeyworker: ['', '1:ABC123', '', '2:ABC456', '', ''] }
      })

      it('should make the expected calls', async () => {
        await controller.save(req, res)

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

        expect(res.redirect).toHaveBeenCalledWith('/manage-key-workers/search-for-prisoner?searchText=smith')
      })

      it('should handle single entries', async () => {
        req.body = { searchText: 'smith', allocateKeyworker: '2:ABC456' }

        await controller.save(req, res)

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
        req.body = { searchText: 'smith', allocateKeyworker: ['3:ABC789:true', '', '', '', '', ''] }
      })

      it('should make the expected calls', async () => {
        await controller.save(req, res)

        expect(keyworkerApi.deallocate).toHaveBeenCalledTimes(1)
        expect(keyworkerApi.deallocate).toHaveBeenCalledWith(res.locals, 'ABC789', {
          offenderNo: 'ABC789',
          staffId: '3',
          prisonId: 'MDI',
          deallocationReason: 'MANUAL',
        })

        expect(res.redirect).toHaveBeenCalledWith('/manage-key-workers/search-for-prisoner?searchText=smith')
      })
    })
  })
})
