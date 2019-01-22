import React, { Component, Fragment } from 'react'
import Datetime from 'react-datetime'
import 'react-datetime/css/react-datetime.css'
import PropTypes from 'prop-types'

class DatePicker extends Component {
  constructor() {
    super()
    this.renderInput = this.renderInput.bind(this)
  }

  renderInput(props) {
    const { inputId, className, name, title } = this.props

    return (
      <Fragment>
        <label htmlFor={name} className="form-label">
          {title}
        </label>
        <input id={inputId} className={className} name={name} {...props} />
      </Fragment>
    )
  }

  render() {
    const { shouldShowDay, handleDateChange } = this.props

    return (
      <Datetime
        className=""
        onChange={handleDateChange}
        timeFormat={false}
        isValidDate={shouldShowDay}
        locale="en-GB"
        dateFormat="DD/MM/YYYY"
        closeOnSelect
        strictParsing
        {...this.props}
        renderInput={this.renderInput}
      />
    )
  }
}

DatePicker.propTypes = {
  handleDateChange: PropTypes.func.isRequired,
  shouldShowDay: PropTypes.func.isRequired,
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  inputId: PropTypes.string.isRequired,
}

DatePicker.defaultProps = {
  className: null,
}

export default DatePicker
