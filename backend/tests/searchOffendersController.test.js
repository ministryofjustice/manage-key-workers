const controllerFactory = require('../controllers/searchOffendersController')

const searchTextError = {
  href: '#search-text',
  html: 'Please enter the prisoner&#39;s name or number',
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
      staffId: null,
      keyworkerDisplay: '--',
      numberAllocated: 'n/a',
      crsaClassification: 'High',
      confirmedReleaseDate: '2012-04-30',
    },
  ],
  partialResults: false,
}

describe('Search offenders controller', () => {
  let controller
  let req
  let res
  const allocationService = {}
  const complexityOfNeedApi = {}

  beforeEach(() => {
    req = {
      flash: jest.fn(),
      session: {
        userDetails: {
          activeCaseLoadId: 'MDI',
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
    controller = controllerFactory({ allocationService, complexityOfNeedApi })
  })

  describe('Index', () => {
    it('should call next if the user details are not available', async () => {
      const next = jest.fn()

      req.session = null

      await controller.index(req, res, next)

      expect(next).toHaveBeenCalled()
    })

    it('should render the view with empty data sets then there is no data', async () => {
      req.query = {
        searchText: 'Smith',
      }
      allocationService.searchOffenders = jest.fn().mockResolvedValue({})
      await controller.index(req, res)

      expect(res.render).toHaveBeenCalledWith('offenderSearch.njk', {
        keyworkersDropdownValues: [],
        offenders: [],
        errors: undefined,
      })
    })

    it('should not make a call to the complexity api when no offenders are returned', async () => {
      allocationService.searchOffenders = jest.fn().mockResolvedValue({})
      await controller.index(req, res)

      expect(complexityOfNeedApi.getComplexOffenders).not.toBeCalled()
    })

    it('should render the correct template', async () => {
      await controller.index(req, res)
      expect(res.render).toHaveBeenCalledWith('offenderSearch.njk', {})
    })

    it('should unpack errors and pass them through to the view', async () => {
      req.flash.mockImplementation(() => [searchTextError])

      await controller.index(req, res)

      expect(res.render).toHaveBeenCalledWith('offenderSearch.njk', {
        errors: [searchTextError],
      })
    })

    it('should make a request to search offenders passing the correct parameters', async () => {
      req.query = {
        searchText: 'Smith',
      }

      await controller.index(req, res)

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

      await controller.index(req, res)

      expect(res.render).toHaveBeenCalledWith('offenderSearch.njk', {
        keyworkersDropdownValues: [
          {
            text: 'Ball, Bob (6)',
            value: 34353,
          },
          {
            text: 'Doe, Julian (6)',
            value: 485593,
          },
        ],
        offenders: [
          {
            keyworker: 'Not allocated',
            location: 'CSWAP',
            name: 'Alff, Ferinand',
            prisonNumber: 'G0276VC',
            releaseDate: '2012-04-30',
            highComplexityOfNeed: false,
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
        await controller.index(req, res)

        expect(complexityOfNeedApi.getComplexOffenders).toHaveBeenCalledWith({}, ['G0276VC'])
      })

      it('should mark offenders with high complexity of need', async () => {
        req.query = {
          searchText: 'G0276VC',
        }
        await controller.index(req, res)

        expect(res.render).toHaveBeenCalledWith(
          'offenderSearch.njk',
          expect.objectContaining({
            offenders: [
              {
                keyworker: 'Not allocated',
                location: 'CSWAP',
                name: 'Alff, Ferinand',
                prisonNumber: 'G0276VC',
                releaseDate: '2012-04-30',
                highComplexityOfNeed: true,
              },
            ],
          })
        )
      })
    })
  })

  describe('Post', () => {
    it('should respond with validation messages when the search text is null', async () => {
      await controller.post(req, res)
      expect(req.flash).toBeCalledWith('errors', [searchTextError])
      expect(res.redirect).toHaveBeenCalledWith('/manage-key-workers/search-for-prisoner')
    })
    it('should redirect to index with the search text', async () => {
      req.body = {
        searchText: 'A123456',
      }
      await controller.post(req, res)
      expect(res.redirect).toHaveBeenCalledWith('/manage-key-workers/search-for-prisoner?searchText=A123456')
    })
  })
})
