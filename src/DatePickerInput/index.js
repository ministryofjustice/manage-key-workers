import React, { Component } from 'react';
import DatePicker from './datePicker';
import moment from 'moment';
import PropTypes from 'prop-types';

class DatePickerInput extends Component {
  render () {
    const { additionalClassName, handleDateChange } = this.props;

    return (<DatePicker
      inputProps={{ className: `datePickerInput form-control ${additionalClassName}` }}
      name="date"
      shouldShowDay={(date) => !date.isBefore(moment().add(1, 'days').startOf('day'))}
      title="Date" {...this.props}
      handleDateChange={handleDateChange}
    />);
  }
}

DatePickerInput.propTypes = {
  history: PropTypes.object,
  date: PropTypes.string,
  dateId: PropTypes.string,
  additionalClassName: PropTypes.string,
  handleDateChange: PropTypes.func.isRequired
};
export default DatePickerInput;
