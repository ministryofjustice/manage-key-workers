import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { H1 } from '@govuk-react/heading'
import ErrorSummary from '@govuk-react/error-summary'
import Error from '../../Error'
import Spinner from '../../Spinner'
import { Container } from './Page.styles'
import { childrenType, errorType } from '../../types'
import Breadcrumb from '../Breadcrumb'
import { resetError } from '../../redux/actions/index'
import { onHandleErrorClick } from '../../govuk-helpers'

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
            {error &&
              ((typeof error === 'string' && <Error error={error} />) || (
                <ErrorSummary
                  id="error-summary"
                  heading="There is a problem"
                  errors={error}
                  onHandleErrorClick={onHandleErrorClick}
                />
              ))}
            <H1 size={36}>{title}</H1>
            {(!error || alwaysRender) && <div className="page-content">{children}</div>}
          </Container>
        </Fragment>
      )
    }

    return <Spinner />
  }
}

Page.propTypes = {
  error: errorType.isRequired,
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
