// This needs to be put into a centralised route config that is also used in App.js
// See: https://reacttraining.com/react-router/web/example/route-config

export default [
  { path: '/', breadcrumb: null },
  { path: '/manage-key-workers', breadcrumb: 'Manage key workers' },
  { path: '/manage-key-workers/unallocated', breadcrumb: 'Auto-allocate key workers' },
  { path: '/manage-key-workers/unallocated/provisional-allocation', breadcrumb: 'Suggested key worker allocation' },
  { path: '/manage-key-workers/key-worker-statistics', breadcrumb: 'Key worker statistics' },
  { path: '/manage-key-workers/key-worker-search', breadcrumb: 'Search for a key worker' },
  { path: '/manage-key-workers/key-worker', breadcrumb: null },
  { path: '/manage-key-workers/key-worker/:staffId/confirm-edit', breadcrumb: 'Edit' },
  { path: '/manage-key-workers/key-worker/:staffId', breadcrumb: 'Key worker profile' },
  { path: '/manage-key-workers/offender-search', breadcrumb: 'Offender search' },
  { path: '/manage-key-workers/offender-history', breadcrumb: null },
  { path: '/manage-key-workers/offender-history/:offenderId', breadcrumb: 'Offender key worker allocation history' },
  { path: '/manage-key-workers/manage-key-worker-settings', breadcrumb: 'Manage key worker settings' },
]
