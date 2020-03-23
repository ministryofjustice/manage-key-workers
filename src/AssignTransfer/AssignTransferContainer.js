import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  setOffenderSearchText,
  setOffenderSearchAllocationStatus,
  setOffenderSearchHousingLocation,
  setError,
  setMessage,
} from '../redux/actions'
import OffenderSearchContainer from './containers/OffenderSearchContainer'
import OffenderResultsContainer from './containers/OffenderResultsContainer'
import { userType } from '../types'

class AssignTransferContainer extends Component {
  handleSearchTextChange(event) {
    const { offenderSearchTextDispatch } = this.props

    offenderSearchTextDispatch(event.target.value)
  }

  handleSearchAllocationStatusChange(event) {
    const { offenderSearchAllocationStatusDispatch } = this.props

    offenderSearchAllocationStatusDispatch(event.target.value)
  }

  handleSearchHousingLocationChange(event) {
    const { offenderSearchHousingLocationDispatch } = this.props

    offenderSearchHousingLocationDispatch(event.target.value)
  }

  render() {
    const { initialSearch } = this.props

    return (
      <div>
        {initialSearch ? (
          <OffenderSearchContainer
            handleSearchTextChange={event => this.handleSearchTextChange(event)}
            handleSearchAllocationStatusChange={event => this.handleSearchAllocationStatusChange(event)}
            handleSearchHousingLocationChange={event => this.handleSearchHousingLocationChange(event)}
            {...this.props}
          />
        ) : (
          <OffenderResultsContainer
            handleSearchTextChange={event => this.handleSearchTextChange(event)}
            handleSearchAllocationStatusChange={event => this.handleSearchAllocationStatusChange(event)}
            handleSearchHousingLocationChange={event => this.handleSearchHousingLocationChange(event)}
            {...this.props}
          />
        )}
      </div>
    )
  }
}

AssignTransferContainer.propTypes = {
  user: userType.isRequired,
  error: PropTypes.string.isRequired,
  searchText: PropTypes.string.isRequired,
  allocationStatus: PropTypes.string.isRequired,
  housingLocation: PropTypes.string.isRequired,
  initialSearch: PropTypes.bool,
  setErrorDispatch: PropTypes.func.isRequired,
  offenderSearchTextDispatch: PropTypes.func.isRequired,
  offenderSearchAllocationStatusDispatch: PropTypes.func.isRequired,
  offenderSearchHousingLocationDispatch: PropTypes.func.isRequired,
  displayBack: PropTypes.func.isRequired,
}

AssignTransferContainer.defaultProps = {
  initialSearch: false,
}

const mapStateToProps = state => ({
  user: state.app.user,
  searchText: state.offenderSearch.searchText,
  allocationStatus: state.offenderSearch.allocationStatus,
  housingLocation: state.offenderSearch.housingLocation,
  page: state.app.page,
  error: state.app.error,
  message: state.app.message,
  agencyId: state.app.user.activeCaseLoadId,
})

const mapDispatchToProps = dispatch => ({
  offenderSearchTextDispatch: text => dispatch(setOffenderSearchText(text)),
  offenderSearchAllocationStatusDispatch: status => dispatch(setOffenderSearchAllocationStatus(status)),
  offenderSearchHousingLocationDispatch: location => dispatch(setOffenderSearchHousingLocation(location)),
  setErrorDispatch: error => dispatch(setError(error)),
  setMessageDispatch: message => dispatch(setMessage(message)),
})

export { AssignTransferContainer }
export default connect(mapStateToProps, mapDispatchToProps)(AssignTransferContainer)
