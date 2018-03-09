import React, { Component } from 'react';
import { properCaseName } from "../../stringUtils";
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

class KeyworkerProfile extends Component {
  render () {
    const keyworkerDisplayName = properCaseName(this.props.keyworker.firstName) + ' ' + properCaseName(this.props.keyworker.lastName);
    const keyworkerOptions = this.props.keyworkerList.map((kw, optionIndex) => {
      return <option key={`option_${optionIndex}_${kw.staffId}`} value={kw.staffId}>{kw.lastName}, {kw.firstName} ({kw.numberAllocated})</option>;
    });
    const allocations = this.props.keyworkerAllocations.map((a, index) => {
      const currentSelectValue = this.props.keyworkerChangeList[index] ? this.props.keyworkerChangeList[index].staffId : '';
      let confirmedReleaseDate = a.confirmedReleaseDate;
      if (confirmedReleaseDate == null) {
        confirmedReleaseDate = "--";
      }
      let crsaClassification = a.crsaClassification;
      if (crsaClassification == null) {
        crsaClassification = "--";
      }

      const formattedName = properCaseName(a.lastName) + ', ' + properCaseName(a.firstName);
      return (
        <tr key={a.bookingId}>
          <td className="row-gutters"><a href="">{formattedName}</a></td>
          <td className="row-gutters">{a.offenderNo}</td>
          <td className="row-gutters">{a.internalLocationDesc}</td>
          <td className="row-gutters">{confirmedReleaseDate}</td>
          <td className="row-gutters">{crsaClassification}</td>
          <td className="row-gutters">

            <select id={`keyworker-select-${a.bookingId}`} className="form-control" value={currentSelectValue}
              onChange={(event) => this.props.handleKeyworkerChange(event, index, a.bookingId)}>
              <option key="choose" value="--">-- Select --</option>
              {keyworkerOptions.filter(e => e.props.value !== this.props.keyworker.staffId)}
            </select>
          </td>
        </tr>
      );
    });

    let renderContent = null;
    if (this.props.keyworkerAllocations.length > 0) {
      renderContent = (<div>
        <div className="lede padding-top padding-bottom-large">Current key worker allocations {this.props.keyworkerAllocations.length}</div>
        <div className="pure-u-md-8-12">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Prison no.</th>
                <th>Location</th>
                <th>CRD</th>
                <th>CSRA</th>
                <th>Assign to new key worker</th>
              </tr>
            </thead>
            <tbody>{allocations}</tbody>
          </table>
          <button id="updateAllocationButton" className="button top-gutter pure-u-md-5-24" onClick={() => this.props.handleAllocationChange(this.props.history)}>Update keyworker allocation</button>
        </div>
      </div>
      );
    } else {
      renderContent = (<div className="lede padding-top-large padding-bottom">No allocations found</div>);
    }


    return (
      <div>
        <div className="pure-g padding-top">
          <div className="pure-u-md-8-12 padding-top">
            <Link id={`search_again_link`} title="Search again link" className="link" to="/home" >&lt; Back to menu</Link>
            <h1 className="heading-large">Profile for {keyworkerDisplayName}</h1>
          </div>
          <div className="padding-top">
            <div className="pure-u-md-2-12" >
              <label className="form-label" htmlFor="name">Establishment</label>
              <div className="bold">todo - API work</div>
            </div>
            <div className="pure-u-md-2-12" >
              <label className="form-label" htmlFor="name">Schedule type</label>
              <div className="bold">todo - API work</div>
            </div>
            <div className="pure-u-md-2-12" >
              <label className="form-label" htmlFor="name">Capacity</label>
              <div className="bold">todo - API work</div>
            </div>
            <div className="pure-u-md-4-12" >
              <label className="form-label" htmlFor="name">Status</label>
              <div className="unavailableStatus">Unavailable - no prisoner contact</div>
            </div>

            <div className="pure-u-md-2-12" >
              <button id="editProfileButton" className="button" onClick={() => this.props.handleEditProfileClick(this.props.history)}>Edit profile</button>
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
  handleEditProfileClick: PropTypes.func.isRequired
};


export default KeyworkerProfile;
