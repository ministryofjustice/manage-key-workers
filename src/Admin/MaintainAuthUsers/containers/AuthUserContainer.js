import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import ReactRouterPropTypes from 'react-router-prop-types'
import { loadAuthUserAndRoles, removeAuthRole } from '../../../redux/actions/maintainAuthUserActions'
import AuthUser from '../components/AuthUser'
import { routeMatchType, contextAuthUserType, authRoleListType, errorType } from '../../../types'
import Page from '../../../Components/Page'

class AuthUserContainer extends Component {
  async componentDidMount() {
    const { loadAuthUserAndRolesDispatch, match } = this.props

    loadAuthUserAndRolesDispatch(match.params.username)
  }

  handleRemove = async event => {
    const { removeAuthRoleDispatch } = this.props

    event.preventDefault()
    removeAuthRoleDispatch(event.target.value)
  }

  handleAdd = event => {
    const { contextUser, history } = this.props

    event.preventDefault()
    history.push(`/admin-utilities/maintain-auth-users/${contextUser.username}/add-role`)
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
  contextUser: contextAuthUserType,
  roleList: authRoleListType,
  message: PropTypes.string.isRequired,
  match: routeMatchType.isRequired,
  loadAuthUserAndRolesDispatch: PropTypes.func.isRequired,
  removeAuthRoleDispatch: PropTypes.func.isRequired,
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
  loadAuthUserAndRolesDispatch: username => dispatch(loadAuthUserAndRoles(username)),
  removeAuthRoleDispatch: role => dispatch(removeAuthRole(role)),
})

export { AuthUserContainer }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AuthUserContainer))
