import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Header from '@govuk-react/header'
import Error from '../../Error'
import Spinner from '../../Spinner'
import { Container } from './Page.styles'
import { childrenType } from '../../types'
import Breadcrumb from '../Breadcrumb'
import { resetError } from '../../redux/actions/index'

export class Page extends Component {
  componentDidMount() {
    const { title } = this.props
    this.renderTitleString(title)
  }

  componentWillUpdate(nextProps) {
    this.renderTitleString(nextProps.title)
  }

  componentWillUnmount() {
    const { resetErrorDispatch } = this.props
    resetErrorDispatch()
  }

  renderTitleString = title => {
    document.title = `${title} - Key worker - Digital Prison Services`
  }

  render() {
    const { error, loaded, title, children, alwaysRender, showBreadcrumb } = this.props

    if (loaded || error) {
      return (
        <Fragment>
          {showBreadcrumb && <Breadcrumb />}
          <Container>
            <Header level={1} size="LARGE">
              {title}
            </Header>
            {error && <Error error={error} />}
            {(!error || alwaysRender) && <div className="page-content">{children}</div>}
          </Container>
        </Fragment>
      )
    }

    return <Spinner />
  }
}

Page.propTypes = {
  error: PropTypes.string.isRequired,
  loaded: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  children: childrenType.isRequired,
  alwaysRender: PropTypes.bool,
  showBreadcrumb: PropTypes.bool,
  resetErrorDispatch: PropTypes.func.isRequired,
}

Page.defaultProps = {
  alwaysRender: false,
  showBreadcrumb: true,
}

const mapStateToProps = state => ({
  error: state.app.error,
  loaded: state.app.loaded,
})

const mapDispatchToProps = dispatch => ({
  resetErrorDispatch: () => dispatch(resetError()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Page)
