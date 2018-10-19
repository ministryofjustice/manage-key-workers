import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import { properCaseName } from "../../stringUtils";
import { getStatusDescription } from "../keyworkerStatus";
import Status from "./Status";

class KeyworkerSearchResults extends Component {
  buildTableForRender () {
    const { keyworkerList } = this.props;

    if (!(keyworkerList && keyworkerList.map)) {
      return [];
    }

    return keyworkerList.map(a => {
      const formattedName = properCaseName(a.lastName) + ', ' + properCaseName(a.firstName);
      const keyworkerHref = '/keyworker/' + a.staffId + '/profile';
      return (
        <tr key={a.staffId}>
          <td className="row-gutters">
            <Link id={`key_worker_${a.staffId}_link`} title="Key worker profile link" className="link" to={keyworkerHref}>{formattedName}</Link>
          </td>
          <td className="row-gutters">{getStatusDescription(a.status)}</td>
          <td className="row-gutters">{a.numberAllocated}</td>
          <td className="row-gutters">{a.capacity}</td>
          <td className="row-gutters">{a.autoAllocationAllowed ? "Yes" : "No"}</td>
          <td className="row-gutters">{a.numKeyWorkerSessions}</td>
        </tr>
      );
    });
  }

  render () {
    const {
      keyworkerSettings,
      displayBack,
      statusFilter,
      handleStatusFilterChange,
      searchText,
      handleSearchTextChange,
      history,
      handleSearch
    } = this.props;
    const keyworkers = this.buildTableForRender();
    const kwFrequency = keyworkerSettings ? keyworkerSettings.sequenceFrequency : 1;

    return (
      <div>
        <div className="pure-g padding-bottom-large">
          {displayBack()}
          <div className="pure-u-md-12-12 ">
            <h1 className="heading-large margin-top">Search results</h1>
            <div>
              <div className="pure-u-md-11-12 searchForm padding-top padding-bottom-large padding-left-30">
                <div className="pure-u-md-4-12">
                  <label className="form-label" htmlFor="seachText">Key worker name</label>
                  <input type="text" className="full-width form-control" id="search-text" name="searchText" value={searchText} onChange={handleSearchTextChange}/>
                </div>
                <div className="pure-u-md-3-12 margin-left">
                  <label className="form-label" htmlFor="status-select">Status</label>
                  <Status filter statusValue={statusFilter} handleStatusChange={handleStatusFilterChange} />
                </div>
                <button className="button margin-left margin-top-large" onClick={() => { handleSearch(history);}}>Search again</button>
              </div>
            </div>
          </div>
          <div>
            <div className="lede padding-top-large padding-bottom-small bold">{keyworkers.length} Results:</div>
            <div className="pure-u-md-11-12">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Status</th>
                    <th>No. allocated prisoners</th>
                    <th>Capacity</th>
                    <th>Auto allocation</th>
                    <th>No. KW sessions<br/>(last {kwFrequency > 1 ? kwFrequency : ''} week{kwFrequency > 1 ? 's' : ''})</th>
                  </tr>
                </thead>
                <tbody>{keyworkers}</tbody>
              </table>
              {keyworkers.length === 0 && <div className="font-small padding-top-large padding-bottom padding-left">No Key workers found</div>}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

KeyworkerSearchResults.propTypes = {
  history: PropTypes.object.isRequired,
  keyworkerList: PropTypes.array,
  searchText: PropTypes.string,
  statusFilter: PropTypes.string,
  handleSearchTextChange: PropTypes.func.isRequired,
  handleStatusFilterChange: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
  displayBack: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  keyworkerSettings: PropTypes.object.isRequired
};


export default KeyworkerSearchResults;
