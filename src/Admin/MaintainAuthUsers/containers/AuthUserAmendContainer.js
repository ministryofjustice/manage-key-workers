import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactRouterPropTypes from 'react-router-prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import axios from 'axios'
import { handleAxiosError, resetError, setError, setMessage } from '../../../redux/actions/index'
import AuthUserAmend from '../components/AuthUserAmend'
import Page from '../../../Components/Page'
import { validateAmend } from './AuthUserValidation'
import { contextAuthUserType, errorType, routeMatchType } from '../../../types'
import { loadAuthUserRolesAndGroups } from '../../../redux/actions/maintainAuthUserActions'

class AuthUserAmendContainer extends Component {
  constructor(props) {
    super()
    props.resetErrorDispatch()
    this.state = {}
  }

  async componentDidMount() {
    const { loadAuthUserAndRolesDispatch, match } = this.props

    loadAuthUserAndRolesDispatch(match.params.username)
  }

  handleChange = event => {
    const { name, value } = event.target
    this.setState({ [name]: value })
  }

  handleAmend = async event => {
    const { history, setErrorDispatch, resetErrorDispatch, handleAxiosErrorDispatch, setMessageDispatch } = this.props
    const {
      contextUser: { username },
    } = this.props

    event.preventDefault()

    const errors = validateAmend(this.state)
    if (errors.length) {
      setErrorDispatch(errors)
      return
    }

    try {
      await axios.post('/api/auth-user-amend', this.state, {
        params: { username },
      })
      resetErrorDispatch()
      setMessageDispatch(`User email amended`)
      history.push(`/admin-utilities/maintain-auth-users/${username}`)
    } catch (error) {
      handleAxiosErrorDispatch(error)
    }
  }

  handleCancel = e => {
    const { history } = this.props
    e.preventDefault()
    // Return to previous page in history. There can be multiple origin pages.
    history.goBack()
  }

  render() {
    const {
      contextUser: { firstName, lastName, email },
      error,
    } = this.props

    if (!firstName && !lastName) {
      return (
        <Page title="not found auth user:" alwaysRender>
          <div>User not found</div>
        </Page>
      )
    }

    return (
      <Page title={`Amend auth user: ${firstName} ${lastName}`} alwaysRender>
        <AuthUserAmend
          email={email}
          handleAmend={this.handleAmend}
          handleChange={this.handleChange}
          handleCancel={this.handleCancel}
          error={error}
        />
      </Page>
    )
  }
}

AuthUserAmendContainer.propTypes = {
  resetErrorDispatch: PropTypes.func.isRequired,
  setErrorDispatch: PropTypes.func.isRequired,
  handleAxiosErrorDispatch: PropTypes.func.isRequired,
  loadAuthUserAndRolesDispatch: PropTypes.func.isRequired,
  setMessageDispatch: PropTypes.func.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  error: errorType.isRequired,
  match: routeMatchType.isRequired,
  contextUser: contextAuthUserType,
}

AuthUserAmendContainer.defaultProps = {
  contextUser: {},
}

const mapDispatchToProps = dispatch => ({
  resetErrorDispatch: () => dispatch(resetError()),
  setErrorDispatch: error => dispatch(setError(error)),
  handleAxiosErrorDispatch: error => dispatch(handleAxiosError(error)),
  loadAuthUserAndRolesDispatch: username => dispatch(loadAuthUserRolesAndGroups(username)),
  setMessageDispatch: message => dispatch(setMessage(message)),
})

const mapStateToProps = state => ({
  contextUser: state.maintainAuthUsers.contextUser,
  error: state.app.error,
})

export { AuthUserAmendContainer }

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AuthUserAmendContainer)
)
