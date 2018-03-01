import React, { Component } from 'react';
import '../index.scss';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

class KeyworkerSearch extends Component {
  render () {
    return (
      <div>
        <div className="pure-u-md-12-12 searchForm">
          <div className="padding-top padding-left padding-right padding-bottom-large">
            <label className="form-label" htmlFor="seachText">key worker name</label>
            <input type="text" className="form-control" id="search-text" name="searchText" value={this.props.searchText} onChange={this.props.handleSearchTextChange}/>
            <button className="button margin-left" onClick={() => { this.props.handleSearch(this.props.history);}}>Search ></button>
          </div>
        </div>
      </div>
    );
  }
}

KeyworkerSearch.propTypes = {
  searchText: PropTypes.string,
  history: PropTypes.object,
  handleSearch: PropTypes.func.isRequired,
  handleSearchTextChange: PropTypes.func.isRequired
};

const KeyworkerSearchWithRouter = withRouter(KeyworkerSearch);

export { KeyworkerSearch };
export default KeyworkerSearchWithRouter;
