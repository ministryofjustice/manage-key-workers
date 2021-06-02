import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import PropTypes from 'prop-types'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'
import moment from 'moment'

import ReactRouterPropTypes from 'react-router-prop-types'
import { withRouter } from 'react-router'
import Statistic from '../Statistic/Statistic'
import Page from '../Components/Page'
import Period from '../Period/Period'
import { switchToIsoDateFormat } from '../stringUtils'

import { setPrisonLevelKeyworkerStats, setLoaded } from '../redux/actions'

import { RatioHeader, Ratio, NoDataMessage, PeriodText } from './KeyworkerDashboard.styles'

export class KeyworkerDashboard extends Component {
  async componentDidMount() {
    const { firstDay, lastDay } = this.getLastMonthsDates()
    await this.loadStatsForPeriod(firstDay, lastDay)
  }

  async componentDidUpdate(prevProps) {
    const { agencyId, fromDate, toDate } = this.props
    if (agencyId !== prevProps.agencyId) {
      await this.loadStatsForPeriod(fromDate, toDate)
    }
  }

  getLastMonthsDates = () => {
    const lastMonth = moment().subtract(1, 'months')
    const firstDay = switchToIsoDateFormat(lastMonth.startOf('month'))
    const lastDay = switchToIsoDateFormat(lastMonth.endOf('month'))

    return { firstDay, lastDay }
  }

  onSubmit = (values) => {
    const { fromDate, toDate } = values
    this.loadStatsForPeriod(switchToIsoDateFormat(fromDate), switchToIsoDateFormat(toDate))
  }

  async loadStatsForPeriod(fromDate, toDate) {
    const { agencyId, handleError, dispatchLoaded, dispatchStats, migrated, history } = this.props
    if (!migrated) {
      history.push('/')
    } else {
      dispatchLoaded(false)
      try {
        const response = await axios.get('/api/keyworker-prison-stats', { params: { agencyId, fromDate, toDate } })
        const { stats, prisonerToKeyWorkerRatio } = response.data

        dispatchStats({ data: stats, prisonerToKeyWorkerRatio, fromDate, toDate })
      } catch (error) {
        handleError(error)
      }
      dispatchLoaded(true)
    }
  }

  renderStatistic = (statistic) => (
    <Fragment key={statistic.heading}>
      <GridCol setWidth="one-quarter">
        <Statistic {...statistic} />
      </GridCol>
    </Fragment>
  )

  renderData = () => {
    const { data } = this.props

    if (data.length > 0) {
      return (
        <>
          <GridRow>{data.slice(0, 4).map((statistic) => this.renderStatistic(statistic))}</GridRow>
          {data.length > 4 && (
            <>
              <hr />
              <GridRow>{data.slice(4, 8).map((statistic) => this.renderStatistic(statistic))}</GridRow>
              <hr />
            </>
          )}
        </>
      )
    }

    return <NoDataMessage data-qa="no-data-message">There is no data for this period.</NoDataMessage>
  }

  render() {
    const { prisonerToKeyWorkerRatio, fromDate, toDate, activeCaseLoad } = this.props
    return (
      <Page title={`Key worker statistics for ${activeCaseLoad}`}>
        <hr />
        <GridRow>
          <GridCol>
            <Period fromDate={fromDate} toDate={toDate} onSubmit={this.onSubmit} />
          </GridCol>
          <GridCol setWidth="one-quarter">
            <RatioHeader level={3} size="SMALL">
              Prisoner to key worker ratio
            </RatioHeader>
            <Ratio data-qa="prisonerToKeyworkerRation-value">{`${prisonerToKeyWorkerRatio}:1`}</Ratio>
          </GridCol>
        </GridRow>
        <hr />
        <PeriodText>Displaying statistics from {`${fromDate}`} to {`${toDate}`}. 
        </PeriodText>
        {this.renderData()}
      </Page>
    )
  }
}

KeyworkerDashboard.propTypes = {
  agencyId: PropTypes.string.isRequired,
  displayBack: PropTypes.func.isRequired,
  handleError: PropTypes.func.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  migrated: PropTypes.bool.isRequired,
  fromDate: PropTypes.string.isRequired,
  toDate: PropTypes.string.isRequired,
  dispatchStats: PropTypes.func.isRequired,
  dispatchLoaded: PropTypes.func.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  prisonerToKeyWorkerRatio: PropTypes.number.isRequired,
  activeCaseLoad: PropTypes.string.isRequired,
}

const mapDispatchToProps = (dispatch) => ({
  dispatchStats: ({ data, fromDate, toDate, prisonerToKeyWorkerRatio }) =>
    dispatch(setPrisonLevelKeyworkerStats({ data, fromDate, toDate, prisonerToKeyWorkerRatio })),
  dispatchLoaded: (value) => dispatch(setLoaded(value)),
})
const mapStateToProps = (state) => ({
  agencyId: state.app.user.activeCaseLoadId,
  data: state.prisonLevelKeyWorkerStatsDashboard.data,
  prisonerToKeyWorkerRatio: state.prisonLevelKeyWorkerStatsDashboard.prisonerToKeyWorkerRatio,
  activeCaseLoad: state.app.user.caseLoadOptions.filter((caseLoad) => caseLoad.currentlyActive)[0].description,
  migrated: state.keyworkerSettings.migrated,
  fromDate: state.prisonLevelKeyWorkerStatsDashboard.fromDate,
  toDate: state.prisonLevelKeyWorkerStatsDashboard.toDate,
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(KeyworkerDashboard))
