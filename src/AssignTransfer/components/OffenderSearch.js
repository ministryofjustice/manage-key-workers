import React, { Component } from 'react';
import '../index.scss';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import ValidationErrors from "../../ValidationError";

class OffenderSearch extends Component {
  render () {
    const housingLocations = this.props.locations ? this.props.locations.map((kw, optionIndex) => {
      return <option key={`housinglocation_option_${optionIndex}_${kw.locationId}`} value={kw.locationPrefix}>{kw.description || kw.locationPrefix}</option>;
    }) : [];

    const locationSelect = (
      <div>
        <label className="form-label" htmlFor="housing-location-select">Location</label>
        <ValidationErrors validationErrors={this.props.validationErrors} fieldName={'housing-location-select'} />
        <select id="housing-location-select" name="housing-location-select" className="form-control"
          value={this.props.housingLocation}
          onChange={this.props.handleSearchHousingLocationChange}>
          {housingLocations}
        </select></div>);

    const allocationStatusSelect = (
      <div>
        <label className="form-label" htmlFor="housing-location-select">Allocation status</label>
        <ValidationErrors validationErrors={this.props.validationErrors} fieldName={'housing-location-select'} />
        <select id="allocation-status-select" name="allocation-status-select" className="form-control"
          value={this.props.allocationStatus}
          onChange={this.props.handleSearchAllocationStatusChange}>
          <option key="allocationStatus_option_all" value="all">All</option>
          <option key="allocationStatus_option_allocated" value="allocated">Allocated</option>
          <option key="allocationStatus_option_unallocated" value="unallocated">Unallocated</option>
        </select></div>);

    if (this.props.initialSearch) {
      return (<div>
        <div className="pure-u-md-12-12 searchForm">
          <div className="padding-top padding-left padding-right">
            <label className="form-label" htmlFor="search-text">Prisoner name or number</label>
            <ValidationErrors validationErrors={this.props.validationErrors} fieldName={'searchText'} />
            <input type="text" className="form-control width70 margin-bottom" id="search-text" name="searchText" maxLength="30"
              value={this.props.searchText} onChange={this.props.handleSearchTextChange}/>
            <button id="searchButton" className="button margin-left" onClick={() => this.props.handleSubmit(this.props.history)}>Search</button>
          </div>
          <div className="padding-top padding-left padding-right padding-bottom-large">
            <div className="pure-u-md-7-12">{locationSelect}</div>
          </div>
          <div className="padding-top padding-left padding-right padding-bottom-large">
            <div className="pure-u-md-5-12">{allocationStatusSelect}</div>
          </div>
        </div>
      </div>);
    }
    return (<div>
      <div className="pure-u-md-12-12 searchForm padding-bottom">
        <div className="pure-u-md-4-12 padding-top padding-left">
          <label className="form-label" htmlFor="seachText">Prisoner name or number</label>
          <ValidationErrors validationErrors={this.props.validationErrors} fieldName={'searchText'} />
          <input type="text" className="form-control width100" id="search-text" name="searchText" maxLength="30"
            value={this.props.searchText} onChange={this.props.handleSearchTextChange}/>
        </div>
        <div className="pure-u-md-3-12 padding-top padding-left">
          {locationSelect}
        </div>
        <div className="pure-u-md-2-12 padding-top padding-left">
          {allocationStatusSelect}
        </div>
        <div className="pure-u-md-2-12 padding-top padding-left">
          <label className="form-label">&nbsp;</label>
          <button id="searchButton" className="button" onClick={() => this.props.handleSubmit(this.props.history)}>Search again</button>
        </div>
      </div>
    </div>);
  }
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
  history: PropTypes.object.isRequired
};

const OffenderSearchWithRouter = withRouter(OffenderSearch);

export { OffenderSearch };
export default OffenderSearchWithRouter;
