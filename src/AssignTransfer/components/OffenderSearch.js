import React from 'react'
import '../index.scss'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import ValidationErrors from '../../ValidationError'

const OffenderSearch = ({
  locations,
  allocationStatus,
  handleSearchAllocationStatusChange,
  handleSearchHousingLocationChange,
  validationErrors,
  housingLocation,
  searchText,
  handleSubmit,
  history,
  initialSearch,
  handleSearchTextChange,
}) => {
  const housingLocations = locations
    ? locations.map(kw => (
        <option key={`housinglocation_option_${kw.locationId}`} value={kw.locationPrefix}>
          {kw.description || kw.locationPrefix}
        </option>
      ))
    : []

  const locationSelect = (
    <div>
      <label className="form-label" htmlFor="housing-location-select">
        Location
      </label>
      <ValidationErrors validationErrors={validationErrors} fieldName="housing-location-select" />
      <select
        id="housing-location-select"
        name="housing-location-select"
        className="form-control"
        value={housingLocation}
        onChange={handleSearchHousingLocationChange}
      >
        {housingLocations}
      </select>
    </div>
  )

  const allocationStatusSelect = (
    <div>
      <label className="form-label" htmlFor="allocation-status-select">
        Allocation status
      </label>
      <ValidationErrors validationErrors={validationErrors} fieldName="housing-location-select" />
      <select
        id="allocation-status-select"
        name="allocation-status-select"
        className="form-control"
        value={allocationStatus}
        onChange={handleSearchAllocationStatusChange}
      >
        <option key="allocationStatus_option_all" value="all">
          All
        </option>
        <option key="allocationStatus_option_allocated" value="allocated">
          Allocated
        </option>
        <option key="allocationStatus_option_unallocated" value="unallocated">
          Unallocated
        </option>
      </select>
    </div>
  )

  if (initialSearch) {
    return (
      <div>
        <div className="pure-u-md-12-12 searchForm">
          <div className="padding-top padding-left padding-right">
            <label className="form-label" htmlFor="search-text">
              Prisoner name or number
            </label>
            <ValidationErrors validationErrors={validationErrors} fieldName="searchText" />
            <input
              type="text"
              className="form-control width70 margin-bottom"
              id="search-text"
              name="searchText"
              maxLength="30"
              value={searchText}
              onChange={handleSearchTextChange}
            />
            <button
              type="button"
              id="searchButton"
              className="button margin-left"
              onClick={() => handleSubmit(history)}
            >
              Search
            </button>
          </div>
          <div className="padding-top padding-left padding-right padding-bottom-large">
            <div className="pure-u-md-7-12">{locationSelect}</div>
          </div>
          <div className="padding-top padding-left padding-right padding-bottom-large">
            <div className="pure-u-md-5-12">{allocationStatusSelect}</div>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div>
      <div className="pure-u-md-12-12 searchForm padding-bottom">
        <div className="pure-u-md-4-12 padding-top padding-left">
          <label className="form-label" htmlFor="search-text">
            Prisoner name or number
          </label>
          <ValidationErrors validationErrors={validationErrors} fieldName="searchText" />
          <input
            type="text"
            className="form-control width100"
            id="search-text"
            name="searchText"
            maxLength="30"
            value={searchText}
            onChange={handleSearchTextChange}
          />
        </div>
        <div className="pure-u-md-3-12 padding-top padding-left">{locationSelect}</div>
        <div className="pure-u-md-2-12 padding-top padding-left">{allocationStatusSelect}</div>
        <div className="pure-u-md-2-12 padding-top padding-left">
          <span className="form-label">&nbsp;</span>
          <button type="button" id="searchButton" className="button" onClick={() => handleSubmit(history)}>
            Search again
          </button>
        </div>
      </div>
    </div>
  )
}

OffenderSearch.propTypes = {
  locations: PropTypes.array,
  searchText: PropTypes.string,
  validationErrors: PropTypes.string,
  housingLocation: PropTypes.string,
  allocationStatus: PropTypes.string,
  initialSearch: PropTypes.bool,
  handleSearchTextChange: PropTypes.func.isRequired,
  handleSearchHousingLocationChange: PropTypes.func.isRequired,
  handleSearchAllocationStatusChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func,
  history: PropTypes.object.isRequired,
}

const OffenderSearchWithRouter = withRouter(OffenderSearch)

export { OffenderSearch }
export default OffenderSearchWithRouter
