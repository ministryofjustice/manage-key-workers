import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactRouterPropTypes from 'react-router-prop-types'
import axios from 'axios'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import Provisional from '../components/Provisional'
import { setAllocatedDetails, manualOverride, setMessage, setLoaded } from '../../redux/actions/index'
import Page from '../../Components/Page'

import '../../allocation.scss'
import { userType, allocatedKeyworkersType, allocatedListType } from '../../types'

class ProvisionalContainer extends Component {
  constructor() {
    super()
    this.handleKeyworkerChange = this.handleKeyworkerChange.bind(this)
    this.postManualOverride = this.postManualOverride.bind(this)
  }

  async componentWillMount() {
    const {
      user,
      history,
      allocatedDetailsDispatch,
      manualOverrideDispatch,
      handleError,
      setLoadedDispatch,
    } = this.props

    setLoadedDispatch(false)

    try {
      if (!user || !user.writeAccess) {
        history.push('/manage-key-workers')
        return
      }
      const viewModel = await this.getAllocated()
      allocatedDetailsDispatch(viewModel.allocatedResponse, viewModel.keyworkerResponse)
      manualOverrideDispatch([])
      if (viewModel.warning) {
        handleError({
          response: {
            data: `${
              viewModel.warning
            } Please try allocating manually, adding more Key workers or raising their capacities.`,
          },
        })
      }
    } catch (error) {
      handleError(error)
    }

    setLoadedDispatch(true)
  }

  async getAllocated() {
    const { agencyId } = this.props
    const response = await axios.get('/api/allocated', {
      params: {
        agencyId,
        allocationType: 'A',
      },
    })
    return response.data
  }

  handleKeyworkerChange(event, index, offenderNo) {
    const { allocatedKeyworkers, manualOverrideDispatch, handleError } = this.props

    try {
      const allocatedKeyworkersList = [...allocatedKeyworkers]

      if (event.target.value === '--') {
        allocatedKeyworkersList[index] = null
      } else {
        allocatedKeyworkersList[index] = {
          staffId: event.target.value,
          offenderNo,
        }
      }
      manualOverrideDispatch(allocatedKeyworkersList)
    } catch (error) {
      handleError(error)
    }
  }

  async postManualOverride(history) {
    const {
      agencyId,
      allocatedKeyworkers,
      setMessageDispatch,
      onFinishAllocation,
      handleError,
      setLoadedDispatch,
    } = this.props

    setLoadedDispatch(false)

    try {
      await axios.post(
        '/api/autoAllocateConfirmWithOverride',
        { allocatedKeyworkers },
        {
          params: {
            agencyId,
          },
        }
      )
      setMessageDispatch('Key workers successfully updated.')
      onFinishAllocation(history)
    } catch (error) {
      handleError(error)
    }

    setLoadedDispatch(true)
  }

  render() {
    return (
      <Page title="Suggested key worker allocation" alwaysRender>
        <Provisional
          handleKeyworkerChange={this.handleKeyworkerChange}
          postManualOverride={this.postManualOverride}
          {...this.props}
        />
      </Page>
    )
  }
}

ProvisionalContainer.propTypes = {
  error: PropTypes.string.isRequired,
  handleError: PropTypes.func.isRequired,
  allocatedList: allocatedListType.isRequired,
  allocatedKeyworkers: allocatedKeyworkersType.isRequired,
  onFinishAllocation: PropTypes.func.isRequired,
  agencyId: PropTypes.string.isRequired,
  allocatedDetailsDispatch: PropTypes.func.isRequired,
  manualOverrideDispatch: PropTypes.func.isRequired,
  setMessageDispatch: PropTypes.func.isRequired,
  setLoadedDispatch: PropTypes.func.isRequired,
  loaded: PropTypes.bool.isRequired,
  user: userType.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
}

const mapStateToProps = state => ({
  user: state.app.user,
  allocatedList: state.allocated.allocatedList,
  keyworkerList: state.allocated.keyworkerList,
  allocatedKeyworkers: state.allocated.allocatedKeyworkers,
  message: state.app.message,
  agencyId: state.app.user.activeCaseLoadId,
  loaded: state.app.loaded,
})

const mapDispatchToProps = dispatch => ({
  allocatedDetailsDispatch: (allocatedList, keyworkerList) =>
    dispatch(setAllocatedDetails(allocatedList, keyworkerList)),
  manualOverrideDispatch: allocatedKeyworkers => dispatch(manualOverride(allocatedKeyworkers)),
  setMessageDispatch: message => dispatch(setMessage(message)),
  setLoadedDispatch: status => dispatch(setLoaded(status)),
})

export { ProvisionalContainer }
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ProvisionalContainer))
