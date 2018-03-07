import React, { Component } from 'react';
import '../index.scss';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

class OffenderSearch extends Component {
  render () {
    const housingLocations = [{ id: 123, description: "block 1" }, { id: 223, description: "block 2" }].map((kw, optionIndex) => {
      return <option key={`housinglocation_option_${optionIndex}_${kw.id}`} value={kw.id}>{kw.description}</option>;
    });
    return (
      <div>
        <div className="pure-u-md-12-12 searchForm">
          <div className="padding-top padding-left padding-right">
            <label className="form-label" htmlFor="seachText">Offender name or number</label>
            <input type="text" className="form-control" id="search-text" name="searchText" value={this.props.searchText} onChange={this.props.handleSearchTextChange}/>
            <button className="button margin-left" onClick={() => this.props.gotoNext(this.props.history)}>Search ></button>
          </div>
          <div className="padding-top padding-left padding-right padding-bottom-large">
            <div className="pure-u-md-5-12 padding-right">
              <label className="form-label" htmlFor="housing-location-select">Housing location</label>
              <select id="housing-location-select" name="housing-location-select" className="form-control" value={this.props.housingLocation}
                onChange={this.props.handleSearchHousingLocationChange}>
                <option key="choose" value="--">-- Select --</option>
                {housingLocations}
              </select>
            </div>
            <div className="pure-u-md-3-12 ">
              <label className="form-label" htmlFor="allocation-status-select">Allocation status</label>
              <select id="allocation-status-select" name="allocation-status-select" className="form-control" value={this.props.allocationStatus}
                onChange={this.props.handleSearchAllocationStatusChange}>
                <option key="allocation-status-option-all" value="">All</option>
                <option key="allocation-status-option-not-allocated" value="N">Not allocated</option>
                <option key="allocation-status-option-allocated" value="A">Allocated</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

OffenderSearch.propTypes = {
  searchText: PropTypes.string,
  housingLocation: PropTypes.string,
  allocationStatus: PropTypes.string,
  history: PropTypes.object,
  gotoNext: PropTypes.func.isRequired
};

const OffenderSearchWithRouter = withRouter(OffenderSearch);

export { OffenderSearch };
export default OffenderSearchWithRouter;
