import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import axios from 'axios'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import KeyworkerProfile from '../components/KeyworkerProfile'
import Error from '../../Error'
import Spinner from '../../Spinner'

import {
  setKeyworkerAllocationList,
  setKeyworker,
  setKeyworkerChangeList,
  setAvailableKeyworkerList,
  setKeyworkerStatus,
  setKeyworkerCapacity,
  setMessage,
  setLoaded,
  setKeyworkerStats,
} from '../../redux/actions/index'

class KeyworkerProfileContainer extends Component {
  constructor(props) {
    super(props)
    props.setLoadedDispatch(false)
  }

  async componentDidMount() {
    const { handleError, setLoadedDispatch } = this.props
    try {
      await this.getKeyworkerProfile()
      await this.getKeyworkerAllocations()
      await this.getKeyworkerStats()
    } catch (error) {
      handleError(error)
    }
    setLoadedDispatch(true)
  }

  getKeyworkerProfile = async () => {
    const { match, keyworkerDispatch } = this.props
    const keyworker = await this.makeKeyworkerProfileCall(match.params.staffId)
    keyworkerDispatch(keyworker)
  }

  getKeyworkerAllocations = async () => {
    const {
      agencyId,
      match,
      keyworkerAllocationsDispatch,
      availableKeyworkerListDispatch,
      keyworkerChangeListDispatch,
    } = this.props
    const allocationsViewModel = await this.makeKeyworkerAllocationsCall(agencyId, match.params.staffId)
    keyworkerAllocationsDispatch(allocationsViewModel.allocatedResponse)
    availableKeyworkerListDispatch(allocationsViewModel.keyworkerResponse)
    keyworkerChangeListDispatch([])
  }

  getKeyworkerStats = async () => {
    const { agencyId, match, keyworkerStatsDispatch } = this.props
    const format = 'YYYY-MM-DD'
    const toDate = moment()
      .subtract(1, 'day')
      .format(format)
    const fromDate = moment()
      .subtract(1, 'month')
      .subtract(1, 'day')
      .format(format)

    const response = await axios.get('/api/keyworker-profile-stats', {
      params: {
        agencyId,
        staffId: match.params.staffId,
        fromDate,
        toDate,
        period: 'month',
      },
    })

    keyworkerStatsDispatch(response.data)
  }

  makeKeyworkerAllocationsCall = async (agencyId, staffId) => {
    const response = await axios.get('/api/keyworkerAllocations', {
      params: {
        agencyId,
        staffId,
      },
    })
    return response.data
  }

  handleKeyworkerChange = (event, index, offenderNo) => {
    const { keyworkerChangeList, keyworkerChangeListDispatch } = this.props
    const changeList = [...keyworkerChangeList]

    if (event.target.value === '--') {
      changeList[index] = null
    } else if (event.target.value === '_DEALLOCATE') {
      changeList[index] = {
        deallocate: true,
        staffId: event.target.value,
        offenderNo,
      }
    } else {
      changeList[index] = {
        staffId: event.target.value,
        offenderNo,
      }
    }
    keyworkerChangeListDispatch(changeList)
  }

  makeKeyworkerProfileCall = async staffId => {
    const { agencyId } = this.props
    const response = await axios.get('/api/keyworker', {
      params: {
        staffId,
        agencyId,
      },
    })
    return response.data
  }

  handleEditProfileClick = history => {
    const { keyworkerCapacityDispatch, keyworkerStatusDispatch, keyworker } = this.props
    // initialise inputs with current capacity value
    keyworkerCapacityDispatch(keyworker.capacity.toString())
    keyworkerStatusDispatch(keyworker.status)
    history.push(`/keyworker/${keyworker.staffId}/profile/edit`)
  }

  postAllocationChange = async history => {
    const { agencyId, keyworkerChangeList, setMessageDispatch, keyworkerChangeListDispatch, handleError } = this.props
    try {
      if (keyworkerChangeList && keyworkerChangeList.length > 0) {
        await axios.post(
          '/api/manualoverride',
          {
            allocatedKeyworkers: keyworkerChangeList,
          },
          {
            params: {
              agencyId,
            },
          }
        )
        setMessageDispatch('Offender allocation updated.')
        keyworkerChangeListDispatch([])
      }
      history.push('/')
    } catch (error) {
      handleError(error)
    }
  }

  render() {
    const { error, loaded } = this.props

    if (error) return <Error {...this.props} />

    if (loaded) {
      return (
        <KeyworkerProfile
          handleKeyworkerChange={this.handleKeyworkerChange}
          handleAllocationChange={this.postAllocationChange}
          handleEditProfileClick={this.handleEditProfileClick}
          {...this.props}
        />
      )
    }

    return <Spinner />
  }
}

KeyworkerProfileContainer.propTypes = {
  error: PropTypes.string,
  path: PropTypes.string,
  agencyId: PropTypes.string.isRequired,
  keyworkerAllocationsDispatch: PropTypes.func,
  keyworkerDispatch: PropTypes.func,
  setMessageDispatch: PropTypes.func,
  setLoadedDispatch: PropTypes.func,
  handleError: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  keyworkerChangeList: PropTypes.array,
  keyworker: PropTypes.object,
  keyworkerChangeListDispatch: PropTypes.func,
  availableKeyworkerListDispatch: PropTypes.func,
  keyworkerCapacityDispatch: PropTypes.func,
  keyworkerStatusDispatch: PropTypes.func,
  loaded: PropTypes.bool,
}

const mapStateToProps = state => ({
  agencyId: state.app.user.activeCaseLoadId,
  keyworkerAllocations: state.keyworkerSearch.keyworkerAllocations,
  keyworker: state.keyworkerSearch.keyworker,
  keyworkerChangeList: state.keyworkerSearch.keyworkerChangeList,
  keyworkerList: state.keyworkerSearch.keyworkerList,
  loaded: state.app.loaded,
})

const mapDispatchToProps = dispatch => ({
  keyworkerAllocationsDispatch: list => dispatch(setKeyworkerAllocationList(list)),
  keyworkerDispatch: id => dispatch(setKeyworker(id)),
  keyworkerStatsDispatch: stats => dispatch(setKeyworkerStats(stats)),
  keyworkerChangeListDispatch: list => dispatch(setKeyworkerChangeList(list)),
  availableKeyworkerListDispatch: list => dispatch(setAvailableKeyworkerList(list)),
  keyworkerCapacityDispatch: capacity => dispatch(setKeyworkerCapacity(capacity)),
  setMessageDispatch: message => dispatch(setMessage(message)),
  setLoadedDispatch: status => dispatch(setLoaded(status)),
  keyworkerStatusDispatch: status => dispatch(setKeyworkerStatus(status)),
})

export { KeyworkerProfileContainer }
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(KeyworkerProfileContainer))
