import React, { Component } from 'react';
import { properCaseName } from "../../stringUtils";
import PropTypes from 'prop-types';
import { getOffenderLink } from "../../links";
import { Link } from "react-router-dom";

class Unallocated extends Component {
  buildTableForRender () {
    if (!(this.props.unallocatedList && this.props.unallocatedList.map)) {
      return [];
    }
    return this.props.unallocatedList.map(a => {
      const formattedName = properCaseName(a.lastName) + ', ' + properCaseName(a.firstName);
      return (
        <tr key={a.offenderNo}>
          <td className="row-gutters"><a target="_blank" className="link" href={getOffenderLink(a.offenderNo)}>{formattedName}</a></td>
          <td className="row-gutters">{a.offenderNo}</td>
          <td className="row-gutters">{a.assignedLivingUnitDesc}</td>
          <td className="row-gutters">{a.confirmedReleaseDate || '--'}</td>
          <td className="row-gutters">{a.crsaClassification || '--'}</td>
        </tr>
      );
    });
  }

  render () {
    if (!this.props.loaded) {
      return '';
    }
    const offenders = this.buildTableForRender();
    return (
      <div>
        <div className="pure-u-md-7-12 padding-bottom-40 padding-top-large">
          <div><Link id={`back_to_menu_link`} title="Back to menu link" className="link" to="/" >&lt; Back</Link></div>
          <h1 className="heading-large margin-top">Auto-allocate key workers</h1>
          <table>
            <thead>
              <tr>
                <th>Prisoner</th>
                <th>Prison no.</th>
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
          {offenders.length > 0 && <button className="button" onClick={() => this.props.gotoNext(this.props.history)}>Allocate</button>}
        </div>
      </div>
    );
  }
}

Unallocated.propTypes = {
  unallocatedList: PropTypes.array,
  gotoNext: PropTypes.func.isRequired,
  loaded: PropTypes.bool,
  history: PropTypes.object
};

export default Unallocated;
