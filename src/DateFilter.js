import React, { Component } from 'react';
import DatePicker from './datePicker';
import moment from 'moment';
import PropTypes from 'prop-types';

class DateFilter extends Component {
  render () {
    return (
      <div className="pure-g padding-top-large padding-left">
        <h3 className="heading-small">Select date range to view</h3>

        <div className="pure-u-md-4-12"><DatePicker inputProps={{ placeholder: this.props.fromDate, className: 'dateFilterInput form-control' }} name="fromDate" shouldShowDay={(date) => date.isBefore(moment())} title="From" {...this.props} /></div>
        <div className="pure-u-md-4-12"><DatePicker inputProps={{ placeholder: this.props.toDate, className: 'dateFilterInput form-control' }} name="toDate" shouldShowDay={(date) => date.isBefore(moment())} title="To" {...this.props} /></div>
        <div className="pure-u-md-3-12"><button className="button top-gutter-large" onClick={() => this.props.applyDateFilter(this.props.history)}>Filter</button></div>
      </div>

    );
  }
}

DateFilter.propTypes = {
  keyworkerList: PropTypes.array,
  history: PropTypes.object,
  toDate: PropTypes.string,
  fromDate: PropTypes.string
};
export default DateFilter;
