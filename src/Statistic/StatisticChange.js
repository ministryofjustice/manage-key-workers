import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { createValueString } from '../stringUtils'

const StatisticChange = ({ change, type }) => {
  const { value, period } = change
  const changeType = value > 0 ? 'increase' : 'decrease'

  return (
    <Fragment>
      {changeType === 'increase' && '+'}
      {createValueString(value, type)}
      <img src={`/images/icon-${changeType}.png`} alt={changeType} height={20} width={20} />
      {period && `since last ${period}`}
    </Fragment>
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
