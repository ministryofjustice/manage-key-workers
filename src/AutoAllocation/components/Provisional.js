import React, { Component } from 'react';
import { properCaseName } from '../../stringUtils';
import DateFilter from '../../DateFilter/index.js';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { getOffenderLink } from "../../links";

class Provisional extends Component {
  getKeyworkerDisplay (staffId, keyworkerDisplay, numberAllocated) {
    if (staffId) {
      if (keyworkerDisplay !== '--') {
        if (numberAllocated || numberAllocated === 0) {
          return keyworkerDisplay + ' (' + numberAllocated + ')';
        } else {
          return keyworkerDisplay;
        }
      } else {
        return staffId + ' (no details available)';
      }
    } else {
      return <strong className="bold-xsmall">Not allocated</strong>;
    }
  }

  buildTableForRender (keyworkerOptions) {
    const offenders = this.props.allocatedList.map((a, index) => {
      const currentSelectValue = this.props.allocatedKeyworkers[index] ? this.props.allocatedKeyworkers[index].staffId : '';
      return (
        <tr key={a.offenderNo} className="row-gutters">
          <td className="row-gutters"><a target="_blank"
            href={getOffenderLink(a.offenderNo)}>{properCaseName(a.lastName)}, {properCaseName(a.firstName)}</a></td>
          <td className="row-gutters">{a.offenderNo}</td>
          <td className="row-gutters">{a.internalLocationDesc}</td>
          <td className="row-gutters">{a.confirmedReleaseDate || '--'}</td>
          <td className="row-gutters">{a.crsaClassification || '--'}</td>
          <td className="row-gutters">{this.getKeyworkerDisplay(a.staffId, a.keyworkerDisplay, a.numberAllocated)}</td>
          <td className="row-gutters">
            <select id={`keyworker-select-${a.offenderNo}`} className="form-control" value={currentSelectValue}
              onChange={(event) => this.props.handleKeyworkerChange(event, index, a.offenderNo)}>
              <option key="choose" value="--">-- Select --</option>
              {keyworkerOptions.filter(e => e.props.value !== a.staffId)}
            </select>
          </td>
        </tr>
      );
    });
    return offenders;
  }

  render () {
    const keyworkerOptions = this.props.keyworkerList.map((kw, optionIndex) => {
      const formattedDetails = `${properCaseName(kw.lastName)}, ${properCaseName(kw.firstName)} (${kw.numberAllocated})`;
      return <option key={`option_${optionIndex}_${kw.staffId}`} value={kw.staffId}>{formattedDetails}</option>;
    });
    const offenders = this.buildTableForRender(keyworkerOptions);
    return (
      <div>
        <div className="pure-g">

          <div className="pure-u-md-7-12"><h1 className="heading-large">Key worker allocation</h1><p>These offenders below have been automatically allocated to a Key worker. Use the drop down menu on the right to override it.
          The number in the brackets indicates the current total of allocated offenders to each Key worker.</p></div>
          {this.props.displayDateFilter && <div className="pure-u-md-5-12"><DateFilter {...this.props} /></div>}
        </div>
        <table className="row-gutters">
          <thead>
            <tr>
              <th>Name</th>
              <th>NOMS ID</th>
              <th>Location</th>
              <th>CRD</th>
              <th>CSRA</th>
              <th>Allocated Key worker</th>
              <th>Assign to new key worker</th>
            </tr>
          </thead>
          <tbody>{offenders}</tbody>
        </table>
        <div className="pure-u-md-2-12" >
          <button id="saveButton" className="button top-gutter margin-bottom" onClick={() => this.props.postManualOverride(this.props.history)}>Confirm allocation</button>
        </div>
        <div className="pure-u-md-3-12">
          <button id="cancelButton" className="greyButton button-cancel top-gutter margin-bottom" onClick={() => this.props.onFinishAllocation(this.props.history)}>Cancel and return to menu</button>
        </div>
      </div>
    );
  }
}

Provisional.propTypes = {
  displayDateFilter: PropTypes.bool,
  allocatedList: PropTypes.array,
  keyworkerList: PropTypes.array,
  history: PropTypes.object,
  allocatedKeyworkers: PropTypes.array,
  handleKeyworkerChange: PropTypes.func.isRequired,
  postManualOverride: PropTypes.func.isRequired,
  onFinishAllocation: PropTypes.func.isRequired,
  fromDate: PropTypes.string,
  toDate: PropTypes.string
};

export { Provisional };
export default withRouter(Provisional);
