const config = require('../config')

const keyWorkerTasks = (prisonStatus) => [
  {
    id: 'view-without-key-worker',
    heading: 'View all without a key worker',
    description:
      'You can allocate key workers to these prisoners. You can also automatically allocate a key worker to these prisoners if your establishment allows it.',
    href: '/manage-key-workers/allocate-key-worker',
    roles: null,
    enabled: true,
  },
  {
    id: 'view-residential-location',
    heading: 'View by residential location',
    description:
      'View all prisoners in a residential location and allocate or change key workers. You can also see high complexity prisoners',
    href: '/manage-key-workers/view-residential-location',
    roles: null,
    enabled: true,
  },
  {
    id: 'search-for-prisoner',
    heading: 'Search for a prisoner',
    description:
      'You can allocate or change a key worker after searching for a prisoner. You will need the prisoner`s name or prison number.',
    href: '/manage-key-workers/search-for-prisoner',
    roles: null,
    enabled: true,
  },
  {
    id: 'key-worker-settings',
    heading: 'Key worker settings',
    description: 'Manage a key worker`s availability, re-assign their prisoners and check their individual statistics.',
    href: '/key-worker-search',
    roles: ['OMIC_ADMIN'],
    enabled: prisonStatus.migrated && prisonStatus.autoAllocatedSupported,
  },
  {
    id: 'key-worker-statistics',
    heading: 'Key worker statistics',
    description: 'View the statistics for your establishment`s key workers.',
    href: '/key-worker-statistics',
    roles: null,
    enabled: config?.app?.keyworkerDashboardStatsEnabled && prisonStatus?.migrated,
  },
  {
    id: 'establishment-key-worker-settings',
    heading: 'Manage your establishment`s key worker settings',
    description: 'Allow auto-allocation, edit key worker capacity and session frequency.',
    href: '/manage-key-worker-settings',
    roles: ['KW_MIGRATION'],
    enabled: true,
  },
]

module.exports = ({ keyworkerApi, oauthApi }) => async (req, res) => {
  const { activeCaseLoadId } = req.session?.userDetails || {}

  const [currentRoles, prisonStatus] = await Promise.all([
    oauthApi.currentRoles(res.locals),
    keyworkerApi.getPrisonMigrationStatus(res.locals, activeCaseLoadId),
  ])

  const roleCodes = currentRoles.map((userRole) => userRole.roleCode)

  return res.render('homepage', {
    tasks: keyWorkerTasks(prisonStatus)
      .filter(
        (task) => Boolean(task.roles === null || task.roles.find((role) => roleCodes.includes(role))) && task.enabled
      )
      // eslint-disable-next-line no-unused-vars
      .map(({ roles, enabled, ...task }) => task),
  })
}
