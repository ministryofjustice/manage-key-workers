import React from 'react'
import PropTypes from 'prop-types'
import Header from '@govuk-react/header'
import moment from 'moment'
import { Form, Field } from 'react-final-form'

import { FilterStyled, DefaultText } from './Period.styles'
import Date from '../Components/Date'
import { switchToIsoDateFormat, renderDate } from '../stringUtils'
import { formInputType, formMetaType } from '../types'

const showPastDatesOnly = date => date && date.isBefore(moment().subtract(1, 'days'))

const DateAdapter = ({ input, meta, ...rest }) => (
  <Date
    {...input}
    {...rest}
    shouldShowDay={showPastDatesOnly}
    onChange={value => input.onChange(value)}
    onBlur={event => input.onBlur(event)}
    meta={meta}
    errorText={meta.error ? meta.error : ''}
  />
)

const validate = values => {
  const errors = {}
  const fromDate = switchToIsoDateFormat(values.fromDate)
  const toDate = switchToIsoDateFormat(values.toDate)

  if (moment(toDate).isBefore(fromDate)) errors.toDate = 'Date must be after From'

  return errors
}

const Period = ({ fromDate, toDate, onSubmit }) => (
  <Form
    onSubmit={onSubmit}
    initialValues={{ fromDate: renderDate(fromDate), toDate: renderDate(toDate) }}
    validate={validate}
    render={({ handleSubmit, pristine, invalid }) => (
      <form onSubmit={handleSubmit}>
        <Header level={3} size="SMALL">
          Select date range to view
        </Header>
        <FilterStyled>
          <Field name="fromDate" component={DateAdapter} title="From" />
          <Field name="toDate" component={DateAdapter} title="To" />
          <button type="submit" className="button greyButton" disabled={pristine || invalid}>
            Update
          </button>
        </FilterStyled>
        <DefaultText>The default is the last calendar month.</DefaultText>
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
