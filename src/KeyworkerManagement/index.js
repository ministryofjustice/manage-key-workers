import React, { Component } from 'react';
import MessageBar from "../MessageBar/index";
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import { getHomeLink } from "../links";

class HomePage extends Component {
  render () {
    const showEnableNewNomis = this.props.user && this.props.user.maintainAccess;
    const showMaintainRoles = this.props.config && this.props.config.maintainRolesEnabled === 'true' && this.props.user && this.props.user.maintainAccess;
    const showKeyworkerSettings = this.props.user && this.props.user.maintainAccess && this.props.user.migration;
    const showAdminSection = showEnableNewNomis || showKeyworkerSettings;
    return (
      <div>
        <MessageBar {...this.props}/>
        <div className="pure-g">
          <div className="pure-u-md-12-12 padding-top"><a className="link backlink" href={getHomeLink()}><img className="back-triangle" src="/images/BackTriangle.png" alt="" width="6" height="10"/> Home</a></div>
          <div className="pure-u-md-8-12 padding-bottom-large">
            <h1 className="heading-large margin-top padding-bottom-40">Manage Key workers</h1>
            {this.props.user && this.props.user.writeAccess && this.props.allowAuto && <div className="pure-u-md-6-12">
              <Link id="auto_allocate_link" title="Auto allocate link" className="link" to="/unallocated" >Auto-allocate key workers</Link>
              <div className="padding-right-large">Allocate key workers to prisoners automatically.</div>
            </div>}
            <div className="pure-u-md-6-12">
              <Link id="keyworker_profile_link" title="Key worker profile link" className="link" to="/keyworker/search" >Update key worker availability</Link>
              <div>Update a key worker's availability. Assign prisoners to another key worker.</div>
            </div>
          </div>
          <div className="pure-u-md-8-12">
            <div className="pure-u-md-6-12">
              <Link id="assign_transfer_link" title="Manually allocate key workers" className="link" to="/offender/search" >Manually allocate key workers</Link>
              <div className="padding-right-large">Check a prisoner's key worker and allocate manually.</div>
            </div>
          </div>
          <div className="pure-u-md-8-12">
            {showAdminSection &&
          <h2 id="admin-task-header" className="padding-top-small heading-medium">Admin tasks</h2>
            }
            {showEnableNewNomis && <div className="pure-u-md-6-12">
              <Link id="enable_new_nomis_link" title="Enable Nomis" className="link" to="/admin/nomis/access" >Give access to New NOMIS</Link>
              <div className="padding-right-large">Allow prisons to use New NOMIS. Add new prison staff.</div>
            </div>}
            {showKeyworkerSettings && <div className="pure-u-md-5-12">
              <Link id="keyworker_settings_link" title="Key worker settings" className="link" to="/admin/settings" >Manage key worker settings</Link>
              <div className="padding-right-large">Allow auto-allocation. Edit key worker capacity and session frequency.</div>
            </div>}
            {showMaintainRoles && <div className="pure-u-md-5-12">
              <Link id="maintain_roles_link" title="maintain access roles" className="link" to="/maintainRoles/search" >Manage access roles</Link>
              <div className="padding-right-large">Add and remove staff roles</div>
            </div>}
          </div>
        </div>
      </div>);
  }
}

HomePage.propTypes = {
  message: PropTypes.string,
  user: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
  allowAuto: PropTypes.bool
};

export default HomePage;
