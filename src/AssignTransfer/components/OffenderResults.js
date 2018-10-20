import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { properCaseName } from "../../stringUtils";
import { getOffenderLink, getStaffLink, getKeyWorkerHistoryLink } from "../../links";
import OffenderSearch from "./OffenderSearch";
import { renderDate } from "../../stringUtils";
import MessageBar from "../../MessageBar/index";

class OffenderResults extends Component {
  constructor() {
    super();
    this.buttons = this.buttons.bind(this);
  }

  getKeyworkerDisplay(staffId, keyworkerDisplay, numberAllocated) {
    if (staffId) {
      return (
        <a className="link" href={getStaffLink(staffId)}>
          {this.buildKeyworkerDisplay(staffId, keyworkerDisplay, numberAllocated)}
        </a>
      );
    } 
      return <strong className="bold-xsmall">Not allocated</strong>;
    
  }

  buildKeyworkerDisplay(staffId, keyworkerDisplay, numberAllocated) {
    if (keyworkerDisplay) {
      if (numberAllocated || numberAllocated === 0) {
        return keyworkerDisplay + " (" + numberAllocated + ")";
      } 
        return keyworkerDisplay;
      
    } 
      return staffId + " (no details available)";
    
  }

  buildTableForRender(keyworkerOptions, offenderList) {
    const { keyworkerChangeList, user, handleKeyworkerChange } = this.props;
    if (!(offenderList && offenderList.map)) {
      return [];
    }
    return offenderList.map((a, index) => {
      const currentSelectValue =
        keyworkerChangeList && keyworkerChangeList[index] ? keyworkerChangeList[index].staffId : "";
      return (
        <tr key={a.offenderNo} className="row-gutters">
          <td className="row-gutters">
            <a target="_blank" className="link" href={getOffenderLink(a.offenderNo)}>
              {properCaseName(a.lastName)}, {properCaseName(a.firstName)}
            </a>
          </td>
          <td className="row-gutters">{a.offenderNo}</td>
          <td className="row-gutters">{a.assignedLivingUnitDesc}</td>
          <td className="row-gutters">{renderDate(a.confirmedReleaseDate)}</td>
          <td className="row-gutters">{a.crsaClassification || "--"}</td>
          <td className="row-gutters">
            {this.getKeyworkerDisplay(a.staffId, a.keyworkerDisplay, a.numberAllocated)}
          </td>
          <td>
            <a className="link" target="_blank" href={getKeyWorkerHistoryLink(a.offenderNo)}>
              View
            </a>
          </td>
          <td className="row-gutters">
            <select
              disabled={!user || !user.writeAccess}
              id={`keyworker-select-${a.offenderNo}`}
              name={`keyworker-select-${a.offenderNo}`}
              className="form-control"
              value={currentSelectValue}
              onChange={event => handleKeyworkerChange(event, index, a.offenderNo)}
            >
              <option key="choose" value="--">
                -- No change --
              </option>
              {a.staffId ? (
                <option key="deallocate" value="_DEALLOCATE">
                  -- Deallocate --
                </option>
              ) : (
                ""
              )}
              {keyworkerOptions.filter(e => e.props.value !== a.staffId)}
            </select>
          </td>
        </tr>
      );
    });
  }

  buttons(rows) {
    const { user, postManualOverride, onFinishAllocation, history } = this.props;

    if (!user || !user.writeAccess) return <div />;

    return (
      <div>
        {rows > 0 && (
          <button
            type="button"
            className="button button-save"
            onClick={() => postManualOverride(history)}
          >
            Confirm
          </button>
        )}
        <button
          type="button"
          className="button greyButton button-cancel margin-left"
          onClick={() => onFinishAllocation(history)}
        >
          Cancel
        </button>
      </div>
    );
  }

  render() {
    const { offenderResults, loaded, displayBack } = this.props;

    if (!offenderResults || !loaded) return "";

    const keyworkerOptions = offenderResults.keyworkerResponse
      ? offenderResults.keyworkerResponse.map((kw, optionIndex) => {
          const formattedDetails = `${properCaseName(kw.lastName)}, ${properCaseName(
            kw.firstName
          )} (${kw.numberAllocated})`;
          return (
            <option key={`option_${optionIndex}_${kw.staffId}`} value={kw.staffId}>
              {formattedDetails}
            </option>
          );
        })
      : [];
    const offenders = this.buildTableForRender(keyworkerOptions, offenderResults.offenderResponse);

    return (
      <div>
        <MessageBar {...this.props} />

        <div className="pure-g">
          {displayBack()}
          <div className="pure-u-md-7-12">
            <h1 className="heading-large margin-top">Change key workers</h1>
          </div>
          <div className="pure-u-md-11-12-12">
            <OffenderSearch {...this.props} />
          </div>
        </div>
        {offenderResults.partialResults && (
          <div
            id="partialResultsWarning"
            className="pure-u-md-9-12 font-small padding-top padding-bottom-large"
          >
            <div className="pure-u-md-1-12">
              <span className="padding-left">
                <img
                  alt="Warning icon"
                  src="/images/icon-important-2x.png"
                  height="30"
                  width="30"
                />
              </span>
            </div>
            <div className="pure-u-md-9-12 padding-top-small">
              The top {offenderResults.offenderResponse.length} results are displayed, please refine
              your search.
            </div>
          </div>
        )}
        {offenders.length >= 20 && (
          <div className="padding-top">{this.buttons(offenders.length)}</div>
        )}
        <div className="padding-bottom-40 padding-top">
          <table className="row-gutters">
            <thead>
              <tr>
                <th>Prisoner</th>
                <th>Prison no.</th>
                <th>Location</th>
                <th>Release date</th>
                <th>CSRA</th>
                <th>
                  Current <br />
                  Key worker
                </th>
                <th>
                  Key worker
                  <br />
                  History
                </th>
                <th>Assign new key worker</th>
              </tr>
            </thead>
            <tbody>
              {offenders.length > 0 ? (
                offenders
              ) : (
                <div className="font-small padding-top padding-left">No prisoners found</div>
              )}
            </tbody>
          </table>
        </div>
        {this.buttons(offenders.length)}
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
  displayBack: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
};

const OffenderResultsWithRouter = withRouter(OffenderResults);

export { OffenderResults };
export default OffenderResultsWithRouter;
