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

    allocationService.searchOffenders = jest.fn().mockResolvedValue(searchOffendersResponse)

    controller = controllerFactory({ allocationService })
  })

  describe('Index', () => {
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
          },
        ],
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
