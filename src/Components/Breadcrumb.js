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
  { path: '/keyworkerDashboard', breadcrumb: 'Key worker statistics' },
]

const Breadcrumb = ({ breadcrumbs, match }) => (
  <BreadcrumbContainer>
    <BreadcrumbList>
      <BreadcrumbListItem>
        <a href={links.getHomeLink()}>Home</a>
      </BreadcrumbListItem>
      {breadcrumbs.map(breadcrumb => (
        <BreadcrumbListItem key={breadcrumb.key}>
          {match.url !== breadcrumb.props.match.url && <Link to={breadcrumb.props.match.url}>{breadcrumb}</Link>}
          {match.url === breadcrumb.props.match.url && breadcrumb}
        </BreadcrumbListItem>
      ))}
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
