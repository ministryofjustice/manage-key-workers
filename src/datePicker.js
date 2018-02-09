import React, { Component } from 'react';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';

class DatePicker extends Component {
  constructor () {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.renderInput = this.renderInput.bind(this);
  }

  handleChange (date) {
    this.props.handleDateFilterChange(date, this.props.name);
  }

  renderInput (props) {
    return (
      <div>
        <input className={this.props.className} name={this.props.name} {...props} readOnly/>
      </div>
    );
  }

  render () {
    const { title, shouldShowDay } = this.props;

    return (
      <div className="date-picker-component">
        <div className="form-group">

          <label className="form-label">
            {title}
          </label>

          <Datetime
            className=""
            onChange={this.handleChange}
            timeFormat={false}
            isValidDate={shouldShowDay}
            locale="en-GB"
            dateFormat={"DD/MM/YYYY"}
            closeOnSelect
            strictParsing
            {... this.props}
            renderInput={this.renderInput}
          />

        </div>
      </div>);
  }
}

export default DatePicker;
