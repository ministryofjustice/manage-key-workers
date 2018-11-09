import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import PropTypes from 'prop-types'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'
import Statistic from '../Statistic/Statistic'
import Page from '../Components/Page'
import { setLoaded } from '../redux/actions/index'

class KeyworkerDashboard extends Component {
  constructor() {
    super()
    this.state = { data: [] }
  }

  async componentDidMount() {
    const { agencyId, dispatch, handleError } = this.props
    dispatch(setLoaded(false))
    try {
      const response = await axios.get('/api/keyworker-prison-stats', { params: { agencyId } })
      this.setState({ data: response.data })
    } catch (error) {
      handleError(error)
    }
    dispatch(setLoaded(true))
  }

  renderStatistic = statistic => (
    <Fragment key={statistic.heading}>
      <GridCol columnOneQuarter>
        <Statistic {...statistic} />
      </GridCol>
    </Fragment>
  )

  render() {
    const { data } = this.state

    return (
      <Page title="Key worker statistics">
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

const mapStateToProps = state => ({
  agencyId: state.app.user.activeCaseLoadId,
})

export default connect(mapStateToProps)(KeyworkerDashboard)
