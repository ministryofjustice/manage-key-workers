import React, { Component } from 'react';
import MessageBar from "../MessageBar/index";
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import { getHomeLink } from "../links";

class HomePage extends Component {
  render () {
    return (
      <div>
        <MessageBar {...this.props}/>
        <div className="pure-g">
          <div className="pure-u-md-12-12 padding-top"><a className="link backlink" href={getHomeLink()}><img className="back-triangle" src="/images/BackTriangle.png" alt="" width="6" height="10"/> Home</a></div>
          <div className="pure-u-md-8-12 padding-bottom-large">
            <h1 className="heading-large margin-top padding-bottom-40">Key worker management</h1>
            <div className="pure-u-md-6-12">
              <Link id="auto_allocate_link" title="Auto allocate link" className="link" to="/unallocated" >Auto-allocate key workers</Link>
              <div className="padding-right-large">Allocate key workers to prisoners automatically.</div>
            </div>
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
        </div>
      </div>);
  }
}

HomePage.propTypes = {
  message: PropTypes.string
};

export default HomePage;
