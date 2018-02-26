import React, { Component } from 'react';
import './index.scss';

class PrisonerSearch extends Component {
  render () {
    const housingLocations = [{ id: 123, description: "block 1" }, { id: 223, description: "block 2" }].map((kw, optionIndex) => {
      return <option key={`housinglocation_option_${optionIndex}_${kw.id}`} value={kw.id}>{kw.description}</option>;
    });
    return (

      <div>

        <div className="pure-u-md-12-12 searchForm">
          <div className="padding-top padding-left padding-right">
            <label className="form-label" htmlFor="seachText">Prisoner name or number</label>
            <input type="text" className="form-control" id="search-text" name="searchText" value={this.props.searchText} onChange={this.props.handleSearchTextChange}/>
            <button className="button" onClick={() => this.props.gotoNext()}>Search ></button>
          </div>
          <div className="padding-top padding-left padding-right padding-bottom-large">
            <div className="pure-u-md-5-12 padding-right">
              <label className="form-label" htmlFor="housing-location-select">Housing location</label>
              <select id="housing-location-select" name="housing-location-select" className="form-control" value={this.props.HousingLocation}
                onChange={this.props.handleSearchHousingLocationChange}>
                <option key="choose" value="--">-- Select --</option>
                {housingLocations}
              </select>
            </div>
            <div className="pure-u-md-3-12 ">
              <label className="form-label" htmlFor="allocation-status-select">Allocation status</label>
              <select id="allocation-status-select" name="allocation-status-select" className="form-control" value={this.props.AllocationStatus}
                onChange={this.props.handleSearchAllocationStatusChange}>
                <option key="allocation-status-option-not-allocated" value="N">Not allocated</option>
                <option key="allocation-status-option-allocated" value="A">Allocated</option>
                <option key="allocation-status-option-all" value="All">All</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


export default PrisonerSearch;
