import React from 'react'
import '../index.scss'
import PropTypes from 'prop-types'
import ReactRouterPropTypes from 'react-router-prop-types'
import { withRouter } from 'react-router'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'
import ValidationErrors from '../../ValidationError'
import { locationsType } from '../../types'
import FormPanel from '../../Components/FormPanel'

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
    ? locations.map((kw) => (
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
      <GridRow>
        <GridCol setWidth="two-thirds">
          <FormPanel>
            <form onSubmit={(event) => handleSubmit(event, history)}>
              <div className="padding-bottom-large">
                <label className="form-label" htmlFor="search-text">
                  Prisoner name or number
                </label>
                <ValidationErrors validationErrors={validationErrors} fieldName="searchText" />
                <input
                  type="text"
                  className="form-control width70"
                  id="search-text"
                  name="searchText"
                  maxLength="30"
                  value={searchText}
                  onChange={handleSearchTextChange}
                />
                <button type="submit" id="searchButton" className="button margin-left">
                  Search
                </button>
              </div>
              <div className="padding-bottom-large">
                <div className="pure-u-md-7-12">{locationSelect}</div>
              </div>
              <div>
                <div className="pure-u-md-5-12">{allocationStatusSelect}</div>
              </div>
            </form>
          </FormPanel>
        </GridCol>
      </GridRow>
    )
  }
  return (
    <FormPanel>
      <form onSubmit={(event) => handleSubmit(event, history)}>
        <div className="pure-u-md-4-12">
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
        <div className="pure-u-md-3-12 padding-left">{locationSelect}</div>
        <div className="pure-u-md-2-12 padding-left">{allocationStatusSelect}</div>
        <div className="pure-u-md-2-12 padding-left">
          <span className="form-label">&nbsp;</span>
          <button type="submit" id="searchButton" className="button">
            Search again
          </button>
        </div>
      </form>
    </FormPanel>
  )
}

OffenderSearch.propTypes = {
  locations: locationsType.isRequired,
  searchText: PropTypes.string.isRequired,
  validationErrors: PropTypes.shape({}).isRequired,
  housingLocation: PropTypes.string.isRequired,
  allocationStatus: PropTypes.string.isRequired,
  initialSearch: PropTypes.bool.isRequired,
  handleSearchTextChange: PropTypes.func.isRequired,
  handleSearchHousingLocationChange: PropTypes.func.isRequired,
  handleSearchAllocationStatusChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
}

const OffenderSearchWithRouter = withRouter(OffenderSearch)

export { OffenderSearch }
export default OffenderSearchWithRouter
