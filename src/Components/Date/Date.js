import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Datetime from 'react-datetime'
import LabelText from '@govuk-react/label-text'
import ErrorText from '@govuk-react/error-text'
import { DateContainer, DateInput } from './Date.styles'
import 'react-datetime/css/react-datetime.css'

class Date extends Component {
  renderInput = props => <DateInput {...props} readOnly />

  render() {
    const { title, shouldShowDay, name, value, onChange, errorText, onBlur } = this.props

    return (
      <DateContainer error={errorText}>
        <LabelText>{title}</LabelText>
        {errorText && <ErrorText>{errorText}</ErrorText>}
        <Datetime
          className={name}
          onChange={onChange}
          onBlur={onBlur}
          timeFormat={false}
          dateFormat="DD/MM/YYYY"
          locale="en-GB"
          isValidDate={shouldShowDay}
          closeOnSelect
          strictParsing
          renderInput={this.renderInput}
          value={value}
          inputProps={{ id: name, name, title, error: errorText }}
        />
      </DateContainer>
    )
  }
}

Date.propTypes = {
  title: PropTypes.string.isRequired,
  shouldShowDay: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  errorText: PropTypes.string,
}

Date.defaultProps = {
  errorText: '',
}

export default Date
