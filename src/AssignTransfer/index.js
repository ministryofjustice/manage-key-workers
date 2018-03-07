import React, { Component } from 'react';
import OffenderSearchContainer from './containers/OffenderSearchContainer';

class AssignTransfer extends Component {
  render () {
    return (
      <div>
        <div className="pure-g">
          <div className="pure-u-md-8-12">
            <h1 className="heading-large">Search for an offender</h1>
            <OffenderSearchContainer {...this.props} />
          </div>
        </div>
      </div>
    );
  }
}

export default AssignTransfer;
