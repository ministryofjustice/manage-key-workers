import React from 'react'
import PropTypes from 'prop-types'
import Input from '@govuk-react/input'
import Select from '@govuk-react/select'
import Header from '@govuk-react/header'

import FilterStyled from './Period.styles'

const Period = ({ duration, period, onInputChange, onButtonClick }) => (
  <form>
    <Header level={3} size="SMALL">
      Select period to view
    </Header>
    <FilterStyled>
      <Input
        name="duration"
        data-qa="keyworker-dashboard-duration"
        value={duration}
        onChange={e => onInputChange({ period, duration: e.target.value })}
      />
      <Select
        name="period"
        data-qa="keyworker-dashboard-period"
        input={{
          value: period,
          onChange: e => onInputChange({ duration, period: e.target.value }),
        }}
      >
        <option value="week">Weekly</option>
        <option value="month">Monthly</option>
        <option value="year">Yearly</option>
      </Select>

      <button type="submit" className="button greyButton" onClick={() => onButtonClick({ duration, period })}>
        Update
      </button>
    </FilterStyled>
  </form>
)
Period.propTypes = {
  onButtonClick: PropTypes.func.isRequired,
  onInputChange: PropTypes.func.isRequired,
  duration: PropTypes.number.isRequired,
  period: PropTypes.string.isRequired,
}

export default Period
