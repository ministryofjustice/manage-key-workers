import React, { Component } from 'react';
import { properCaseName, renderDate } from "../../stringUtils";
import PropTypes from 'prop-types';
import MessageBar from "../../MessageBar/index";
import { getStatusStyle, getStatusDescription } from "../keyworkerStatus";
import { getOffenderLink } from "../../links";

class KeyworkerProfile extends Component {
  constructor (props) {
    super();
    this.goBack = this.goBack.bind(this);
  }

  goBack (e) {
    e.preventDefault();
    window.history.back();
  }

  getAllocationStyle () {
    let allocationStyleClass = 'numberCircleGreen';
    if (this.props.keyworkerAllocations.length === 0) {
      allocationStyleClass = 'numberCircleGrey';
    } else if (this.props.keyworkerAllocations.length === this.props.keyworker.capacity) {
      allocationStyleClass = 'numberCircleAmber';
    } else if (this.props.keyworkerAllocations.length > this.props.keyworker.capacity) {
      allocationStyleClass = 'numberCircleRed';
    }
    return allocationStyleClass;
  }

  render () {
    const keyworkerDisplayName = properCaseName(this.props.keyworker.firstName) + ' ' + properCaseName(this.props.keyworker.lastName);
    const statusStyle = getStatusStyle(this.props.keyworker.status);
    const keyworkerOptions = this.props.keyworkerList.map((kw, optionIndex) => {
      const formattedDetails = `${properCaseName(kw.lastName)}, ${properCaseName(kw.firstName)} (${kw.numberAllocated})`;
      return <option key={`option_${optionIndex}_${kw.staffId}`} value={kw.staffId}>{formattedDetails}</option>;
    });
    const allocations = this.props.keyworkerAllocations.map((a, index) => {
      const currentSelectValue = this.props.keyworkerChangeList[index] ? this.props.keyworkerChangeList[index].staffId : '';
      const formattedName = properCaseName(a.lastName) + ', ' + properCaseName(a.firstName);
      return (
        <tr key={a.offenderNo}>
          <td className="row-gutters"><a target="_blank" className="link" href={getOffenderLink(a.offenderNo)}>{formattedName}</a></td>
          <td className="row-gutters">{a.offenderNo}</td>
          <td className="row-gutters">{a.internalLocationDesc}</td>
          <td className="row-gutters">{renderDate(a.confirmedReleaseDate)}</td>
          <td className="row-gutters">{a.crsaClassification || '--'}</td>
          <td className="row-gutters">{renderDate(a.lastKeyWorkerSessionDate)}</td>
          <td className="row-gutters">

            <select id={`keyworker-select-${a.offenderNo}`} className="form-control" value={currentSelectValue}
              onChange={(event) => this.props.handleKeyworkerChange(event, index, a.offenderNo)}>
              <option key="choose" value="--">Choose key worker</option>
              {keyworkerOptions.filter(e => e.props.value !== this.props.keyworker.staffId)}
            </select>
          </td>
        </tr>
      );
    });

    let renderContent = null;
    const allocationCountStyle = this.getAllocationStyle();

    renderContent = (<div>
      <div className="lede padding-top padding-bottom-large bold">Current allocations <div id="allocationCount" className={allocationCountStyle}><div className="adjustCount">{this.props.keyworkerAllocations.length}</div></div></div>
      <div className="pure-u-md-12-12">
        <div className="padding-bottom-40">
          <table>
            <thead>
              <tr>
                <th>Prisoner</th>
                <th>Prison no.</th>
                <th>Location</th>
                <th>Release date</th>
                <th>CSRA</th>
                <th>Last key<br/>worker activity</th>
                <th>Allocate to new key worker</th>
              </tr>
            </thead>
            <tbody>{allocations}</tbody>
          </table>
        </div>
        {this.props.keyworkerAllocations.length > 0 && <button id="updateAllocationButton" className="button pure-u-md-5-24" onClick={() => this.props.handleAllocationChange(this.props.history)}>Update keyworker allocation</button>}
      </div>
    </div>
    );

    return (
      <div>
        <MessageBar {...this.props}/>
        <div className="pure-g padding-bottom-large">
          <div className="pure-u-md-8-12 padding-top">
            <a href="#" title="Back link" className="link backlink" onClick={this.goBack} >
              <img className="back-triangle" src="/images/BackTriangle.png" alt="" width="6" height="10"/> Back</a>
            <h1 className="heading-large margin-top">Key worker: {keyworkerDisplayName}</h1>
          </div>
          <div className="padding-top">
            <div className="pure-u-md-5-12">
              <div className="pure-u-md-5-12" >
                <label className="form-label" htmlFor="name">Establishment</label>
                <div className="bold padding-top-small">{this.props.keyworker.agencyDescription}</div>
              </div>
              <div className="pure-u-md-4-12" >
                <label className="form-label" htmlFor="name">Schedule type</label>
                <div className="bold padding-top-small">{this.props.keyworker.scheduleType}</div>
              </div>
              <div className="pure-u-md-1-12" >
                <label className="form-label" htmlFor="name">Capacity</label>
                <div className="bold padding-top-small">{this.props.keyworker.capacity}</div>
              </div>
            </div>
            <div className="pure-u-md-7-12">
              <div className="pure-u-md-6-12" >
                <label className="form-label" htmlFor="name">Status</label>
                <div id="keyworker-status" className={`${statusStyle}Status`}>{getStatusDescription(this.props.keyworker.status)}</div>
              </div>
              {(this.props.keyworker.status === 'UNAVAILABLE_ANNUAL_LEAVE') && (<div className="pure-u-md-3-12 activeDate" >
                <label className="form-label" htmlFor="name">Return date</label>
                <div className="bold padding-top-small" id="active-date">{renderDate(this.props.keyworker.activeDate)}</div>
              </div>)}
              <div className="pure-u-md-3-12 right-content" >
                <button id="editProfileButton" className="button blueButton" onClick={() => this.props.handleEditProfileClick(this.props.history)}>Edit profile</button>
              </div>
            </div>
          </div>
          <hr/>
          {renderContent}
        </div>
      </div>
    );
  }
}

KeyworkerProfile.propTypes = {
  history: PropTypes.object,
  keyworkerAllocations: PropTypes.array,
  keyworker: PropTypes.object.isRequired,
  keyworkerList: PropTypes.array,
  keyworkerChangeList: PropTypes.array,
  handleAllocationChange: PropTypes.func.isRequired,
  handleKeyworkerChange: PropTypes.func.isRequired,
  handleEditProfileClick: PropTypes.func.isRequired,
  message: PropTypes.string,
  loaded: PropTypes.bool
};


export default KeyworkerProfile;
