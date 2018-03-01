import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { setKeyworkerSearchText, setKeyworkerSearchResults, setError } from '../../redux/actions/index';
import { connect } from 'react-redux';
import KeyworkerSearchResults from '../components/KeyworkerSearchResults';

import axiosWrapper from "../../backendWrapper";

class KeyworkerSearchResultsContainer extends Component {
  constructor () {
    super();
    this.displayError = this.displayError.bind(this);
    this.getKeyworkerList = this.getKeyworkerList.bind(this);
  }

  async componentWillMount () {
    await this.performSearch();
  }

  async performSearch () {
    try {
      const list = await this.getKeyworkerList(this.props.agencyId);
      this.props.keyworkerSearchResultsDispatch(list);
    } catch (error) {
      this.displayError(error);
    }
  }

  handleSearchTextChange (event) {
    this.props.keyworkerSearchTextDispatch(event.target.value);
  }

  async getKeyworkerList (agencyId) {
    const response = await axiosWrapper.get('/keyworkerSearch', {
      headers: {
        jwt: this.props.jwt
      },
      params: {
        agencyId: agencyId,
        searchText: this.props.searchText
      }
    });
    return response.data;
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
    return (<KeyworkerSearchResults {...this.props} handleSearchTextChange={(event) => this.handleSearchTextChange(event)}
      handleSearch={() => this.performSearch()}/>);
  }
}

KeyworkerSearchResultsContainer.propTypes = {
  error: PropTypes.string,
  paramStaffId: PropTypes.string,
  searchText: PropTypes.string,
  jwt: PropTypes.string.isRequired,
  agencyId: PropTypes.string.isRequired,
  setErrorDispatch: PropTypes.func,
  keyworkerSearchResultsDispatch: PropTypes.func,
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
    keyworkerSearchResultsDispatch: list => dispatch(setKeyworkerSearchResults(list)),
    keyworkerSearchTextDispatch: text => dispatch(setKeyworkerSearchText(text)),
    setErrorDispatch: error => dispatch(setError(error))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(KeyworkerSearchResultsContainer);

