import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import axios from 'axios'
import { withRouter } from 'react-router'
import ReactRouterPropTypes from 'react-router-prop-types'
import {
  setError,
  resetError,
  setMessage,
  setLoaded,
  setMaintainAuthRoleList,
  setMaintainAuthContextUser,
} from '../../../redux/actions/index'
import AuthUser from '../components/AuthUser'
import { routeMatchType, contextAuthUserType, authRoleListType, errorType } from '../../../types'
import Page from '../../../Components/Page'

class AuthUserContainer extends Component {
  constructor(props) {
    super()
    props.resetErrorDispatch()
    this.handleRemove = this.handleRemove.bind(this)
    this.handleAdd = this.handleAdd.bind(this)
  }

  async componentDidMount() {
    const { setLoadedDispatch, match } = this.props

    setLoadedDispatch(false)
    await this.loadUser(match.params.username)
    await this.getUserRoles(match.params.username)
    setLoadedDispatch(true)
  }

  async getUserRoles(username) {
    const { setRoleListDispatch, handleError } = this.props

    try {
      const roles = await axios.get('/api/auth-user-roles', {
        params: {
          username,
        },
      })
      setRoleListDispatch(roles.data)
    } catch (error) {
      handleError(error)
    }
  }

  async handleRemove(event) {
    const { contextUser, setMessageDispatch, handleError, roleList } = this.props

    const selectedRole = roleList.find(r => r.roleCode === event.target.value)

    event.preventDefault()
    try {
      await axios.get('/api/auth-user-roles-remove', {
        params: {
          username: contextUser.username,
          role: selectedRole.roleCode,
        },
      })
      await this.getUserRoles(contextUser.username)
      setMessageDispatch(`Role ${selectedRole.roleName} removed`)
    } catch (error) {
      handleError(error)
    }
  }

  async loadUser(username) {
    const { contextUserDispatch, handleError } = this.props

    try {
      const user = await axios.get('/api/auth-user-get', {
        params: {
          username,
        },
      })
      contextUserDispatch(user.data)
    } catch (error) {
      handleError(error)
    }
  }

  handleAdd(event) {
    const { contextUser, history } = this.props

    event.preventDefault()
    history.push(`/admin-utilities/maintain-auth-roles/${contextUser.username}/add-role`)
  }

  render() {
    const {
      contextUser: { firstName, lastName },
    } = this.props

    if (!firstName && !lastName) {
      return (
        <Page title="Auth User:" alwaysRender>
          <div>User not found</div>
        </Page>
      )
    }

    return (
      <Page title={`Auth User: ${firstName} ${lastName}`} alwaysRender>
        <AuthUser handleRemove={this.handleRemove} handleAdd={this.handleAdd} {...this.props} />
      </Page>
    )
  }
}

AuthUserContainer.propTypes = {
  error: errorType.isRequired,
  resetErrorDispatch: PropTypes.func.isRequired,
  setRoleListDispatch: PropTypes.func.isRequired,
  setErrorDispatch: PropTypes.func.isRequired,
  contextUser: contextAuthUserType,
  roleList: authRoleListType,
  setMessageDispatch: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  setLoadedDispatch: PropTypes.func.isRequired,
  match: routeMatchType.isRequired,
  handleError: PropTypes.func.isRequired,
  contextUserDispatch: PropTypes.func.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
}

AuthUserContainer.defaultProps = {
  contextUser: {},
  roleList: [],
}

const mapStateToProps = state => ({
  error: state.app.error,
  contextUser: state.maintainAuthUsers.contextUser,
  roleList: state.maintainAuthUsers.roleList,
  loaded: state.app.loaded,
  message: state.app.message,
})

const mapDispatchToProps = dispatch => ({
  setErrorDispatch: error => dispatch(setError(error)),
  resetErrorDispatch: () => dispatch(resetError()),
  setRoleListDispatch: list => dispatch(setMaintainAuthRoleList(list)),
  setMessageDispatch: message => dispatch(setMessage(message)),
  contextUserDispatch: user => dispatch(setMaintainAuthContextUser(user)),
  setLoadedDispatch: status => dispatch(setLoaded(status)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AuthUserContainer))
