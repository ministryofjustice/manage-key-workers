import React, { Component } from 'react';
import './index.scss';
import PropTypes from 'prop-types';

class KeyworkerSearch extends Component {
  render () {
    return (
      <div>
        <div className="pure-u-md-12-12 searchForm">
          <div className="padding-top padding-left padding-right padding-bottom-large">
            <label className="form-label" htmlFor="seachText">key worker name</label>
            <input type="text" className="form-control" id="search-text" name="searchText" value={this.props.searchText} onChange={this.props.handleSearchTextChange}/>
            <button className="button margin-left" onClick={() => this.props.gotoNext()}>Search ></button>
          </div>
        </div>
      </div>
    );
  }
}

KeyworkerSearch.propTypes = {
  searchText: PropTypes.string,
  gotoNext: PropTypes.func.isRequired,
  handleSearchTextChange: PropTypes.func.isRequired
};

export default KeyworkerSearch;
