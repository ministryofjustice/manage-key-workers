import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import axios from 'axios'
import { setAllocationHistory, setLoaded } from '../../redux/actions'
import AllocationHistory from '../components/AllocationHistory'
import Page from '../../Components/Page'

class AllocationHistoryContainer extends Component {
  constructor(props) {
    super()
    props.setLoadedDispatch(false)
  }

  async componentDidMount() {
    const { handleError, setLoadedDispatch } = this.props

    try {
      await this.getAllocationHistory()
    } catch (error) {
      handleError(error)
    }
    setLoadedDispatch(true)
  }

  async getAllocationHistory() {
    const { match, allocationHistoryDispatch } = this.props
    const response = await axios.get('/api/allocationHistory', {
      params: {
        offenderNo: match.params.offenderNo,
      },
    })

    await allocationHistoryDispatch(response.data)
  }

  render() {
    return (
      <Page title="Offender key worker allocation history">
        <AllocationHistory {...this.props} />
      </Page>
    )
  }
}

AllocationHistoryContainer.propTypes = {
  error: PropTypes.string.isRequired,
  agencyId: PropTypes.string.isRequired,
  allocationHistory: PropTypes.shape({ allocationHistory: PropTypes.shape({}) }).isRequired,
  allocationHistoryDispatch: PropTypes.func.isRequired,
  setLoadedDispatch: PropTypes.func.isRequired,
  handleError: PropTypes.func.isRequired,
  match: PropTypes.shape({ params: PropTypes.shape({ offenderNo: PropTypes.string }) }).isRequired,
  loaded: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
}

const mapStateToProps = (state) => ({
  error: state.app.error,
  agencyId: state.app.user.activeCaseLoadId,
  allocationHistory: state.allocationHistory.allocationHistory,
  loaded: state.app.loaded,
  message: state.app.message,
})

const mapDispatchToProps = (dispatch) => ({
  allocationHistoryDispatch: (allocHistory) => dispatch(setAllocationHistory(allocHistory)),
  setLoadedDispatch: (status) => dispatch(setLoaded(status)),
})

export { AllocationHistoryContainer }
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AllocationHistoryContainer))
