import React from 'react'
import PropTypes from 'prop-types'
import Header from '@govuk-react/header'
import moment from 'moment'
import { switchToIsoDateFormat, renderDate } from '../stringUtils'

import { FilterStyled, DefaultText } from './Period.styles'
import DatePickerInput from '../DatePickerInput'

const Period = ({ fromDate, toDate, onInputChange, onButtonClick }) => {
  const showPastDatesOnly = date => date && date.isBefore(moment().subtract(1, 'days'))

  return (
    <form>
      <Header level={3} size="SMALL">
        Select date range to view
      </Header>
      <FilterStyled>
        <DatePickerInput
          handleDateChange={selectedDate => onInputChange({ fromDate: switchToIsoDateFormat(selectedDate), toDate })}
          defaultValue={renderDate(fromDate)}
          inputId="keyWorkerStatsFromDate"
          customValidation={showPastDatesOnly}
          className="from-date-picker"
          title="From"
        />

        <DatePickerInput
          handleDateChange={selectedDate => onInputChange({ fromDate, toDate: switchToIsoDateFormat(selectedDate) })}
          defaultValue={renderDate(toDate)}
          inputId="keyWorkerStatsToDate"
          customValidation={showPastDatesOnly}
          className="to-date-picker"
          title="To"
        />

        <button type="submit" className="button greyButton" onClick={() => onButtonClick({ fromDate, toDate })}>
          Update
        </button>
      </FilterStyled>
      <DefaultText>The default is the last calendar month.</DefaultText>
    </form>
  )
}

Period.propTypes = {
  onButtonClick: PropTypes.func.isRequired,
  onInputChange: PropTypes.func.isRequired,
  fromDate: PropTypes.string.isRequired,
  toDate: PropTypes.string.isRequired,
}

export default Period
