import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import axios from 'axios'
import OffenderSearch from '../components/OffenderSearch'
import {
  resetValidationErrors,
  setKeyworkerChangeList,
  setOffenderSearchLocations,
  setValidationError,
} from '../../redux/actions'

class OffenderSearchContainer extends Component {
  componentWillMount() {
    const { offenderSearchTextDispatch, offenderSearchAllocationStatusDispatch } = this.props

    this.getLocations()
    offenderSearchTextDispatch('')
    offenderSearchAllocationStatusDispatch('all')
  }

  getLocations = async () => {
    const {
      offenderSearchLocationsDispatch,
      offenderSearchHousingLocationDispatch,
      handleError,
      initialSearch,
    } = this.props
    try {
      const response = await axios.get('/api/userLocations')
      offenderSearchLocationsDispatch(response.data)
      // Use the first location by default
      if (initialSearch && response.data && response.data[0]) {
        offenderSearchHousingLocationDispatch(response.data[0].locationPrefix)
      }
    } catch (error) {
      handleError(error)
    }
  }

  handleSubmit = history => {
    history.push('/offender/results')
  }

  render() {
    return <OffenderSearch {...this.props} handleSubmit={this.handleSubmit} />
  }
}

OffenderSearchContainer.propTypes = {
  error: PropTypes.string.isRequired,
  handleError: PropTypes.func.isRequired,
  locations: PropTypes.arrayOf(PropTypes.object).isRequired,
  offenderSearchLocationsDispatch: PropTypes.func.isRequired,
  offenderSearchHousingLocationDispatch: PropTypes.func.isRequired,
  searchText: PropTypes.string.isRequired,
  setValidationErrorDispatch: PropTypes.func.isRequired,
  resetValidationErrorsDispatch: PropTypes.func.isRequired,
  offenderSearchTextDispatch: PropTypes.func.isRequired,
  offenderSearchAllocationStatusDispatch: PropTypes.func.isRequired,
  initialSearch: PropTypes.bool.isRequired,
  allocationStatus: PropTypes.string.isRequired,
  validationErrors: PropTypes.shape({}).isRequired,
}

const mapStateToProps = state => ({
  locations: state.offenderSearch.locations,
  searchText: state.offenderSearch.searchText,
  allocationStatus: state.offenderSearch.allocationStatus,
  validationErrors: state.app.validationErrors,
})

const mapDispatchToProps = dispatch => ({
  offenderSearchLocationsDispatch: locationList => dispatch(setOffenderSearchLocations(locationList)),
  keyworkerChangeListDispatch: list => dispatch(setKeyworkerChangeList(list)),
  setValidationErrorDispatch: (fieldName, message) => dispatch(setValidationError(fieldName, message)),
  resetValidationErrorsDispatch: () => dispatch(resetValidationErrors()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OffenderSearchContainer)
