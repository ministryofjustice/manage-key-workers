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
  setLoaded,
} from '../../redux/actions'
import { locationsType } from '../../types'
import Page from '../../Components/Page'

class OffenderSearchContainer extends Component {
  componentWillMount() {
    const { offenderSearchTextDispatch, offenderSearchAllocationStatusDispatch } = this.props

    this.getLocations()
    offenderSearchTextDispatch('')
    offenderSearchAllocationStatusDispatch('all')
  }

  componentDidMount() {
    const { dispatchLoaded } = this.props
    dispatchLoaded(true)
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

  handleSubmit = (event, history) => {
    event.preventDefault()
    history.push('/manage-key-workers/offender-search/results')
  }

  render() {
    return (
      <Page title="Search for an offender">
        <OffenderSearch {...this.props} handleSubmit={this.handleSubmit} />
      </Page>
    )
  }
}

OffenderSearchContainer.propTypes = {
  error: PropTypes.string.isRequired,
  handleError: PropTypes.func.isRequired,
  locations: locationsType.isRequired,
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
  dispatchLoaded: PropTypes.func.isRequired,
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
  dispatchLoaded: value => dispatch(setLoaded(value)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OffenderSearchContainer)
