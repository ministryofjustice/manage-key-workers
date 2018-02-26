import React, { Component } from 'react';
import { Link } from "react-router-dom";
import PrisonerSearch from '../PrisonerSearch';

class AssignTransfer extends Component {
  render () {
    return (
      <div>
        <div className="pure-g">
          <div className="pure-u-md-8-12">
            <h1 className="heading-large">Search for a prisoner</h1>
            <PrisonerSearch {...this.props} />
          </div>
        </div>
      </div>
    );
  }
}


export default AssignTransfer;
