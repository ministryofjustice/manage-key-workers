import React from 'react'
import PropTypes from 'prop-types'
import { Container, Heading, Value, Change } from './Statistic.styles'
import StatisticChange from './StatisticChange'
import { createValueString } from '../stringUtils'

const Statistic = ({ heading, value, change, type }) => (
  <Container data-qa="keyworker-stat">
    <Heading>{heading}</Heading>
    <Value>{createValueString(value, type)}</Value>
    <Change>
      {change.value === 0 && `no change since last ${change.period}`}
      {change.value !== 0 && <StatisticChange change={change} type={type} />}
    </Change>
  </Container>
)

Statistic.propTypes = {
  heading: PropTypes.string,
  value: PropTypes.number,
  change: PropTypes.shape({
    value: PropTypes.number,
    period: PropTypes.string,
  }),
  type: PropTypes.string,
}

Statistic.defaultProps = {
  heading: 'Unknown statistic',
  value: 0,
  change: {
    value: 0,
    period: 'week',
  },
  type: '',
}

export default Statistic
