import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setKeyworkerSearchText, resetError } from '../../redux/actions/index';
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
    const { keyworkerSearchTextDispatch } = this.props;

    keyworkerSearchTextDispatch(event.target.value);
  }

  handleStatusFilterChange (event) {
    const { keyworkerStatusFilterDispatch } = this.props;

    keyworkerStatusFilterDispatch(event.target.value);
  }

  handleSearch (history) {
    history.push('/keyworker/results');
  }

  render () {
    const { error } = this.props;

    if (error) return <Error {...this.props} />;

    return (
      <KeyworkerSearchPage
        handleSearchTextChange={this.handleSearchTextChange}
        handleStatusFilterChange={this.handleStatusFilterChange}
        handleSearch={this.handleSearch}
        {...this.props}
      />
    );
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

const mapStateToProps = state => ({
    searchText: state.keyworkerSearch.searchText,
    statusFilter: state.keyworkerSearch.statusFilter,
    agencyId: state.app.user.activeCaseLoadId,
    keyworkerList: state.keyworkerSearch.keyworkerSearchResults
  });

const mapDispatchToProps = dispatch => ({
    keyworkerSearchTextDispatch: text => dispatch(setKeyworkerSearchText(text)),
    keyworkerStatusFilterDispatch: status => dispatch(setKeyworkerStatusFilter(status)),
    resetErrorDispatch: () => dispatch(resetError())
  });

export default connect(mapStateToProps, mapDispatchToProps)(KeyworkerSearchContainer);

