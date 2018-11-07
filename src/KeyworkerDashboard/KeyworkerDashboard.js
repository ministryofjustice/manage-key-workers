import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import Header from '@govuk-react/header'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'
import Statistic from '../Statistic/Statistic'
import keyworkerDashboardData from './keyworkerDashboardData'
import { Container } from './KeyworkerDashboard.styles'

class KeyworkerDashboard extends Component {
  renderStatistic = statistic => (
    <Fragment key={statistic.heading}>
      <GridCol columnOneQuarter>
        <Statistic {...statistic} />
      </GridCol>
    </Fragment>
  )

  render() {
    const { displayBack } = this.props

    return (
      <Fragment>
        {displayBack()} {/* To be addressed with global breadcrumbs and page container */}
        <Container>
          <Header level={1} size="LARGE">
            Keyworker statistics - overall
          </Header>
          <hr />
          <GridRow>{keyworkerDashboardData.slice(0, 4).map(statistic => this.renderStatistic(statistic))}</GridRow>
          <hr />
          {keyworkerDashboardData.length > 4 && (
            <Fragment>
              <GridRow>{keyworkerDashboardData.slice(4, 8).map(statistic => this.renderStatistic(statistic))}</GridRow>
              <hr />
            </Fragment>
          )}
        </Container>
      </Fragment>
    )
  }
}

KeyworkerDashboard.propTypes = {
  displayBack: PropTypes.func.isRequired,
}

export default KeyworkerDashboard
