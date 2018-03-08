import React, { Component } from 'react';
import { properCaseName } from "../stringUtils";
import PropTypes from 'prop-types';

class Unallocated extends Component {
  render () {
    const offenders = this.props.unallocatedList.map(a => {
      const formattedName = properCaseName(a.lastName) + ', ' + properCaseName(a.firstName);
      let confirmedReleaseDate = a.confirmedReleaseDate;
      if (confirmedReleaseDate == null) {
        confirmedReleaseDate = "--";
      }
      let crsaClassification = a.crsaClassification;
      if (crsaClassification == null) {
        crsaClassification = "--";
      }
      return (
        <tr key={a.bookingId}>
          <td className="row-gutters"><a href={a.bookingId}>{formattedName}</a></td>
          <td className="row-gutters">{a.offenderNo}</td>
          <td className="row-gutters">{a.internalLocationDesc}</td>
          <td className="row-gutters">{confirmedReleaseDate}</td>
          <td className="row-gutters">{crsaClassification}</td>
        </tr>
      );
    });
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
        </div>
        <div>
          <button className="button top-gutter" onClick={() => this.props.gotoNext()}>Allocate</button>
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
