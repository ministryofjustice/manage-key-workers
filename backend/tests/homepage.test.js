const config = require('../config')
const homepageController = require('../controllers/homepage')

describe('Homepage', () => {
  const oauthApi = {}
  const keyworkerApi = {}

  let req
  let res
  let controller

  beforeEach(() => {
    req = { session: { userDetails: { activeCaseLoadId: 'MDI' } } }
    res = { locals: {}, render: jest.fn(), redirect: jest.fn() }

    oauthApi.currentRoles = jest.fn().mockResolvedValue([])

    keyworkerApi.getPrisonMigrationStatus = jest.fn().mockResolvedValue({ supported: true })

    controller = homepageController({ keyworkerApi, oauthApi })
  })

  it('should make the required calls to endpoints', async () => {
    await controller(req, res)

    expect(oauthApi.currentRoles).toHaveBeenCalledWith({})
    expect(keyworkerApi.getPrisonMigrationStatus).toHaveBeenCalledWith({}, 'MDI')
  })

  describe('Tasks', () => {
    it('should render template with correct non role specfic tasks', async () => {
      await controller(req, res)

      expect(res.render).toHaveBeenCalledWith('homepage', {
        tasks: [
          {
            description:
              'You can allocate key workers to these prisoners. You can also automatically allocate a key worker to these prisoners if your establishment allows it.',
            heading: 'View all without a key worker',
            href: '/manage-key-workers/allocate-key-worker',
            id: 'view-without-key-worker',
          },
          {
            description:
              'View all prisoners in a residential location and allocate or change key workers. You can also see high complexity prisoners',
            heading: 'View by residential location',
            href: '/manage-key-workers/view-residential-location',
            id: 'view-residential-location',
          },
          {
            description:
              'You can allocate or change a key worker after searching for a prisoner. You will need the prisoner’s name or prison number.',
            heading: 'Search for a prisoner',
            href: '/manage-key-workers/search-for-prisoner',
            id: 'search-for-prisoner',
          },
        ],
      })
    })

    it('should render home page with the key worker settings task', async () => {
      oauthApi.currentRoles.mockResolvedValue([{ roleCode: 'OMIC_ADMIN' }])
      keyworkerApi.getPrisonMigrationStatus.mockResolvedValue({
        migrated: true,
        autoAllocatedSupported: true,
        supported: true,
      })

      await controller(req, res)

      expect(res.render).toHaveBeenCalledWith(
        'homepage',
        expect.objectContaining({
          tasks: expect.arrayContaining([
            {
              description:
                'Manage a key worker’s availability, re-assign their prisoners and check their individual statistics.',
              heading: 'Key worker settings',
              href: '/key-worker-search',
              id: 'key-worker-settings',
            },
          ]),
        })
      )
    })

    it('should render home page with the key worker statistics task', async () => {
      config.app.keyworkerDashboardStatsEnabled = true
      keyworkerApi.getPrisonMigrationStatus.mockResolvedValue({ migrated: true, supported: true })

      await controller(req, res)

      expect(res.render).toHaveBeenCalledWith(
        'homepage',
        expect.objectContaining({
          tasks: expect.arrayContaining([
            {
              description: 'View the statistics for your establishment’s key workers.',
              heading: 'Key worker statistics',
              href: '/key-worker-statistics',
              id: 'key-worker-statistics',
            },
          ]),
        })
      )
    })

    it('should redirect to the page not found if the prison is not supported', async () => {
      config.app.keyworkerDashboardStatsEnabled = true
      keyworkerApi.getPrisonMigrationStatus.mockResolvedValue({ supported: false })

      await controller(req, res)

      expect(res.redirect).toHaveBeenCalledWith('/not-found')
    })

    it('should render home page with the establishment key worker settings task', async () => {
      oauthApi.currentRoles.mockResolvedValue([{ roleCode: 'KW_MIGRATION' }])

      await controller(req, res)

      expect(res.render).toHaveBeenCalledWith(
        'homepage',
        expect.objectContaining({
          tasks: expect.arrayContaining([
            {
              description: 'Allow auto-allocation, edit key worker capacity and session frequency.',
              heading: 'Manage your establishment’s key worker settings',
              href: '/manage-key-worker-settings',
              id: 'establishment-key-worker-settings',
            },
          ]),
        })
      )
    })
  })
})
