import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import MessageBar from '../MessageBar/index'
import { getHomeLink } from '../links'
import { userType, configType } from '../types'

const HomePage = props => {
  const { allowAuto, user, config, migrated } = props
  const showEnableNewNomis = user && (user.maintainAccess || user.maintainAccessAdmin)
  const showMaintainRoles =
    config && config.maintainRolesEnabled === 'true' && user && (user.maintainAccess || user.maintainAccessAdmin)
  const showKeyworkerSettings = user && (user.maintainAccess || user.maintainAccessAdmin) && user.migration
  const showAdminSection = showEnableNewNomis || showKeyworkerSettings
  const showKeyworkerDashboard = config && config.keyworkerDashboardStatsEnabled && migrated
  return (
    <div>
      <MessageBar {...props} />
      <div className="pure-g">
        <div className="pure-u-md-12-12 padding-top">
          <a className="link backlink" href={getHomeLink()}>
            <img className="back-triangle" src="/images/BackTriangle.png" alt="" width="6" height="10" /> Home
          </a>
        </div>
        <div className="pure-u-md-8-12 padding-bottom-large">
          <h1 className="heading-large margin-top padding-bottom-40">Manage Key workers</h1>
          {user &&
            user.writeAccess &&
            allowAuto && (
              <div className="pure-u-md-6-12">
                <Link id="auto_allocate_link" title="Auto allocate link" className="link" to="/unallocated">
                  Auto-allocate key workers
                </Link>
                <div className="padding-right-large">Allocate key workers to prisoners automatically.</div>
              </div>
            )}
          <div className="pure-u-md-6-12">
            <Link id="keyworker_profile_link" title="Key worker profile link" className="link" to="/keyworker/search">
              Your key workers
            </Link>
            <div>Update a key worker&apos;s availability, re-assign their prisoners and check their statistics.</div>
          </div>
        </div>
        <div className="pure-u-md-8-12">
          <div className="pure-u-md-6-12">
            <Link
              id="assign_transfer_link"
              title="Manually allocate key workers"
              className="link"
              to="/offender/search"
            >
              Manually allocate key workers
            </Link>
            <div className="padding-right-large">Check a prisoner&apos;s key worker and allocate manually.</div>
          </div>
          {showKeyworkerDashboard && (
            <div className="pure-u-md-6-12">
              <Link
                id="keyworker_dashboard_link"
                title="Key worker dashboard"
                className="link"
                to="/keyworkerDashboard"
              >
                Prison statistics
              </Link>
              <div className="padding-right-large">Check the key worker statistics for your establishment.</div>
            </div>
          )}
        </div>
        <div className="pure-u-md-8-12">
          {showAdminSection && (
            <h2 id="admin-task-header" className="padding-top-small heading-medium">
              Admin tasks
            </h2>
          )}
          {showEnableNewNomis && (
            <div className="pure-u-md-6-12">
              <Link id="enable_new_nomis_link" title="Enable Nomis" className="link" to="/admin/nomis/access">
                Give access to New NOMIS
              </Link>
              <div className="padding-right-large">Allow prisons to use New NOMIS. Add new prison staff.</div>
            </div>
          )}
          {showKeyworkerSettings && (
            <div className="pure-u-md-5-12">
              <Link id="keyworker_settings_link" title="Key worker settings" className="link" to="/admin/settings">
                Manage key worker settings
              </Link>
              <div className="padding-right-large">
                Allow auto-allocation. Edit key worker capacity and session frequency.
              </div>
            </div>
          )}
          {showMaintainRoles && (
            <div className="pure-u-md-5-12">
              <Link id="maintain_roles_link" title="maintain access roles" className="link" to="/maintainRoles/search">
                Manage access roles
              </Link>
              <div className="padding-right-large">Add and remove staff roles.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

HomePage.propTypes = {
  message: PropTypes.string.isRequired,
  user: userType.isRequired,
  config: configType.isRequired,
  allowAuto: PropTypes.bool.isRequired,
  migrated: PropTypes.bool.isRequired,
}

export default HomePage
