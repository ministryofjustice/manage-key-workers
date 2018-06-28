import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { setKeyworkerSearchText, resetError } from '../../redux/actions/index';
import { connect } from 'react-redux';
import Error from '../../Error';

import KeyworkerSearchPage from "../components/KeyworkerSearchPage";
import { setKeyworkerStatusFilter } from "../../redux/actions";

class KeyworkerSearchContainer extends Component {
  constructor (props) {
    super();
    this.handleSearchTextChange = this.handleSearchTextChange.bind(this);
    this.handleStatusFilterChange = this.handleStatusFilterChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    props.resetErrorDispatch();
    props.keyworkerSearchTextDispatch('');
    props.keyworkerStatusFilterDispatch('');
  }

  handleSearchTextChange (event) {
    this.props.keyworkerSearchTextDispatch(event.target.value);
  }

  handleStatusFilterChange (event) {
    this.props.keyworkerStatusFilterDispatch(event.target.value);
  }

  handleSearch (history) {
    history.push('/keyworker/results');
  }

  render () {
    if (this.props.error) {
      return <Error {...this.props} />;
    }
    return (<KeyworkerSearchPage
      handleSearchTextChange={this.handleSearchTextChange}
      handleStatusFilterChange={this.handleStatusFilterChange}
      handleSearch={this.handleSearch}
      {...this.props}/>);
  }
}

KeyworkerSearchContainer.propTypes = {
  searchText: PropTypes.string,
  error: PropTypes.string,
  agencyId: PropTypes.string.isRequired,
  keyworkerSearchTextDispatch: PropTypes.func,
  keyworkerStatusFilterDispatch: PropTypes.func,
  resetErrorDispatch: PropTypes.func
};

const mapStateToProps = state => {
  return {
    searchText: state.keyworkerSearch.searchText,
    statusFilter: state.keyworkerSearch.statusFilter,
    agencyId: state.app.user.activeCaseLoadId,
    keyworkerList: state.keyworkerSearch.keyworkerSearchResults
  };
};

const mapDispatchToProps = dispatch => {
  return {
    keyworkerSearchTextDispatch: text => dispatch(setKeyworkerSearchText(text)),
    keyworkerStatusFilterDispatch: status => dispatch(setKeyworkerStatusFilter(status)),
    resetErrorDispatch: () => dispatch(resetError())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(KeyworkerSearchContainer);

