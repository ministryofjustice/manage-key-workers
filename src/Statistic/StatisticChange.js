import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

const StatisticChange = ({ change }) => {
  const { value, period } = change
  const changeType = value > 0 ? 'increase' : 'decrease'

  return (
    <Fragment>
      {changeType === 'increase' && '+'}
      {value}
      <img src={`/images/icon-${changeType}.png`} alt={changeType} height={20} width={20} />
      {period && `since last ${period}`}
    </Fragment>
  )
}

StatisticChange.propTypes = {
  change: PropTypes.shape({
    value: PropTypes.number,
    period: PropTypes.string,
  }),
}

export default StatisticChange
