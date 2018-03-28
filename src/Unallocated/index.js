import React, { Component } from 'react';
import { properCaseName } from "../stringUtils";
import PropTypes from 'prop-types';
import { getOffenderLink } from "../links";

class Unallocated extends Component {
  buildTableForRender () {
    if (!(this.props.unallocatedList && this.props.unallocatedList.map)) {
      return [];
    }
    return this.props.unallocatedList.map(a => {
      const formattedName = properCaseName(a.lastName) + ', ' + properCaseName(a.firstName);
      return (
        <tr key={a.bookingId}>
          <td className="row-gutters"><a href={getOffenderLink(a.offenderNo)}>{formattedName}</a></td>
          <td className="row-gutters">{a.offenderNo}</td>
          <td className="row-gutters">{a.assignedLivingUnitDesc}</td>
          <td className="row-gutters">{a.confirmedReleaseDate || '--'}</td>
          <td className="row-gutters">{a.crsaClassification || '--'}</td>
        </tr>
      );
    });
  }

  render () {
    const offenders = this.buildTableForRender();
    return (
      <div>
        <div className="pure-u-md-7-12">
          <h1 className="heading-large">Offenders without key workers</h1>
          <p>These offenders have not yet been allocated a Key worker. Use the button below to automatically allocate
            them to one. You can override the selections on the next page if you wish.</p>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>NOMS ID</th>
                <th>Location</th>
                <th>RD</th>
                <th>CSRA</th>
              </tr>
            </thead>
            <tbody>{offenders}</tbody>
          </table>
          {offenders.length === 0 && <div className="font-small padding-top-large padding-bottom padding-left">No prisoners found</div>}
        </div>
        <div>
          {offenders.length > 0 && <button className="button top-gutter margin-bottom" onClick={() => this.props.gotoNext()}>Allocate</button>}
        </div>
      </div>
    );
  }
}

Unallocated.propTypes = {
  unallocatedList: PropTypes.array,
  gotoNext: PropTypes.func.isRequired
};

export default Unallocated;
