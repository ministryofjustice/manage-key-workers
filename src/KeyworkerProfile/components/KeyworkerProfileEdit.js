import React, { Component } from 'react';
import { properCaseName } from "../../stringUtils";
import PropTypes from 'prop-types';

class KeyworkerProfileEdit extends Component {
  render () {
    const keyworkerDisplayName = properCaseName(this.props.keyworker.firstName) + ' ' + properCaseName(this.props.keyworker.lastName);
    const statusValue = this.props.status || this.props.keyworker.status;
    const statusSelect = (
      <div>
        <label className="form-label" htmlFor="status-select">Status</label>
        <select id="status-select" name="status-select" className="form-control"
          value={statusValue}
          onChange={this.props.handleStatusChange}>
          <option key="choose" value="">-- Select --</option>
          <option key="ACTIVE" value="ACTIVE">Active</option>
          <option key="INACTIVE" value="INACTIVE">Inactive</option>
          <option key="UNAVAILABLE_ANNUAL_LEAVE" value="UNAVAILABLE_ANNUAL_LEAVE">Unavailable - annual leave</option>
          <option key="UNAVAILABLE_LONG_TERM_ABSENCE" value="UNAVAILABLE_LONG_TERM_ABSENCE">Unavailable - long term absence</option>
          <option key="UNAVAILABLE_NO_PRISONER_CONTACT" value="UNAVAILABLE_NO_PRISONER_CONTACT">Unavailable - no prisoner contact</option>
          <option key="UNAVAILABLE_SUSPENDED" value="UNAVAILABLE_SUSPENDED">Unavailable - suspended</option>
        </select></div>);

    return (
      <div>
        <div className="pure-g padding-top">
          <div className="pure-u-md-8-12 padding-top">
            <h1 className="heading-large">Edit profile</h1>
          </div>
          <div className="padding-top">
            <div className="pure-u-md-2-12" >
              <label className="form-label" htmlFor="name">Name</label>
              <div className="bold padding-top-small">{keyworkerDisplayName}</div>
            </div>
            <div className="pure-u-md-2-12" >
              <label className="form-label" htmlFor="name">Establishment</label>
              <div className="bold padding-top-small">{this.props.keyworker.agencyDescription}</div>
            </div>
            <div className="pure-u-md-2-12" >
              <label className="form-label" htmlFor="name">Schedule type</label>
              <div className="bold padding-top-small">{this.props.keyworker.scheduleType}</div>
            </div>
            <div className="pure-u-md-1-12" >
              <label className="form-label" htmlFor="name">Capacity</label>
              <div>
                <input type="text" className="form-control capacityInput" id="capacity" name="capacity" value={this.props.capacity} onChange={this.props.handleCapacityChange}/>
              </div>
            </div>
            <div className="pure-u-md-3-12" >
              {statusSelect}
            </div>

          </div>
          <div className="pure-u-md-8-12 padding-top-large margin-top" >
            <div className="pure-u-md-3-12" >
              <button id="saveButton" className="button" onClick={() => this.props.handleSaveChanges(this.props.history)}>Save changes</button>
            </div>
            <div className="pure-u-md-2-12">
              <button id="cancelButton" className="button button-cancel" onClick={() => this.props.handleCancel(this.props.history)}>Cancel</button>
            </div>
          </div>
        </div>
      </div>

    );
  }
}

KeyworkerProfileEdit.propTypes = {
  history: PropTypes.object,
  keyworker: PropTypes.object.isRequired,
  handleSaveChanges: PropTypes.func.isRequired,
  handleStatusChange: PropTypes.func.isRequired,
  handleCapacityChange: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  status: PropTypes.string,
  capacity: PropTypes.string,
  keyworkerStatus: PropTypes.string
};


export default KeyworkerProfileEdit;
