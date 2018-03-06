import React, { Component } from 'react';
import OffenderSearch from './components/OffenderSearch';

class AssignTransfer extends Component {
  render () {
    return (
      <div>
        <div className="pure-g">
          <div className="pure-u-md-8-12">
            <h1 className="heading-large">Search for an offender</h1>
            <OffenderSearch {...this.props} />
          </div>
        </div>
      </div>
    );
  }
}


export default AssignTransfer;
