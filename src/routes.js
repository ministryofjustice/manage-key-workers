// This needs to be put into a centralised route config that is also used in App.js
// See: https://reacttraining.com/react-router/web/example/route-config

export default [
  { path: '/', breadcrumb: 'Manage key workers' },
  { path: '/unallocated', breadcrumb: 'Auto-allocate key workers' },
  { path: '/unallocated/provisional-allocation', breadcrumb: 'Suggested key worker allocation' },
  { path: '/key-worker-statistics', breadcrumb: 'Key worker statistics' },
  { path: '/key-worker-search', breadcrumb: 'Search for a key worker' },
  { path: '/key-worker', breadcrumb: null },
  { path: '/key-worker/:staffId/confirm-edit', breadcrumb: 'Edit' },
  { path: '/key-worker/:staffId', breadcrumb: 'Key worker profile' },
  { path: '/offender-search', breadcrumb: 'Offender search' },
  { path: '/offender-history', breadcrumb: null },
  { path: '/offender-history/:offenderId', breadcrumb: 'Offender key worker allocation history' },
]
