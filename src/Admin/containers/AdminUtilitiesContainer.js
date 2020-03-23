import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { setLoaded } from '../../redux/actions'
import Page from '../../Components/Page'
import { userType, configType } from '../../types'
import MessageBar from '../../MessageBar'
import { AdminUtilities, AdminUtility } from './AdminUtilitiesContainer.styles'

export class AdminUtilitiesContainer extends Component {
  componentWillMount() {
    const { setLoadedDispatch } = this.props

    setLoadedDispatch(true)
  }

  render() {
    const { user } = this.props
    const hasMaintainRolesAccess = user && (user.maintainAccess || user.maintainAccessAdmin)
    const showKeyworkerSettings = hasMaintainRolesAccess && user.migration
    const hasMaintainAuthUsers = user && (user.maintainAuthUsers || user.groupManager)

    return (
      <Page title="Admin and utilities">
        <MessageBar {...this.props} />
        <AdminUtilities>
          {!hasMaintainRolesAccess && !hasMaintainRolesAccess && !showKeyworkerSettings && !hasMaintainAuthUsers && (
            <div>
              <p>There are no admin or utility functions associated with your account.</p>
            </div>
          )}
          {showKeyworkerSettings && (
            <AdminUtility>
              <Link
                id="keyworker_settings_link"
                title="Key worker settings"
                className="link"
                to="/admin-utilities/manage-key-worker-settings"
              >
                Manage key worker settings
              </Link>
              <div>Allow auto-allocation. Edit key worker capacity and session frequency.</div>
            </AdminUtility>
          )}
          {hasMaintainRolesAccess && (
            <AdminUtility>
              <Link
                id="maintain_roles_link"
                title="Manage access roles"
                className="link"
                to="/admin-utilities/maintain-roles"
              >
                Manage access roles
              </Link>
              <div>Add and remove staff roles.</div>
            </AdminUtility>
          )}
          {hasMaintainAuthUsers && (
            <AdminUtility>
              <Link
                id="maintain_auth_users_link"
                title="Manage auth users"
                className="link"
                to="/admin-utilities/maintain-auth-users"
              >
                Manage auth users
              </Link>
              <div>Maintain users that do not exist in NOMIS, only in auth.</div>
            </AdminUtility>
          )}
          {hasMaintainAuthUsers && (
            <AdminUtility>
              <Link
                id="create_auth_user_link"
                title="Create auth user"
                className="link"
                to="/admin-utilities/create-auth-user"
              >
                Create auth user
              </Link>
              <div>Create user in auth (not in NOMIS).</div>
            </AdminUtility>
          )}
        </AdminUtilities>
      </Page>
    )
  }
}

AdminUtilitiesContainer.propTypes = {
  user: userType.isRequired,
  config: configType.isRequired,
  setLoadedDispatch: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  user: state.app.user,
  config: state.app.config,
})

const mapDispatchToProps = dispatch => ({
  setLoadedDispatch: status => dispatch(setLoaded(status)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminUtilitiesContainer)
