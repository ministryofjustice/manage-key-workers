import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactRouterPropTypes from 'react-router-prop-types'
import axios from 'axios'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import Unallocated from '../components/Unallocated'
import { setUnallocatedList, setMessage, setLoaded } from '../../redux/actions/index'
import ErrorComponent from '../../Error/index'
import Spinner from '../../Spinner/index'

import '../../allocation.scss'
import { userType, unallocatedListType } from '../../types'

class UnallocatedContainer extends Component {
  constructor(props) {
    super(props)
    props.unallocatedListDispatch([])
    props.setLoadedDispatch(false)
  }

  async componentWillMount() {
    const { agencyId, user, history, unallocatedListDispatch, handleError, setLoadedDispatch } = this.props

    try {
      if (!user || !user.writeAccess) {
        history.push('/')
        return
      }
      const list = await this.getUnallocated(agencyId)
      unallocatedListDispatch(list)
    } catch (error) {
      handleError(error)
    }
    setLoadedDispatch(true)
  }

  getUnallocated = async agencyId => {
    const response = await axios.get('/api/unallocated', {
      params: {
        agencyId,
      },
    })
    return response.data
  }

  gotoManualAllocation = async history => {
    history.push(`/provisionalAllocation`)
  }

  render() {
    const { loaded } = this.props

    if (loaded) {
      return (
        <div>
          <ErrorComponent {...this.props} />
          {<Unallocated gotoNext={this.gotoManualAllocation} {...this.props} />}
        </div>
      )
    }
    return <Spinner />
  }
}

UnallocatedContainer.propTypes = {
  error: PropTypes.string.isRequired,
  handleError: PropTypes.func.isRequired,
  unallocatedList: unallocatedListType.isRequired,
  agencyId: PropTypes.string.isRequired,
  unallocatedListDispatch: PropTypes.func.isRequired,
  setMessageDispatch: PropTypes.func.isRequired,
  setLoadedDispatch: PropTypes.func.isRequired,
  loaded: PropTypes.bool.isRequired,
  user: userType.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
}

const mapStateToProps = state => ({
  user: state.app.user,
  error: state.app.error,
  unallocatedList: state.unallocated.unallocatedList,
  allocatedKeyworkers: state.allocated.allocatedKeyworkers,
  message: state.app.message,
  agencyId: state.app.user.activeCaseLoadId,
  loaded: state.app.loaded,
})

const mapDispatchToProps = dispatch => ({
  unallocatedListDispatch: list => dispatch(setUnallocatedList(list)),
  setMessageDispatch: message => dispatch(setMessage(message)),
  setLoadedDispatch: status => dispatch(setLoaded(status)),
})

export { UnallocatedContainer }
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(UnallocatedContainer))
