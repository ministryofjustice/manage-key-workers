import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Input from '@govuk-react/input'
import Select from '@govuk-react/select'
import Header from '@govuk-react/header'

import FilterStyled from './Period.styles'

class Period extends Component {
  constructor(props) {
    super(props)
    this.state = {
      period: props.defaultPeriod,
      duration: props.defaultDuration,
    }
  }

  render() {
    const { onButtonClick, defaultDuration, defaultPeriod } = this.props
    const { duration, period } = this.state

    return (
      <div>
        <Header level={3} size="SMALL">
          Select period to view
        </Header>
        <FilterStyled>
          <Input
            name="duration"
            value={duration || defaultDuration}
            onChange={e =>
              this.setState({
                period,
                duration: Number(e.target.value),
              })
            }
          />
          <Select
            name="period"
            input={{
              value: period || defaultPeriod,
              onChange: e =>
                this.setState({
                  duration,
                  period: e.target.value,
                }),
            }}
          >
            <option value="week">Weekly</option>
            <option value="month">Monthly</option>
            <option value="year">Yearly</option>
          </Select>

          <button type="button" className="button greyButton" onClick={() => onButtonClick({ duration, period })}>
            Update
          </button>
        </FilterStyled>
      </div>
    )
  }
}

Period.propTypes = {
  onButtonClick: PropTypes.func.isRequired,
  defaultDuration: PropTypes.number.isRequired,
  defaultPeriod: PropTypes.string.isRequired,
}

export default Period
