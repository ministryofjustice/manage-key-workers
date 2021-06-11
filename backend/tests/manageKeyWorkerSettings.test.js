const manageKeyWorkerSettings = require('../controllers/manageKeyWorkerSettings')

describe('Manage key worker settings', () => {
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
    }
    res = {
      locals: {},
      render: jest.fn(),
      redirect: jest.fn(),
    }

    keyworkerApi.getPrisonMigrationStatus = jest.fn().mockResolvedValue({
      prisonId: 'MDI',
      supported: true,
      migrated: true,
      autoAllocatedSupported: true,
      capacityTier1: 5,
      capacityTier2: 10,
      kwSessionFrequencyInWeeks: 4,
      migratedDateTime: '2018-06-25T13:01:35.996',
    })
    keyworkerApi.enableAutoAllocationAndMigrate = jest.fn()
    keyworkerApi.enableManualAllocationAndMigrate = jest.fn()

    controller = manageKeyWorkerSettings({ keyworkerApi })
  })

  describe('index', () => {
    it('should render with the correct information', async () => {
      await controller.index(req, res)

      expect(keyworkerApi.getPrisonMigrationStatus).toHaveBeenCalledWith(res.locals, 'MDI')
      expect(res.render).toHaveBeenCalledWith('manageKeyWorkerSettings', {
        errors: [],
        formValues: {
          allowAuto: 'yes',
          extendedCapacity: '10',
          frequency: 4,
          standardCapacity: '5',
        },
      })
    })
  })

  describe('post', () => {
    describe('when standard capacity input value is greater than extended capacity', () => {
      beforeEach(() => {
        req.body = {
          allowAuto: 'no',
          extendedCapacity: '3',
          frequency: 2,
          standardCapacity: '4',
        }
      })

      it('should render with errors and maintain all inputted form values', async () => {
        await controller.post(req, res)

        expect(keyworkerApi.getPrisonMigrationStatus).toHaveBeenCalledWith(res.locals, 'MDI')
        expect(res.render).toHaveBeenCalledWith('manageKeyWorkerSettings', {
          errors: [
            {
              href: '#extendedCapacity',
              text: 'Capacity Tier 2 must be equal to or greater than Capacity Tier 1',
            },
          ],
          formValues: {
            allowAuto: 'no',
            extendedCapacity: '3',
            frequency: 2,
            standardCapacity: '4',
          },
        })
      })
    })

    describe('when allow auto allocation is selected', () => {
      beforeEach(() => {
        req.body = {
          allowAuto: 'yes',
          extendedCapacity: '5',
          frequency: 4,
          standardCapacity: '3',
        }
      })

      it('should render with errors and maintain all inputted form values', async () => {
        await controller.post(req, res)

        expect(keyworkerApi.getPrisonMigrationStatus).toHaveBeenCalledWith(res.locals, 'MDI')
        expect(keyworkerApi.enableAutoAllocationAndMigrate).toHaveBeenCalledWith(res.locals, 'MDI', false, '3,5', 4)
        expect(keyworkerApi.enableManualAllocationAndMigrate).not.toHaveBeenCalled()
        expect(res.redirect).toHaveBeenCalledWith('/')
      })
    })

    describe('when allow auto allocation is not selected', () => {
      beforeEach(() => {
        req.body = {
          allowAuto: 'no',
          extendedCapacity: '5',
          frequency: 4,
          standardCapacity: '3',
        }
      })

      it('should render with errors and maintain all inputted form values', async () => {
        await controller.post(req, res)

        expect(keyworkerApi.getPrisonMigrationStatus).toHaveBeenCalledWith(res.locals, 'MDI')
        expect(keyworkerApi.enableAutoAllocationAndMigrate).not.toHaveBeenCalled()
        expect(keyworkerApi.enableManualAllocationAndMigrate).toHaveBeenCalledWith(res.locals, 'MDI', false, '3,5', 4)
        expect(res.redirect).toHaveBeenCalledWith('/')
      })
    })
  })
})
