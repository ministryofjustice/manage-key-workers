import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import ReactRouterPropTypes from 'react-router-prop-types'
import {
  loadAuthUserRolesAndGroups,
  removeAuthRole,
  removeAuthGroup,
  enableUser,
  disableUser,
} from '../../../redux/actions/maintainAuthUserActions'
import { clearMessage } from '../../../redux/actions'
import AuthUser from '../components/AuthUser'
import {
  routeMatchType,
  contextAuthUserType,
  authRoleListType,
  authGroupListType,
  errorType,
  userType,
} from '../../../types'
import Page from '../../../Components/Page'

class AuthUserContainer extends Component {
  async componentDidMount() {
    const { loadAuthUserRolesAndGroupsDispatch, match } = this.props

    loadAuthUserRolesAndGroupsDispatch(match.params.username)
  }

  handleRoleRemove = async event => {
    const { removeAuthRoleDispatch } = this.props

    event.preventDefault()
    removeAuthRoleDispatch(event.target.value)
  }

  handleGroupRemove = async event => {
    const { removeAuthGroupDispatch } = this.props

    event.preventDefault()
    removeAuthGroupDispatch(event.target.value)
  }

  handleEnable = async event => {
    const { enableDispatch } = this.props

    event.preventDefault()
    enableDispatch(event.target.value)
  }

  handleDisable = async event => {
    const { disableDispatch } = this.props

    event.preventDefault()
    disableDispatch(event.target.value)
  }

  handleRoleAdd = event => {
    const { contextUser, history } = this.props

    event.preventDefault()
    history.push(`/admin-utilities/maintain-auth-users/${contextUser.username}/add-role`)
  }

  handleGroupAdd = event => {
    const { contextUser, history } = this.props

    event.preventDefault()
    history.push(`/admin-utilities/maintain-auth-users/${contextUser.username}/add-group`)
  }

  render() {
    const {
      contextUser: { firstName, lastName },
    } = this.props

    if (!firstName && !lastName) {
      return (
        <Page title="Auth user:" alwaysRender>
          <div>User not found</div>
        </Page>
      )
    }

    return (
      <Page title={`Auth user: ${firstName} ${lastName}`} alwaysRender>
        <AuthUser
          handleRoleRemove={this.handleRoleRemove}
          handleGroupRemove={this.handleGroupRemove}
          handleRoleAdd={this.handleRoleAdd}
          handleGroupAdd={this.handleGroupAdd}
          handleEnable={this.handleEnable}
          handleDisable={this.handleDisable}
          {...this.props}
        />
      </Page>
    )
  }
}

AuthUserContainer.propTypes = {
  error: errorType.isRequired,
  contextUser: contextAuthUserType,
  roleList: authRoleListType,
  groupList: authGroupListType,
  message: PropTypes.string.isRequired,
  match: routeMatchType.isRequired,
  loadAuthUserRolesAndGroupsDispatch: PropTypes.func.isRequired,
  removeAuthRoleDispatch: PropTypes.func.isRequired,
  removeAuthGroupDispatch: PropTypes.func.isRequired,
  enableDispatch: PropTypes.func.isRequired,
  disableDispatch: PropTypes.func.isRequired,
  clearMessage: PropTypes.func.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  user: userType.isRequired,
}

AuthUserContainer.defaultProps = {
  contextUser: {},
  roleList: [],
  groupList: [],
}

const mapStateToProps = state => ({
  user: state.app.user,
  error: state.app.error,
  contextUser: state.maintainAuthUsers.contextUser,
  roleList: state.maintainAuthUsers.roleList,
  groupList: state.maintainAuthUsers.groupList,
  loaded: state.app.loaded,
  message: state.app.message,
})

const mapDispatchToProps = dispatch => ({
  loadAuthUserRolesAndGroupsDispatch: username => dispatch(loadAuthUserRolesAndGroups(username)),
  removeAuthRoleDispatch: role => dispatch(removeAuthRole(role)),
  removeAuthGroupDispatch: group => dispatch(removeAuthGroup(group)),
  enableDispatch: () => dispatch(enableUser()),
  disableDispatch: () => dispatch(disableUser()),
  clearMessage: () => dispatch(clearMessage()),
})

export { AuthUserContainer }

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AuthUserContainer))
