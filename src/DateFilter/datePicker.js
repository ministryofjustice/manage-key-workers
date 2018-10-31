import React, { Component } from 'react'
import Datetime from 'react-datetime'
import 'react-datetime/css/react-datetime.css'
import PropTypes from 'prop-types'

class DatePicker extends Component {
  constructor() {
    super()
    this.handleChange = this.handleChange.bind(this)
    this.renderInput = this.renderInput.bind(this)
  }

  handleChange(date) {
    const { handleDateFilterChange, name } = this.props
    handleDateFilterChange(date, name)
  }

  renderInput(props) {
    const { className, name } = this.props

    return (
      <div>
        <input className={className} name={name} {...props} readOnly />
      </div>
    )
  }

  render() {
    const { title, shouldShowDay } = this.props

    return (
      <div className="date-picker-component">
        <div className="form-group">
          <label className="form-label">{title}</label>

          <Datetime
            className=""
            onChange={this.handleChange}
            timeFormat={false}
            isValidDate={shouldShowDay}
            locale="en-GB"
            dateFormat="DD/MM/YYYY"
            closeOnSelect
            strictParsing
            {...this.props}
            renderInput={this.renderInput}
          />
        </div>
      </div>
    )
  }
}

DatePicker.propTypes = {
  handleDateFilterChange: PropTypes.func.isRequired,
  shouldShowDay: PropTypes.func.isRequired,
  className: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
}

export default DatePicker
