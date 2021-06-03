import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
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
  const { value } = change
  const changeType = value > 0 ? 'increase' : 'decrease'

  if (!change.value || change.value === 0) return <Container>No change</Container>

  return (
    <Container>
      {changeType === 'increase' && '+'}
      {createValueString(value, type)} {changeType}
    </Container>
  )
}

StatisticChange.propTypes = {
  change: PropTypes.shape({
    value: PropTypes.number,
  }).isRequired,
  type: PropTypes.string.isRequired,
}

export default StatisticChange
