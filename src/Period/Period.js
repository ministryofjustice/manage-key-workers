import React from 'react'
import PropTypes from 'prop-types'
import { H3 } from '@govuk-react/heading'
import moment from 'moment'
import { Form, Field } from 'react-final-form'

import { FilterStyled } from './Period.styles'
import Date from '../Components/Date'
import { switchToIsoDateFormat, renderDate } from '../stringUtils'
import { formInputType, formMetaType } from '../types'

const showPastDatesOnly = (date) => date && date.isBefore(moment().startOf('day'))

const DateAdapter = ({ input, meta, ...rest }) => (
  <Date
    {...input}
    {...rest}
    shouldShowDay={showPastDatesOnly}
    onChange={(value) => input.onChange(value)}
    onBlur={(event) => input.onBlur(event)}
    meta={meta}
    errorText={meta.touched ? meta.error : ''}
  />
)

const validate = (values) => {
  const errors = {}
  const fromDate = switchToIsoDateFormat(values.fromDate)
  const toDate = switchToIsoDateFormat(values.toDate)

  if (moment(toDate).isBefore(fromDate)) {
    errors.fromDate = 'Date must be before To'
    errors.toDate = 'Date must be after From'
  }

  return errors
}

const Period = ({ fromDate, toDate, onSubmit }) => (
  <Form
    onSubmit={onSubmit}
    initialValues={{ fromDate: renderDate(fromDate), toDate: renderDate(toDate) }}
    validate={validate}
    render={({ handleSubmit, pristine, invalid }) => (
      <form onSubmit={handleSubmit}>
        <H3 size="SMALL">Select a date range to view</H3>
        <FilterStyled>
          <Field name="fromDate" component={DateAdapter} title="From" />
          <Field name="toDate" component={DateAdapter} title="To" />
          <button type="submit" className="button greyButton" disabled={pristine || invalid}>
            View
          </button>
        </FilterStyled>
      </form>
    )}
  />
)

DateAdapter.propTypes = {
  input: formInputType.isRequired,
  meta: formMetaType.isRequired,
}

Period.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  fromDate: PropTypes.string.isRequired,
  toDate: PropTypes.string.isRequired,
}

export default Period
