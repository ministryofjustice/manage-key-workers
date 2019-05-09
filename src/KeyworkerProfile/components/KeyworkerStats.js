import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'
import Statistic from '../../Statistic/Statistic'

const KeyworkerStats = ({ stats }) => (
  <GridRow>
    {stats.map(stat => (
      <Fragment key={stat.name}>
        <GridCol setWidth="one-quarter">
          <Statistic {...stat} />
        </GridCol>
      </Fragment>
    ))}
  </GridRow>
)

KeyworkerStats.propTypes = {
  stats: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default KeyworkerStats
