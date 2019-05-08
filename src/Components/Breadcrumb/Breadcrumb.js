import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import withBreadcrumbs from 'react-router-breadcrumbs-hoc'
import links from '../../links'
import { BreadcrumbContainer, BreadcrumbList, BreadcrumbListItem } from './Breadcrumb.styles'
import routes from '../../routes'

export const Breadcrumb = ({ breadcrumbs }) => {
  // Pick (pop) the last breadcrumd from the array (also removes it from the array)
  const { breadcrumb: poppedBreadcrumb } = breadcrumbs.length > 0 ? breadcrumbs.pop() : breadcrumbs

  return (
    <BreadcrumbContainer>
      <BreadcrumbList>
        <BreadcrumbListItem>
          <a data-qa="breadcrumb-home-page-link" href={links.getHomeLink()}>
            Home
          </a>
        </BreadcrumbListItem>
        {breadcrumbs.map(({ match, breadcrumb }, i, arr) => {
          const parentPageLink = arr.length - 1 === i ? 'breadcrumb-parent-page-link' : null
          return (
            <BreadcrumbListItem key={match.url}>
              <Link to={match.url} data-qa={parentPageLink}>
                {breadcrumb}
              </Link>
            </BreadcrumbListItem>
          )
        })}
        <BreadcrumbListItem>{poppedBreadcrumb}</BreadcrumbListItem>
      </BreadcrumbList>
    </BreadcrumbContainer>
  )
}

Breadcrumb.propTypes = {
  breadcrumbs: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default withBreadcrumbs(routes)(Breadcrumb)
