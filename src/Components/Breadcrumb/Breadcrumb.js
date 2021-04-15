import React from 'react'
import PropTypes from 'prop-types'
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
            Digital Prison Services
          </a>
        </BreadcrumbListItem>
        {breadcrumbs.map(({ match, breadcrumb }, i, arr) => {
          const parentPageLink = arr.length - 1 === i ? 'breadcrumb-parent-page-link' : null
          return (
            <BreadcrumbListItem key={match.url}>
              <a href={match.url} data-qa={parentPageLink}>
                {breadcrumb}
              </a>
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
