import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import Page from '../Components/Page'
import MessageBar from '../MessageBar/index'
import { userType, configType } from '../types'

class KeyworkerHomePage extends Component {
  componentDidMount() {
    const { dispatchLoaded } = this.props
    dispatchLoaded(true)
  }

  render() {
    const { allowAuto, user, config, migrated } = this.props
    const showKeyworkerDashboard = config && config.keyworkerDashboardStatsEnabled && migrated

    return (
      <Page title="Manage key workers">
        <MessageBar {...this.props} />
        <div className="pure-g">
          <div className="pure-u-md-8-12 padding-bottom-large">
            {user && user.writeAccess && allowAuto && (
              <div className="pure-u-md-6-12">
                <Link id="auto_allocate_link" title="Auto allocate link" className="link" to="/unallocated">
                  Auto-allocate key workers
                </Link>
                <div className="padding-right-large">Allocate key workers to prisoners automatically.</div>
              </div>
            )}
            <div className="pure-u-md-6-12">
              <Link
                id="keyworker_profile_link"
                title="Key worker profile link"
                className="link"
                to="/key-worker-search"
              >
                Your key workers
              </Link>
              <div>Update a key worker&apos;s availability, re-assign their prisoners and check their statistics.</div>
            </div>
          </div>
          <div className="pure-u-md-8-12 padding-bottom-large">
            <div className="pure-u-md-6-12">
              <Link
                id="assign_transfer_link"
                title="Manually allocate key workers"
                className="link"
                to="/offender-search"
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
                  to="/key-worker-statistics"
                >
                  Prison statistics
                </Link>
                <div className="padding-right-large">Check the key worker statistics for your establishment.</div>
              </div>
            )}
          </div>
          <div className="pure-u-md-8-12">
            <div className="pure-u-md-6-12">
              <Link
                id="keyworker_settings_link"
                title="Key worker settings link"
                className="link"
                to="/manage-key-worker-settings"
              >
                Manage key worker settings
              </Link>
              <div>Allow auto-allocation. Edit key worker capacity and session frequency.</div>
            </div>
          </div>
        </div>
      </Page>
    )
  }
}

KeyworkerHomePage.propTypes = {
  message: PropTypes.string.isRequired,
  user: userType.isRequired,
  config: configType.isRequired,
  allowAuto: PropTypes.bool.isRequired,
  migrated: PropTypes.bool.isRequired,
  dispatchLoaded: PropTypes.func.isRequired,
}

export default KeyworkerHomePage
