import React, { Component } from 'react';
import { properCaseName } from '../../stringUtils';
import { getOffenderLink } from "../../links";
import { getStaffLink } from "../../links";
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import OffenderSearchContainer from "../containers/OffenderSearchContainer";
import { renderDate } from '../../stringUtils';
import MessageBar from "../../MessageBar/index";

class OffenderResults extends Component {
  buildKeyworkerDisplay (staffId, keyworkerDisplay, numberAllocated) {
    if (keyworkerDisplay) {
      if (numberAllocated || numberAllocated === 0) {
        return keyworkerDisplay + ' (' + numberAllocated + ')';
      } else {
        return keyworkerDisplay;
      }
    } else {
      return staffId + ' (no details available)';
    }
  }

  getKeyworkerDisplay (staffId, keyworkerDisplay, numberAllocated) {
    if (staffId) {
      return <a className="link" href={getStaffLink(staffId)}>{this.buildKeyworkerDisplay(staffId, keyworkerDisplay, numberAllocated)}</a>;
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
      return (<tr key={a.offenderNo} className="row-gutters">
        <td className="row-gutters"><a target="_blank" className="link"
          href={getOffenderLink(a.offenderNo)}>{properCaseName(a.lastName)}, {properCaseName(a.firstName)}</a></td>
        <td className="row-gutters">{a.offenderNo}</td>
        <td className="row-gutters">{a.assignedLivingUnitDesc}</td>
        <td className="row-gutters">{renderDate(a.confirmedReleaseDate)}</td>
        <td className="row-gutters">{a.crsaClassification || "--"}</td>
        <td className="row-gutters">{this.getKeyworkerDisplay(a.staffId, a.keyworkerDisplay, a.numberAllocated)}
        </td>
        <td className="row-gutters">
          <select id={`keyworker-select-${a.offenderNo}`} name={`keyworker-select-${a.offenderNo}`}className="form-control" value={currentSelectValue}
            onChange={(event) => this.props.handleKeyworkerChange(event, index, a.offenderNo)}>
            <option key="choose" value="--">-- No change --</option>
            {a.staffId ? <option key="choose" value="_DEALLOCATE">-- Deallocate --</option> : ''}
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
        <MessageBar {...this.props}/>

        <div className="pure-g">
          {this.props.displayBack()}
          <div className="pure-u-md-7-12"><h1 className="heading-large margin-top">Manually allocate key workers</h1></div>
          <div className="pure-u-md-11-12-12"><OffenderSearchContainer {...this.props} /></div>
        </div>
        {this.props.offenderResults.partialResults &&
        <div id="partialResultsWarning" className="pure-u-md-9-12 font-small padding-top padding-bottom-large"><div className="pure-u-md-1-12"><img alt="" className="padding-left" src="/images/icon-important-2x.png" height="30" width="30"/></div><div className="pure-u-md-9-12 padding-top-small">The top {this.props.offenderResults.offenderResponse.length} results are displayed, please refine your search.</div></div>}
        <div className="padding-bottom-40">
          <table className="row-gutters">
            <thead>
              <tr>
                <th>Prisoner</th>
                <th>Prison no.</th>
                <th>Location</th>
                <th>Release date</th>
                <th>CSRA</th>
                <th>Key worker</th>
                <th>Assign new key worker</th>
              </tr>
            </thead>
            <tbody>{offenders}</tbody>
          </table>
        </div>
        {offenders.length > 0 ?
          <div className="pure-u-md-2-12" >
            <button id="saveButton" className="button" onClick={() => this.props.postManualOverride(this.props.history)}>Confirm allocation</button>
          </div> :
          <div className="font-small padding-bottom padding-left">No prisoners found</div>}
        <div className="pure-u-md-3-12">
          <button id="cancelButton" className="button greyButton button-cancel" onClick={() => this.props.onFinishAllocation(this.props.history)}>Cancel and return to menu</button>
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
  loaded: PropTypes.bool,
  displayBack: PropTypes.func.isRequired
};

const OffenderResultsWithRouter = withRouter(OffenderResults);

export { OffenderResults };
export default OffenderResultsWithRouter;
