import React from 'react'
import PropTypes from 'prop-types'
import { Container, Heading, Value } from './Statistic.styles'
import StatisticChange from './StatisticChange'
import { createValueString } from '../stringUtils'

const Statistic = ({ heading, value, change, type }) => (
  <Container data-qa="keyworker-stat">
    <Heading>{heading}</Heading>
    <Value>{createValueString(value, type)}</Value>
    <StatisticChange change={change} type={type} />
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
  value: null,
  change: {
    value: null,
    period: 'period',
  },
  type: '',
}

export default Statistic
