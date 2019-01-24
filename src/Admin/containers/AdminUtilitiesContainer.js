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
    const { user, config } = this.props
    const hasMaintainRolesAccess = user && (user.maintainAccess || user.maintainAccessAdmin)
    const showMaintainRoles = config && config.maintainRolesEnabled === 'true' && hasMaintainRolesAccess
    const showKeyworkerSettings = hasMaintainRolesAccess && user.migration

    return (
      <Page title="Admin and Utilities">
        <MessageBar {...this.props} />
        <div className="pure-g">
          <div className="pure-u-md-8-12">
            {!hasMaintainRolesAccess && !showMaintainRoles && !showKeyworkerSettings && (
              <p>There are no Admin or Utilities associated with your account.</p>
            )}

            {hasMaintainRolesAccess && (
              <div className="pure-u-md-6-12">
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
              <div className="pure-u-md-5-12">
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
            {showMaintainRoles && (
              <div className="pure-u-md-5-12">
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
