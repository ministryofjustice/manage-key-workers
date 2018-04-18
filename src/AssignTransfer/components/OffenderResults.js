import React, { Component } from 'react';
import { properCaseName } from '../../stringUtils';
import { getOffenderLink } from "../../links";
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import OffenderSearchContainer from "../containers/OffenderSearchContainer";
import { Link } from "react-router-dom";

class OffenderResults extends Component {
  getKeyworkerDisplay (staffId, keyworkerDisplay, numberAllocated) {
    if (staffId) {
      if (keyworkerDisplay) {
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

  buildTableForRender (keyworkerOptions, offenderList) {
    if (!(offenderList && offenderList.map)) {
      return [];
    }
    return offenderList.map((a, index) => {
      const currentSelectValue = this.props.keyworkerChangeList && this.props.keyworkerChangeList[index] ?
        this.props.keyworkerChangeList[index].staffId : '';
      return (<tr key={a.bookingId} className="row-gutters">
        <td className="row-gutters"><a target="_blank"
          href={getOffenderLink(a.offenderNo)}>{properCaseName(a.lastName)}, {properCaseName(a.firstName)}</a></td>
        <td className="row-gutters">{a.offenderNo}</td>
        <td className="row-gutters">{a.assignedLivingUnitDesc}</td>
        <td className="row-gutters">{a.confirmedReleaseDate || "--"}</td>
        <td className="row-gutters">{a.crsaClassification || "--"}</td>
        <td className="row-gutters">{this.getKeyworkerDisplay(a.staffId, a.keyworkerDisplay)}
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
  }

  render () {
    if (!this.props.offenderResults || !this.props.loaded) {
      return "";
    }
    const keyworkerOptions = this.props.offenderResults.keyworkerResponse ?
      this.props.offenderResults.keyworkerResponse.map((kw, optionIndex) => {
        const formattedDetails = `${properCaseName(kw.lastName)}, ${properCaseName(kw.firstName)} (${kw.numberAllocated})`;
        return <option key={`option_${optionIndex}_${kw.staffId}`} value={kw.staffId}>{formattedDetails}</option>;
      }) : [];
    const offenders = this.buildTableForRender(keyworkerOptions, this.props.offenderResults.offenderResponse);
    return (
      <div>
        <div className="pure-g padding-top-large">
          <div><Link id={`back_to_menu_link`} title="Back to menu link" className="link" to="/" >&lt; Back to admin menu</Link></div>
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
        {offenders.length > 0 ?
          <div className="pure-u-md-2-12" >
            <button id="saveButton" className="button top-gutter margin-bottom" onClick={() => this.props.postManualOverride(this.props.history)}>Confirm allocation</button>
          </div> :
          <div className="font-small padding-top-large padding-bottom padding-left">No prisoners found</div>}
        <div className="pure-u-md-3-12">
          <button id="cancelButton" className="greyButton button-cancel top-gutter margin-bottom" onClick={() => this.props.onFinishAllocation(this.props.history)}>Cancel and return to menu</button>
        </div>
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
  onFinishAllocation: PropTypes.func.isRequired,
  postManualOverride: PropTypes.func.isRequired,
  loaded: PropTypes.bool
};

const OffenderResultsWithRouter = withRouter(OffenderResults);

export { OffenderResults };
export default OffenderResultsWithRouter;
