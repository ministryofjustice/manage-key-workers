import React from 'react'
import PropTypes from 'prop-types'
import { Container, Heading, Value, Change } from './Statistic.styles'
import StatisticChange from './StatisticChange'

const Statistic = ({ heading, value, change, percentage }) => (
  <Container data-qa="keyworker-stat">
    <Heading>{heading}</Heading>
    <Value>
      {value} {percentage && '%'}
    </Value>
    <Change>
      {change.value === 0 && `no change since last ${change.period}`}
      {change.value !== 0 && <StatisticChange change={change} percentage={percentage} />}
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
  percentage: PropTypes.bool,
}

Statistic.defaultProps = {
  heading: 'Unknown statistic',
  value: 0,
  change: {
    value: 0,
    period: 'week',
  },
  percentage: false,
}

export default Statistic
