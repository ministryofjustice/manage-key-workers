import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import withBreadcrumbs from 'react-router-breadcrumbs-hoc'
import links from '../links'
import { BreadcrumbContainer, BreadcrumbList, BreadcrumbListItem } from './Breadcrumb.styles'
import { routeMatchType } from '../types'

// breadcrumbs can be any type of component or string
const UserBreadcrumb = ({ match }) => <span>{match.params.userId}</span> // use match param userId to fetch/display user name

// define some custom breadcrumbs for certain routes (optional)
const routes = [
  { path: '/users/:userId', breadcrumb: UserBreadcrumb },
  { path: '/example', breadcrumb: 'Custom Example' },
  { path: '/', breadcrumb: 'Manage key workers' },
  { path: '/unallocated', breadcrumb: 'Auto-allocate key workers' },
  { path: '/unallocated/provisional-allocation', breadcrumb: 'Suggested key worker allocation' },
  { path: '/keyworker-statistics', breadcrumb: 'Key worker statistics' },
  { path: '/keyworker-search', breadcrumb: 'Search for a key worker' },
  { path: '/keyworker', breadcrumb: null },
  { path: '/keyworker/:staffId', breadcrumb: 'Key worker profile' },
  { path: '/offender-history', breadcrumb: null },
  { path: '/offender-history/:offenderId', breadcrumb: 'Offender key worker allocation history' },
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

UserBreadcrumb.propTypes = {
  match: routeMatchType.isRequired,
}

Breadcrumb.propTypes = {
  breadcrumbs: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: routeMatchType.isRequired,
}

export default withBreadcrumbs(routes)(Breadcrumb)
