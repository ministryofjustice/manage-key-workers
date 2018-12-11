import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Header from '@govuk-react/header'
import Error from '../Error'
import Spinner from '../Spinner'
import { Container, Breadcrumbs } from './Page.styles'
import { childrenType } from '../types'
// import BreadcrumbTrail from '../BreadcrumbTrail'
import Breadcrumb from './Breadcrumb'

const Page = ({ error, loaded, title, children }) => {
  if (error) return <Error error={error} />

  if (loaded) {
    return (
      <Fragment>
        <Breadcrumb />
        <Container>
          <Header level={1} size="LARGE">
            {title}
          </Header>
          <div>{children}</div>
        </Container>
      </Fragment>
    )
  }

  return <Spinner />
}

Page.propTypes = {
  error: PropTypes.string.isRequired,
  loaded: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  children: childrenType.isRequired,
}

const mapStateToProps = state => ({
  error: state.app.error,
  loaded: state.app.loaded,
})

export default connect(mapStateToProps)(Page)
