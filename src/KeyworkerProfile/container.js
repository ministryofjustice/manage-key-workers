import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { setCurrentPage, setKeyworkerSearchText, setKeyworkerSearchResults, setError } from '../redux/actions';
import { connect } from 'react-redux';
import KeyworkerSearchResults from './keyworkerSearchResults';

import KeyworkerProfile from "./index";
import axiosWrapper from "../backendWrapper";

class KeyworkerProfileContainer extends Component {
  constructor () {
    super();
    this.displayError = this.displayError.bind(this);
    this.getKeyworkerList = this.getKeyworkerList.bind(this);
    this.gotoKeyworkerResults = this.gotoKeyworkerResults.bind(this);
  }

  componentWillMount () {
    this.props.setCurrentPageDispatch(1);
  }
  handleSearchTextChange (event) {
    this.props.keyworkerSearchTextDispatch(event.target.value);
  }

  async gotoKeyworkerResults () {
    try {
      const list = await this.getKeyworkerList(this.props.agencyId);
      this.props.keyworkerSearchResultsDispatch(list);
      this.props.setCurrentPageDispatch(2);
    } catch (error) {
      this.displayError(error);
    }
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
    switch (this.props.page) {
      case 1:
        return (<KeyworkerProfile gotoNext={this.gotoKeyworkerResults}
          handleSearchTextChange={(event) => this.handleSearchTextChange(event)} {...this.props}/>);
      case 2:
        return <KeyworkerSearchResults {...this.props} gotoNext={this.gotoKeyworkerResults} handleSearchTextChange={(event) => this.handleSearchTextChange(event)}/>;
      default:
        return "";
    }
  }
}

KeyworkerProfileContainer.propTypes = {
  error: PropTypes.string,
  page: PropTypes.number.isRequired,
  searchText: PropTypes.string,
  jwt: PropTypes.string.isRequired,
  agencyId: PropTypes.string.isRequired,
  setCurrentPageDispatch: PropTypes.func,
  setErrorDispatch: PropTypes.func,
  setMessageDispatch: PropTypes.func,
  keyworkerSearchTextDispatch: PropTypes.func,
  keyworkerSearchResultsDispatch: PropTypes.func
};

const mapStateToProps = state => {
  return {
    searchText: state.keyworkerSearch.searchText,
    page: state.app.page,
    error: state.app.error,
    agencyId: state.app.user.activeCaseLoadId,
    keyworkerList: state.keyworkerSearch.keyworkerSearchResults
  };
};

const mapDispatchToProps = dispatch => {
  return {
    keyworkerSearchTextDispatch: text => dispatch(setKeyworkerSearchText(text)),
    keyworkerSearchResultsDispatch: list => dispatch(setKeyworkerSearchResults(list)),
    setCurrentPageDispatch: page => dispatch(setCurrentPage(page)),
    setErrorDispatch: error => dispatch(setError(error))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(KeyworkerProfileContainer);

