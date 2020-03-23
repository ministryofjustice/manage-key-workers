import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ReactRouterPropTypes from 'react-router-prop-types'
import axios from 'axios'
import { withRouter } from 'react-router'

import { setError, resetError, setLoaded, handleAxiosError } from '../../../redux/actions/index'
import AuthUserAddRole from '../components/AuthUserAddRole'
import { routeMatchType, authRoleListType, contextAuthUserType, errorType } from '../../../types'
import Page from '../../../Components/Page'
import { loadAuthUserRolesAndGroups } from '../../../redux/actions/maintainAuthUserActions'
import { validateAddRole } from './AuthUserValidation'

class AuthUserAddRoleContainer extends Component {
  constructor(props) {
    super()
    props.resetErrorDispatch()
    this.state = {}
  }

  async componentDidMount() {
    const { loadAuthUserRolesAndGroupDispatch, match } = this.props

    this.getRoles(match.params.username)
    loadAuthUserRolesAndGroupDispatch(match.params.username)
  }

  async getRoles(username) {
    const { handleAxiosErrorDispatch } = this.props

    try {
      const { data } = await axios.get('/api/auth-roles', {
        params: {
          username,
        },
      })
      this.setState(state => ({ ...state, roles: data }))
    } catch (error) {
      handleAxiosErrorDispatch(error)
    }
  }

  handleChange = event => {
    const { name, value } = event.target
    this.setState(state => ({ ...state, [name]: value }))
  }

  handleAdd = async event => {
    const { contextUser, handleAxiosErrorDispatch, setErrorDispatch, history } = this.props
    const { roles, role } = this.state

    event.preventDefault()

    const selectedRole = roles.find(r => r.roleCode === role)

    const errors = validateAddRole(selectedRole)
    if (errors.length) {
      setErrorDispatch(errors)
      return
    }

    try {
      await axios.get('/api/auth-user-roles-add', {
        params: {
          username: contextUser.username,
          role: selectedRole.roleCode,
        },
      })
      history.goBack()
    } catch (error) {
      handleAxiosErrorDispatch(error)
    }
  }

  handleCancel = e => {
    const { history } = this.props
    e.preventDefault()
    history.goBack()
  }

  render() {
    const {
      contextUser: { firstName, lastName },
    } = this.props
    const { roles } = this.state

    if ((!firstName && !lastName) || !roles) {
      return (
        <Page title="not found role:" alwaysRender>
          <div>User not found</div>
        </Page>
      )
    }

    return (
      <Page title={`Add role: ${firstName} ${lastName}`} alwaysRender>
        <AuthUserAddRole
          handleAdd={this.handleAdd}
          handleCancel={this.handleCancel}
          handleRoleAddChange={this.handleChange}
          roleFilterList={roles}
          {...this.props}
        />
      </Page>
    )
  }
}

AuthUserAddRoleContainer.propTypes = {
  error: errorType.isRequired,
  resetErrorDispatch: PropTypes.func.isRequired,
  setErrorDispatch: PropTypes.func.isRequired,
  setLoadedDispatch: PropTypes.func.isRequired,
  contextUser: contextAuthUserType,
  roleList: authRoleListType,
  match: routeMatchType.isRequired,
  loadAuthUserRolesAndGroupDispatch: PropTypes.func.isRequired,
  handleAxiosErrorDispatch: PropTypes.func.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
}

AuthUserAddRoleContainer.defaultProps = {
  contextUser: {},
  roleList: [],
}

const mapStateToProps = state => ({
  error: state.app.error,
  contextUser: state.maintainAuthUsers.contextUser,
  roleList: state.maintainAuthUsers.roleList,
  loaded: state.app.loaded,
})

const mapDispatchToProps = dispatch => ({
  setErrorDispatch: error => dispatch(setError(error)),
  resetErrorDispatch: () => dispatch(resetError()),
  handleAxiosErrorDispatch: error => dispatch(handleAxiosError(error)),
  setLoadedDispatch: status => dispatch(setLoaded(status)),
  loadAuthUserRolesAndGroupDispatch: username => dispatch(loadAuthUserRolesAndGroups(username)),
})

export { AuthUserAddRoleContainer }

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AuthUserAddRoleContainer))
