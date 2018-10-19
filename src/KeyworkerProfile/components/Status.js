import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getStatusDescription } from "../keyworkerStatus";

class Status extends Component {
  render () {
    const { statusValue, handleStatusChange, filter } = this.props;
    
    return (<select id="status-select" name="status-select" className="form-control"
      value={statusValue}
      onChange={handleStatusChange}>
      {/* When this is used for a filter we need an 'all' option*/}
      {filter && <option key="" value="">All</option>}
      <option key="ACTIVE" value="ACTIVE">{getStatusDescription('ACTIVE')}</option>
      <option key="UNAVAILABLE_ANNUAL_LEAVE"
        value="UNAVAILABLE_ANNUAL_LEAVE">{getStatusDescription('UNAVAILABLE_ANNUAL_LEAVE')}</option>
      <option key="UNAVAILABLE_LONG_TERM_ABSENCE"
        value="UNAVAILABLE_LONG_TERM_ABSENCE">{getStatusDescription('UNAVAILABLE_LONG_TERM_ABSENCE')}</option>
      <option key="UNAVAILABLE_NO_PRISONER_CONTACT"
        value="UNAVAILABLE_NO_PRISONER_CONTACT">{getStatusDescription('UNAVAILABLE_NO_PRISONER_CONTACT')}</option>
      <option key="INACTIVE" value="INACTIVE">{getStatusDescription('INACTIVE')}</option>
    </select>);
  }
}

Status.propTypes = {
  handleStatusChange: PropTypes.func.isRequired,
  statusValue: PropTypes.string,
  filter: PropTypes.bool
};

export default Status;
