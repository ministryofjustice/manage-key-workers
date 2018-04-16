import React, { Component } from 'react';
import MessageBar from "../MessageBar/index";
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

class HomePage extends Component {
  render () {
    return (
      <div>
        <MessageBar {...this.props}/>
        <div className="pure-g">
          <div className="pure-u-md-8-12 padding-bottom-large">
            <h1 className="heading-large">Key worker management</h1>
            <div className="pure-u-md-6-12">
              <Link id="auto_allocate_link" title="Auto allocate link" className="link" to="/unallocated" >Auto allocate key workers</Link>
              <div className="padding-right-large">Quickly auto-allocate offenders to key workers and override selections if needed</div>
            </div>
            <div className="pure-u-md-6-12">
              <Link id="keyworker_profile_link" title="Key worker profile link" className="link" to="/keyworker/search" >Edit key worker profile</Link>
              <div>Remove key workers from active duty and reassign offenders</div>
            </div>
          </div>
          <div className="pure-u-md-8-12">
            <div className="pure-u-md-6-12">
              <Link id="assign_transfer_link" title="Manually assign and transfer link" className="link" to="/assignTransfer" >Manually assign and transfer</Link>
              <div className="padding-right-large">View current offender to key worker assignment and reallocate if desired</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

HomePage.propTypes = {
  message: PropTypes.string
};

export default HomePage;
