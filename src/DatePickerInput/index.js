import React from 'react'
import moment from 'moment'
import PropTypes from 'prop-types'
import DatePicker from './datePicker'

const DatePickerInput = props => {
  const { additionalClassName, handleDateChange, customValidation, title } = props
  const validation = date => {
    if (customValidation) return customValidation(date)

    return !date.isBefore(
      moment()
        .add(1, 'days')
        .startOf('day')
    )
  }

  return (
    <DatePicker
      inputProps={{ className: `datePickerInput form-control ${additionalClassName}` }}
      name="date"
      shouldShowDay={validation}
      title={title}
      handleDateChange={handleDateChange}
      {...props}
    />
  )
}

DatePickerInput.propTypes = {
  additionalClassName: PropTypes.string,
  handleDateChange: PropTypes.func.isRequired,
  customValidation: PropTypes.func,
  title: PropTypes.string,
}

DatePickerInput.defaultProps = {
  additionalClassName: '',
  customValidation: null,
  title: 'Date',
}
export default DatePickerInput
