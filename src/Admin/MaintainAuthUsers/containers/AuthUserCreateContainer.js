import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactRouterPropTypes from 'react-router-prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import axios from 'axios'
import { handleAxiosError, resetError, setError, setLoaded } from '../../../redux/actions/index'
import AuthUserCreate from '../components/AuthUserCreate'
import Page from '../../../Components/Page'
import { validateCreate } from './AuthUserValidation'
import { errorType } from '../../../types'

class AuthUserCreateContainer extends Component {
  constructor(props) {
    super(props)
    props.resetErrorDispatch()
    this.state = {}
  }

  async componentDidMount() {
    const { dispatchLoaded } = this.props
    dispatchLoaded(true)
  }

  handleChange = event => {
    const { name, value } = event.target
    this.setState({ [name]: value })
  }

  handleCreate = async event => {
    const { history, setErrorDispatch, resetErrorDispatch, handleAxiosErrorDispatch } = this.props
    const { username } = this.state

    event.preventDefault()

    if (!validateCreate(this.state, setErrorDispatch)) {
      return
    }

    try {
      await axios.post(
        '/api/auth-user-create',
        {
          ...this.state,
        },
        {
          params: { username },
        }
      )
      resetErrorDispatch()
      history.push(`/admin-utilities/maintain-auth-users/${username}`)
    } catch (error) {
      handleAxiosErrorDispatch(error)
    }
  }

  render() {
    const { error } = this.props
    return (
      <Page title="Create auth user" alwaysRender>
        <AuthUserCreate handleCreate={this.handleCreate} handleChange={this.handleChange} error={error} />
      </Page>
    )
  }
}

AuthUserCreateContainer.propTypes = {
  resetErrorDispatch: PropTypes.func.isRequired,
  setErrorDispatch: PropTypes.func.isRequired,
  handleAxiosErrorDispatch: PropTypes.func.isRequired,
  dispatchLoaded: PropTypes.func.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  error: errorType.isRequired,
}

const mapDispatchToProps = dispatch => ({
  resetErrorDispatch: () => dispatch(resetError()),
  setErrorDispatch: error => dispatch(setError(error)),
  handleAxiosErrorDispatch: error => dispatch(handleAxiosError(error)),
  dispatchLoaded: value => dispatch(setLoaded(value)),
})

const mapStateToProps = state => ({
  error: state.app.error,
})

export { AuthUserCreateContainer }

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AuthUserCreateContainer)
)
