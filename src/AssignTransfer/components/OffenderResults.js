import React, { Component } from 'react';
import { properCaseName } from '../../stringUtils';
import { getOffenderLink } from "../../links";
//import ReactTooltip from 'react-tooltip';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import OffenderSearchContainer from "../containers/OffenderSearchContainer";

class OffenderResults extends Component {
  getKeyworkerDisplay (staffId, keyworkerDisplay, numberAllocated) {
    if (staffId) {
      if (keyworkerDisplay) {
        if (numberAllocated || numberAllocated === 0) {
          return keyworkerDisplay + '(' + numberAllocated + ')';
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

  getOffenderLink (offenderNo) {
    return `${(process.env.NN_ENDPOINT_URL || 'http://notm-dev.hmpps.dsd.test:3000/')}bookings/${offenderNo}/personal`;
  }

  buildTableForRender (keyworkerOptions, offenderList) {
    if (!offenderList || offenderList.length === 0) {
      return <h1 className="error-message padding-top padding-bottom">No results found</h1>;
    }
    const offenders = offenderList.map((a, index) => {
      const currentSelectValue = this.props.keyworkerChangeList && this.props.keyworkerChangeList[index] ?
        this.props.keyworkerChangeList[index].staffId : '';
      return (<tr key={a.bookingId} className="row-gutters">
        <td className="row-gutters"><a
          href={getOffenderLink(a.offenderNo)}>{properCaseName(a.lastName)}, {properCaseName(a.firstName)}</a></td>
        <td className="row-gutters">{a.offenderNo}</td>
        <td className="row-gutters">{a.assignedLivingUnitDesc}</td>
        <td className="row-gutters">{a.confirmedReleaseDate || "--"}</td>
        <td className="row-gutters">{a.crsaClassification || "--"}</td>
        <td className="row-gutters">{this.getKeyworkerDisplay(a.staffId, a.keyworkerDisplay, a.numberAllocated)}
        </td>
        <td className="row-gutters">
          <select id={`keyworker-select-${a.offenderNo}`} className="form-control" value={currentSelectValue}
            onChange={(event) => this.props.handleKeyworkerChange(event, index, a.offenderNo)}>
            <option key="choose" value="--">-- No change --</option>
            {keyworkerOptions.filter(e => e.props.value !== a.staffId)}
          </select>
        </td>
      </tr>);
    });
    return offenders;
  }

  render () {
    if (!this.props.offenderResults) {
      return "";
    }
    const keyworkerOptions = this.props.offenderResults.keyworkerResponse ?
      this.props.offenderResults.keyworkerResponse.map((kw, optionIndex) => {
        return <option key={`option_${optionIndex}_${kw.staffId}`} value={kw.staffId}>{kw.lastName}, {kw.firstName} ({kw.numberAllocated})</option>;
      }) : [];
    const offenders = this.buildTableForRender(keyworkerOptions, this.props.offenderResults.offenderResponse);
    return (
      <div>
        <div className="pure-g">
          <div className="pure-u-md-7-12"><h1 className="heading-large">Manually assign and transfer</h1></div>
          <div className="pure-u-md-11-12-12"><OffenderSearchContainer {...this.props} /></div>
        </div>
        <table className="row-gutters">
          <thead>
            <tr>
              <th>Name</th>
              <th>NOMS ID</th>
              <th>Location</th>
              <th>Release date</th>
              <th>CSRA</th>
              <th>Allocated Key worker</th>
              <th>Assign to new key worker</th>
            </tr>
          </thead>
          <tbody>{offenders}</tbody>
        </table>
        <button className="button top-gutter pure-u-md-5-24" onClick={() => this.props.postManualOverride(this.props.history)}>Save and return to menu</button>
      </div>
    );
  }
}

OffenderResults.propTypes = {
  offenderResults: PropTypes.object,
  keyworkerList: PropTypes.array,
  keyworkerChangeList: PropTypes.array,
  history: PropTypes.object,
  handleKeyworkerChange: PropTypes.func.isRequired,
  postManualOverride: PropTypes.func.isRequired
};

const OffenderResultsWithRouter = withRouter(OffenderResults);

export { OffenderResults };
export default OffenderResultsWithRouter;
