import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import withBreadcrumbs from 'react-router-breadcrumbs-hoc'
import links from '../links'
import { BreadcrumbContainer, BreadcrumbList, BreadcrumbListItem } from './Breadcrumb.styles'
import { routeMatchType } from '../types'

// This needs to be put into a centralised route config that is also used in App.js
// See: https://reacttraining.com/react-router/web/example/route-config
const routes = [
  { path: '/', breadcrumb: 'Manage key workers' },
  { path: '/unallocated', breadcrumb: 'Auto-allocate key workers' },
  { path: '/unallocated/provisional-allocation', breadcrumb: 'Suggested key worker allocation' },
  { path: '/key-worker-statistics', breadcrumb: 'Key worker statistics' },
  { path: '/key-worker-search', breadcrumb: 'Search for a key worker' },
  { path: '/key-worker', breadcrumb: null },
  { path: '/key-worker/:staffId/confirm-edit', breadcrumb: 'Edit' },
  { path: '/key-worker/:staffId', breadcrumb: 'Key worker profile' },
  { path: '/offender-history', breadcrumb: null },
  { path: '/offender-history/:offenderId', breadcrumb: 'Offender key worker allocation history' },
  { path: '/give-nomis-access', breadcrumb: 'Give access to New NOMIS' },
  { path: '/maintain-roles/:staffId/roles', breadcrumb: 'Current profile roles' },
  { path: '/maintain-roles/search-results', breadcrumb: 'Results' },
  { path: '/maintain-roles/:staffId', breadcrumb: null },
]

const Breadcrumb = ({ breadcrumbs, match }) => (
  <BreadcrumbContainer>
    <BreadcrumbList>
      <BreadcrumbListItem>
        <a data-qa="breadcrumb-home-page-link" href={links.getHomeLink()}>
          Home
        </a>
      </BreadcrumbListItem>
      {breadcrumbs.map((breadcrumb, i, arr) => {
        const parentPageLink = arr.length - 2 === i ? 'breadcrumb-parent-page-link' : null
        return (
          <BreadcrumbListItem key={breadcrumb.key}>
            {match.url !== breadcrumb.props.match.url && (
              <Link to={breadcrumb.props.match.url} data-qa={parentPageLink}>
                {breadcrumb}
              </Link>
            )}
            {match.url === breadcrumb.props.match.url && breadcrumb}
          </BreadcrumbListItem>
        )
      })}
    </BreadcrumbList>
  </BreadcrumbContainer>
)

Breadcrumb.propTypes = {
  breadcrumbs: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: routeMatchType.isRequired,
}

export default withBreadcrumbs(routes)(Breadcrumb)
