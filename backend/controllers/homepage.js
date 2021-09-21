const config = require('../config')

const keyWorkerTasks = (prisonStatus, complexityEnabledPrisons, activeCaseLoadId) => [
  {
    id: 'view-without-key-worker',
    heading: 'View all without a key worker',
    description:
      'You can allocate key workers to these prisoners. You can also automatically allocate a key worker to these prisoners if your establishment allows it.',
    href: '/manage-key-workers/allocate-key-worker',
    roles: null,
    enabled: prisonStatus?.migrated,
  },
  {
    id: 'view-residential-location',
    heading: 'View by residential location',
    description:
      'View all prisoners in a residential location and allocate or change key workers. You can also see high complexity prisoners',
    href: '/manage-key-workers/view-residential-location',
    roles: null,
    enabled: prisonStatus?.migrated && complexityEnabledPrisons.includes(activeCaseLoadId),
  },
  {
    id: 'view-residential-location',
    heading: 'View by residential location',
    description: 'View all prisoners in a residential location and allocate or change key workers.',
    href: '/manage-key-workers/view-residential-location',
    roles: null,
    enabled: prisonStatus?.migrated && !complexityEnabledPrisons.includes(activeCaseLoadId),
  },
  {
    id: 'search-for-prisoner',
    heading: 'Search for a prisoner',
    description:
      'You can allocate or change a key worker after searching for a prisoner. You will need the prisoner’s name or prison number.',
    href: '/manage-key-workers/search-for-prisoner',
    roles: null,
    enabled: prisonStatus?.migrated,
  },
  {
    id: 'key-worker-settings',
    heading: 'View key workers in your establishment',
    description: ({ roles }) =>
      roles.includes('OMIC_ADMIN')
        ? 'You can manage a key worker’s availability, reassign their prisoners and check their individual statistics.'
        : 'You can view a key worker’s availability and check their individual statistics.',
    href: '/key-worker-search',
    roles: ['OMIC_ADMIN', 'KEYWORKER_MONITOR'],
    enabled: prisonStatus?.migrated,
  },
  {
    id: 'key-worker-statistics',
    heading: 'Key worker statistics',
    description: 'View the statistics for your establishment’s key workers.',
    href: '/key-worker-statistics',
    roles: null,
    enabled: config?.app?.keyworkerDashboardStatsEnabled && prisonStatus?.migrated,
  },
  {
    id: 'establishment-key-worker-settings',
    heading: 'Manage your establishment’s key worker settings',
    description: 'Allow auto-allocation, edit key worker capacity and session frequency.',
    href: '/manage-key-worker-settings',
    roles: ['KW_MIGRATION'],
    enabled: true,
  },
]

const hasAnyRole = (task, userRoles) => {
  const acceptedRoles = task.roles
  if (!task.enabled) {
    return false
  }
  return !acceptedRoles || acceptedRoles.some((role) => userRoles.includes(role))
}

const processTask = (task, userRoles) => {
  if (typeof task.description === 'function') {
    return {
      ...task,
      description: task.description({ roles: userRoles }),
    }
  }

  return task
}

module.exports =
  ({ keyworkerApi, oauthApi }) =>
  async (req, res) => {
    const { activeCaseLoadId } = req.session?.userDetails || {}

    const [currentRoles, prisonStatus] = await Promise.all([
      oauthApi.currentRoles(res.locals),
      keyworkerApi.getPrisonMigrationStatus(res.locals, activeCaseLoadId),
    ])

    const roleCodes = currentRoles.map((userRole) => userRole.roleCode)

    const availableTasks = keyWorkerTasks(
      prisonStatus,
      config?.apis?.complexity?.enabled_prisons || [],
      activeCaseLoadId
    )
      .filter((task) => hasAnyRole(task, roleCodes))
      .map((task) => processTask(task, roleCodes))

    if (!availableTasks.length) return res.redirect('/not-found')

    return res.render('homepage', {
      tasks: availableTasks
        // eslint-disable-next-line no-unused-vars
        .map(({ roles, enabled, ...task }) => task),
    })
  }
