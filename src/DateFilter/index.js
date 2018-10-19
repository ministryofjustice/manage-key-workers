import React from "react";
import moment from "moment";
import PropTypes from "prop-types";
import DatePicker from "./datePicker";

const DateFilter = props => {
  const { fromDate, toDate, applyDateFilter, history } = props;

  return (
    <div className="pure-g padding-top-large padding-left">
      <h3 className="heading-small">Select date range to view</h3>

      <div className="pure-u-md-4-12">
        <DatePicker
          inputProps={{ placeholder: fromDate, className: "dateFilterInput form-control" }}
          name="fromDate"
          shouldShowDay={date => date.isBefore(moment())}
          title="From"
          {...props}
        />
      </div>
      <div className="pure-u-md-4-12">
        <DatePicker
          inputProps={{ placeholder: toDate, className: "dateFilterInput form-control" }}
          name="toDate"
          shouldShowDay={date => date.isBefore(moment())}
          title="To"
          {...props}
        />
      </div>
      <div className="pure-u-md-3-12">
        <button
          type="button"
          className="button top-gutter-large"
          onClick={() => applyDateFilter(history)}
        >
          Filter
        </button>
      </div>
    </div>
  );
};

DateFilter.propTypes = {
  keyworkerList: PropTypes.array,
  history: PropTypes.object,
  toDate: PropTypes.string,
  fromDate: PropTypes.string,
  applyDateFilter: PropTypes.func.isRequired
};

export default DateFilter;
