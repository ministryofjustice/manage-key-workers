import React from 'react'
import PropTypes from 'prop-types'
import styled from 'react-emotion'
import { SPACING, FONT_SIZE, BREAKPOINTS } from '@govuk-react/constants'
import { createValueString } from '../stringUtils'

export const Container = styled('p')`
  display: flex;
  align-items: center;
  margin: 0;
  font-size: ${FONT_SIZE.SIZE_16};

  img {
    margin: -${SPACING.SCALE_1} ${SPACING.SCALE_1} 0;
  }

  @media (min-width: ${BREAKPOINTS.LARGESCREEN}) {
    font-size: ${FONT_SIZE.SIZE_19};
  }
`

const StatisticChange = ({ change, type }) => {
  const { value, period } = change
  const changeType = value > 0 ? 'increase' : 'decrease'

  if (!change.value || change.value === 0) return <Container>{`no change since last ${change.period}`}</Container>

  return (
    <Container>
      {changeType === 'increase' && '+'}
      {createValueString(value, type)}
      <img src={`/images/icon-${changeType}.png`} alt={changeType} height={20} width={20} />
      {period && `since last ${period}`}
    </Container>
  )
}

StatisticChange.propTypes = {
  change: PropTypes.shape({
    value: PropTypes.number,
    period: PropTypes.string,
  }).isRequired,
  type: PropTypes.string.isRequired,
}

export default StatisticChange
