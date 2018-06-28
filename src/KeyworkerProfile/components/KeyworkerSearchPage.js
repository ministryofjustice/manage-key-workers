import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import Status from "./Status";

class KeyworkerSearchPage extends Component {
  render () {
    return (
      <div>
        {this.props.displayBack()}
        <div className="pure-g">
          <div className="pure-u-md-8-12">
            <h1 className="heading-large margin-top">Search for a key worker</h1>
            <div className="searchForm padding-top padding-left-30 padding-right padding-bottom-large">
              <label className="form-label" htmlFor="seachText">Key worker name</label>
              <input type="text" className="pure-u-md-9-12 form-control" id="search-text" name="searchText" value={this.props.searchText} onChange={this.props.handleSearchTextChange}/>
              <button className="button margin-left" onClick={() => { this.props.handleSearch(this.props.history);}}>Search</button>
              <div className="pure-u-md-4-12 margin-top" style={{ display: 'block' }}>
                <label className="form-label" htmlFor="status-select">Status</label>
                <Status optional statusValue={this.props.statusFilter} handleStatusChange={this.props.handleStatusFilterChange} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

KeyworkerSearchPage.propTypes = {
  displayBack: PropTypes.func.isRequired,
  searchText: PropTypes.string,
  statusFilter: PropTypes.string,
  history: PropTypes.object,
  handleSearch: PropTypes.func.isRequired,
  handleSearchTextChange: PropTypes.func.isRequired,
  handleStatusFilterChange: PropTypes.func.isRequired,
  statusValue: PropTypes.string
};

const KeyworkerSearchPageWithRouter = withRouter(KeyworkerSearchPage);

export { KeyworkerSearchPage };
export default KeyworkerSearchPageWithRouter;
