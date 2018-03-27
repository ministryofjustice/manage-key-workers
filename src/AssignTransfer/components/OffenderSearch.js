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
        <label className="form-label" htmlFor="housing-location-select">Housing location</label>
        <ValidationErrors validationErrors={this.props.validationErrors} fieldName={'housing-location-select'} />
        <select id="housing-location-select" name="housing-location-select" className="form-control"
          value={this.props.housingLocation}
          onChange={this.props.handleSearchHousingLocationChange}>
          {housingLocations}
        </select></div>);

    if (this.props.initialSearch) {
      return (<div>
        <div className="pure-u-md-12-12 searchForm">
          <div className="padding-top padding-left padding-right">
            <label className="form-label" htmlFor="search-text">Offender name or number</label>
            <ValidationErrors validationErrors={this.props.validationErrors} fieldName={'searchText'} />
            <input type="text" className="form-control width70 margin-bottom" id="search-text" name="searchText" maxLength="30"
              value={this.props.searchText} onChange={this.props.handleSearchTextChange}/>
            <button className="button margin-left" onClick={() => this.props.handleSubmit(this.props.history)}>Search ></button>
          </div>
          <div className="pure-u-md-7-12 padding-top padding-left padding-right padding-bottom-large">
            {locationSelect}
          </div>
        </div>
      </div>);
    }
    return (<div>
      <div className="pure-u-md-12-12 searchForm padding-bottom">
        <div className="pure-u-md-4-12 padding-top padding-left">
          <label className="form-label" htmlFor="seachText">Offender name or number</label>
          <ValidationErrors validationErrors={this.props.validationErrors} fieldName={'searchText'} />
          <input type="text" className="form-control width100" id="search-text" name="searchText" maxLength="30"
            value={this.props.searchText} onChange={this.props.handleSearchTextChange}/>
        </div>
        <div className="pure-u-md-5-12 padding-top padding-left">
          {locationSelect}
        </div>
        <div className="pure-u-md-2-12 padding-top padding-left">
          <label className="form-label">&nbsp;</label>
          <button className="button" onClick={() => this.props.handleSubmit(this.props.history)}>Search again</button>
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
  handleSubmit: PropTypes.func,
  history: PropTypes.object.isRequired
};

const OffenderSearchWithRouter = withRouter(OffenderSearch);

export { OffenderSearch };
export default OffenderSearchWithRouter;
