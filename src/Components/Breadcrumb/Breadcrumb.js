import React from 'react'
import withBreadcrumbs from 'react-router-breadcrumbs-hoc'
import links from '../../links'
import { BreadcrumbContainer, BreadcrumbList, BreadcrumbListItem } from './Breadcrumb.styles'
import routes from '../../routes'

export const Breadcrumb = () => (
  <BreadcrumbContainer>
    <BreadcrumbList>
      <BreadcrumbListItem>
        <a data-qa="breadcrumb-home-page-link" href={links.getHomeLink()}>
          Digital Prison Services
        </a>
      </BreadcrumbListItem>
      <BreadcrumbListItem>
        <a data-qa="breadcrumb-key-workers-link" href="/">
          Key workers
        </a>
      </BreadcrumbListItem>
    </BreadcrumbList>
  </BreadcrumbContainer>
)

export default withBreadcrumbs(routes)(Breadcrumb)
