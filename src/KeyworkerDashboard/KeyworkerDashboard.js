import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import PropTypes from 'prop-types'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'
import moment from 'moment'

import Statistic from '../Statistic/Statistic'
import Page from '../Components/Page'
import Period from '../Period/Period'

import { setPrisonLevelKeyworkerStats, setLoaded } from '../redux/actions'

import { RatioHeader, Ratio } from './KeyworkerDashboard.styles'

class KeyworkerDashboard extends Component {
  async componentDidMount() {
    await this.loadStatsForPeriod(4, 'week')
  }

  async componentDidUpdate(prevProps) {
    const { agencyId, duration, period } = this.props
    if (agencyId !== prevProps.agencyId) {
      await this.loadStatsForPeriod(duration, period)
    }
  }

  async loadStatsForPeriod(duration, period) {
    const { agencyId, handleError, dispatchLoaded, dispatchStats } = this.props
    dispatchLoaded(false)
    try {
      const format = 'YYYY-MM-DD'
      const fromDate = moment()
        .subtract(duration, period)
        .format(format)
      const toDate = moment().format(format)

      const response = await axios.get('/api/keyworker-prison-stats', { params: { agencyId, fromDate, toDate } })
      const { stats, prisonerToKeyWorkerRatio } = response.data

      dispatchStats({ data: stats, prisonerToKeyWorkerRatio, duration, period })
    } catch (error) {
      handleError(error)
    }
    dispatchLoaded(true)
  }

  renderStatistic = statistic => (
    <Fragment key={statistic.heading}>
      <GridCol columnOneQuarter>
        <Statistic {...statistic} />
      </GridCol>
    </Fragment>
  )

  render() {
    const { data, prisonerToKeyWorkerRatio, duration, period, activeCaseLoad } = this.props
    return (
      <Page title={`Key worker statistics - ${activeCaseLoad}`}>
        <hr />
        <GridRow>
          <GridCol columnTwoThirds>
            <Period
              defaultDuration={Number(duration) || 4}
              defaultPeriod={period || 'week'}
              onButtonClick={props => this.loadStatsForPeriod(props.duration, props.period)}
            />
          </GridCol>
          <GridCol />
          <GridCol />
          <GridCol>
            <RatioHeader level={3} size="SMALL">
              Prisoner to key worker ratio
            </RatioHeader>
            <Ratio data-qa="prisonerToKeyworkerRation-value">{`${prisonerToKeyWorkerRatio}:1`}</Ratio>
          </GridCol>
        </GridRow>
        <hr />
        {data.length === 0 && <p>No data to display</p>}
        <GridRow>{data.slice(0, 4).map(statistic => this.renderStatistic(statistic))}</GridRow>
        <hr />
        {data.length > 4 && (
          <Fragment>
            <GridRow>{data.slice(4, 8).map(statistic => this.renderStatistic(statistic))}</GridRow>
            <hr />
          </Fragment>
        )}
      </Page>
    )
  }
}

KeyworkerDashboard.propTypes = {
  agencyId: PropTypes.string.isRequired,
  displayBack: PropTypes.func.isRequired,
  handleError: PropTypes.func.isRequired,
}

const mapDispatchToProps = dispatch => ({
  dispatchStats: ({ data, duration, period, prisonerToKeyWorkerRatio }) =>
    dispatch(setPrisonLevelKeyworkerStats({ data, duration, period, prisonerToKeyWorkerRatio })),
  dispatchLoaded: value => dispatch(setLoaded(value)),
})
const mapStateToProps = state => ({
  agencyId: state.app.user.activeCaseLoadId,
  data: state.prisonLevelKeyWorkerStatsDashboard.data,
  prisonerToKeyWorkerRatio: state.prisonLevelKeyWorkerStatsDashboard.prisonerToKeyWorkerRatio,
  period: state.prisonLevelKeyWorkerStatsDashboard.period,
  duration: state.prisonLevelKeyWorkerStatsDashboard.duration,
  activeCaseLoad: state.app.user.caseLoadOptions.filter(
    caseLoad => caseLoad.caseLoadId === state.app.user.activeCaseLoadId
  )[0].description,
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(KeyworkerDashboard)
