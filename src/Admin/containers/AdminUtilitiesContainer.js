import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { setLoaded } from '../../redux/actions'
import Page from '../../Components/Page'
import { userType, configType } from '../../types'
import MessageBar from '../../MessageBar'

export class AdminUtilitiesContainer extends Component {
  componentWillMount() {
    const { setLoadedDispatch } = this.props

    setLoadedDispatch(true)
  }

  render() {
    const { user } = this.props
    const hasMaintainRolesAdminAccess = user && user.maintainAccessAdmin
    const hasMaintainRolesAccess = user && (user.maintainAccess || user.maintainAccessAdmin)
    const showKeyworkerSettings = hasMaintainRolesAccess && user.migration
    const hasMaintainAuthUsers = user && user.maintainAuthUsers

    return (
      <Page title="Admin and Utilities">
        <MessageBar {...this.props} />
        <div className="pure-g">
          <div className="pure-u-md-8-12">
            {!hasMaintainRolesAccess && !hasMaintainRolesAccess && !showKeyworkerSettings && !hasMaintainAuthUsers && (
              <p>There are no Admin or Utilities associated with your account.</p>
            )}

            {hasMaintainRolesAdminAccess && (
              <div className="pure-u-md-6-12 margin-bottom">
                <Link
                  id="enable_new_nomis_link"
                  title="Enable Nomis"
                  className="link"
                  to="/admin-utilities/give-nomis-access"
                >
                  Give access to New NOMIS
                </Link>
                <div className="padding-right-large">Allow prisons to use New NOMIS. Add new prison staff.</div>
              </div>
            )}
            {showKeyworkerSettings && (
              <div className="pure-u-md-5-12 margin-bottom">
                <Link
                  id="keyworker_settings_link"
                  title="Key worker settings"
                  className="link"
                  to="/admin-utilities/manage-key-worker-settings"
                >
                  Manage key worker settings
                </Link>
                <div className="padding-right-large">
                  Allow auto-allocation. Edit key worker capacity and session frequency.
                </div>
              </div>
            )}
            {hasMaintainRolesAccess && (
              <div className="pure-u-md-5-12 margin-bottom">
                <Link
                  id="maintain_roles_link"
                  title="Manage access roles"
                  className="link"
                  to="/admin-utilities/maintain-roles"
                >
                  Manage access roles
                </Link>
                <div className="padding-right-large">Add and remove staff roles.</div>
              </div>
            )}
            {hasMaintainAuthUsers && (
              <div className="pure-u-md-5-12 margin-bottom">
                <Link
                  id="maintain_auth_users_link"
                  title="Manage auth users"
                  className="link"
                  to="/admin-utilities/maintain-auth-users"
                >
                  Manage auth users
                </Link>
                <div className="padding-right-large">Maintain users that do not exist in NOMIS, only in auth.</div>
              </div>
            )}
          </div>
        </div>
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
