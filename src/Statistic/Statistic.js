import React from 'react'
import PropTypes from 'prop-types'
import { Container, Heading, Value, Change } from './Statistic.styles'
import StatisticChange from './StatisticChange'

const Statistic = ({ heading, value, change }) => (
  <Container data-qa="keyworker-stat">
    <Heading>{heading}</Heading>
    <Value>{value}</Value>
    <Change>
      {change.value === 0 && `no change since last ${change.period}`}
      {change.value !== 0 && <StatisticChange change={change} />}
    </Change>
  </Container>
)

Statistic.propTypes = {
  heading: PropTypes.string,
  value: PropTypes.number,
  change: PropTypes.object,
}

Statistic.defaultProps = {
  heading: 'Unknown statistic',
  value: 0,
  change: {
    value: 0,
    period: 'week',
  },
}

export default Statistic
