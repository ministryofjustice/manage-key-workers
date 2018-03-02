import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { setKeyworkerSearchText } from '../../redux/actions/index';
import { connect } from 'react-redux';
import Error from '../../Error';

import KeyworkerSearchPage from "../components/KeyworkerSearchPage";

class KeyworkerSearchContainer extends Component {
  handleSearchTextChange (event) {
    this.props.keyworkerSearchTextDispatch(event.target.value);
  }

  handleSearch (history) {
    history.push('/keyworker/results');
  }

  render () {
    if (this.props.error) {
      return <Error {...this.props} />;
    }
    return (<KeyworkerSearchPage
      handleSearchTextChange={(event) => this.handleSearchTextChange(event)} handleSearch={(history) => this.handleSearch(history)} {...this.props}/>);
  }
}

KeyworkerSearchContainer.propTypes = {
  searchText: PropTypes.string,
  error: PropTypes.string,
  jwt: PropTypes.string.isRequired,
  agencyId: PropTypes.string.isRequired,
  keyworkerSearchTextDispatch: PropTypes.func
};

const mapStateToProps = state => {
  return {
    searchText: state.keyworkerSearch.searchText,
    agencyId: state.app.user.activeCaseLoadId,
    keyworkerList: state.keyworkerSearch.keyworkerSearchResults
  };
};

const mapDispatchToProps = dispatch => {
  return {
    keyworkerSearchTextDispatch: text => dispatch(setKeyworkerSearchText(text))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(KeyworkerSearchContainer);

