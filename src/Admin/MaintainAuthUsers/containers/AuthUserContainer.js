import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import axios from 'axios'
import { withRouter } from 'react-router'
import ReactRouterPropTypes from 'react-router-prop-types'
import { resetError, setMessage } from '../../../redux/actions/index'
import AuthUser from '../components/AuthUser'
import { contextAuthUserType, authRoleListType, errorType } from '../../../types'
import Page from '../../../Components/Page'
import loadComponent from './AuthUserLoadHoc'

class AuthUserContainer extends Component {
  constructor(props) {
    super()
    props.resetErrorDispatch()
    this.handleRemove = this.handleRemove.bind(this)
    this.handleAdd = this.handleAdd.bind(this)
  }

  async handleRemove(event) {
    const { contextUser, setMessageDispatch, handleError, roleList, getUserRoles } = this.props

    const selectedRole = roleList.find(r => r.roleCode === event.target.value)

    event.preventDefault()
    try {
      await axios.get('/api/auth-user-roles-remove', {
        params: {
          username: contextUser.username,
          role: selectedRole.roleCode,
        },
      })
      setMessageDispatch(`Role ${selectedRole.roleName} removed`)
      getUserRoles(contextUser.username)
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
  getUserRoles: PropTypes.func.isRequired,
  resetErrorDispatch: PropTypes.func.isRequired,
  contextUser: contextAuthUserType,
  roleList: authRoleListType,
  setMessageDispatch: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  handleError: PropTypes.func.isRequired,
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
  resetErrorDispatch: () => dispatch(resetError()),
  setMessageDispatch: message => dispatch(setMessage(message)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(loadComponent(AuthUserContainer)))
