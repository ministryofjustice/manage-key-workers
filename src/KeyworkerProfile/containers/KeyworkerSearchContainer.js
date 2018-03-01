import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { setKeyworkerSearchText, setError } from '../../redux/actions/index';
import { connect } from 'react-redux';

import KeyworkerSearchPage from "../components/KeyworkerSearchPage";

class KeyworkerSearchContainer extends Component {
  constructor () {
    super();
    this.displayError = this.displayError.bind(this);
  }

  handleSearchTextChange (event) {
    this.props.keyworkerSearchTextDispatch(event.target.value);
  }

  handleSearch (history) {
    history.push('/keyworker/results');
  }

  displayError (error) {
    this.props.setErrorDispatch((error.response && error.response.data) || 'Something went wrong: ' + error);
  }

  render () {
    if (this.props.error) {
      return (<div className="error-summary">
        <div className="error-message">
          <div> {this.props.error.message || this.props.error} </div>
        </div>
      </div>);
    }
    return (<KeyworkerSearchPage
      handleSearchTextChange={(event) => this.handleSearchTextChange(event)} handleSearch={(history) => this.handleSearch(history)} {...this.props}/>);
  }
}

KeyworkerSearchContainer.propTypes = {
  error: PropTypes.string,
  searchText: PropTypes.string,
  jwt: PropTypes.string.isRequired,
  agencyId: PropTypes.string.isRequired,
  setErrorDispatch: PropTypes.func,
  keyworkerSearchTextDispatch: PropTypes.func
};

const mapStateToProps = state => {
  return {
    searchText: state.keyworkerSearch.searchText,
    error: state.app.error,
    agencyId: state.app.user.activeCaseLoadId,
    jwt: state.app.jwt,
    keyworkerList: state.keyworkerSearch.keyworkerSearchResults
  };
};

const mapDispatchToProps = dispatch => {
  return {
    keyworkerSearchTextDispatch: text => dispatch(setKeyworkerSearchText(text)),
    setErrorDispatch: error => dispatch(setError(error))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(KeyworkerSearchContainer);

