// This needs to be put into a centralised route config that is also used in App.js
// See: https://reacttraining.com/react-router/web/example/route-config
import AuthUserBreadcrumb from './Components/Breadcrumb/AuthUserBreadcrumb'

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
  { path: '/admin-utilities', breadcrumb: 'Admin and utilities' },
  { path: '/admin-utilities/maintain-roles', breadcrumb: 'Manage access roles' },
  { path: '/admin-utilities/manage-key-worker-settings', breadcrumb: 'Manage key worker settings' },
  { path: '/admin-utilities/give-nomis-access', breadcrumb: 'Give access to New NOMIS' },
  { path: '/admin-utilities/create-auth-user', breadcrumb: 'Create auth user' },
  { path: '/admin-utilities/maintain-auth-users', breadcrumb: 'Maintain auth users' },
  { path: '/admin-utilities/maintain-auth-users/search-results', breadcrumb: 'Results' },
  { path: '/admin-utilities/maintain-auth-users/:username', breadcrumb: AuthUserBreadcrumb },
  { path: '/admin-utilities/maintain-auth-users/:username/add-role', breadcrumb: 'Add role' },
  { path: '/admin-utilities/maintain-auth-users/:username/add-group', breadcrumb: 'Add group' },
  { path: '/admin-utilities/maintain-roles/:staffId/roles', breadcrumb: 'Current profile roles' },
  { path: '/admin-utilities/maintain-roles/:staffId/roles/add-role', breadcrumb: 'Add role' },
  { path: '/admin-utilities/maintain-roles/search-results', breadcrumb: 'Results' },
  { path: '/admin-utilities/maintain-roles/:staffId', breadcrumb: null },
]
