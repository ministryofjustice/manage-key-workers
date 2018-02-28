import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { setCurrentPage, setKeyworkerSearchText, setKeyworkerSearchResults, setKeyworkerAllocationList, setKeyworker, setError } from '../redux/actions';
import { connect } from 'react-redux';
import KeyworkerSearchResults from './keyworkerSearchResults';
import KeyworkerProfile from './profile';

import KeyworkerSearchPage from "./index";
import axiosWrapper from "../backendWrapper";

class KeyworkerProfileContainer extends Component {
  constructor () {
    super();
    this.displayError = this.displayError.bind(this);
    this.getKeyworkerList = this.getKeyworkerList.bind(this);
    this.gotoKeyworkerResults = this.gotoKeyworkerResults.bind(this);
    this.gotoKeyworkerProfile = this.gotoKeyworkerProfile.bind(this);
  }

  componentWillMount () {
    if (this.props.paramStaffId) {
      this.gotoKeyworkerProfile(this.props.paramStaffId);
    } else {
      this.props.setCurrentPageDispatch(1);
    }
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

  async gotoKeyworkerProfile (staffId) {
    try {
      const keyworker = await this.getKeyworkerDetails(this.props.agencyId, staffId);
      const allocations = await this.getKeyworkerAllocations(this.props.agencyId, staffId);
      this.props.keyworkerDispatch(keyworker);
      this.props.keyworkerAllocationsDispatch(allocations);
      this.props.setCurrentPageDispatch(3);
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

  async getKeyworkerAllocations (agencyId, staffId) {
    const response = await axiosWrapper.get('/keyworkerAllocations', {
      headers: {
        jwt: this.props.jwt
      },
      params: {
        agencyId: agencyId,
        keyworkerStaffId: staffId
      }
    });
    return response.data;
  }

  async getKeyworkerDetails (agencyId, staffId) {
    const response = await axiosWrapper.get('/keyworker', {
      headers: {
        jwt: this.props.jwt
      },
      params: {
        agencyId: agencyId,
        keyworkerStaffId: staffId
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
        return (<KeyworkerSearchPage gotoNext={this.gotoKeyworkerResults}
          handleSearchTextChange={(event) => this.handleSearchTextChange(event)} {...this.props}/>);
      case 2:
        return <KeyworkerSearchResults {...this.props} gotoNext={this.gotoKeyworkerResults} handleSearchTextChange={(event) => this.handleSearchTextChange(event)}/>;
      case 3:
        return <KeyworkerProfile {...this.props} />;
      default:
        return "";
    }
  }
}

KeyworkerProfileContainer.propTypes = {
  error: PropTypes.string,
  paramStaffId: PropTypes.string,
  page: PropTypes.number.isRequired,
  searchText: PropTypes.string,
  jwt: PropTypes.string.isRequired,
  agencyId: PropTypes.string.isRequired,
  setCurrentPageDispatch: PropTypes.func,
  setErrorDispatch: PropTypes.func,
  keyworkerSearchTextDispatch: PropTypes.func,
  keyworkerAllocationsDispatch: PropTypes.func,
  keyworkerSearchResultsDispatch: PropTypes.func,
  keyworkerDispatch: PropTypes.func
};

const mapStateToProps = state => {
  return {
    searchText: state.keyworkerSearch.searchText,
    page: state.app.page,
    error: state.app.error,
    agencyId: state.app.user.activeCaseLoadId,
    jwt: state.app.jwt,
    keyworkerList: state.keyworkerSearch.keyworkerSearchResults,
    keyworkerAllocations: state.keyworkerSearch.keyworkerAllocations,
    keyworker: state.keyworkerSearch.keyworker
  };
};

const mapDispatchToProps = dispatch => {
  return {
    keyworkerSearchTextDispatch: text => dispatch(setKeyworkerSearchText(text)),
    keyworkerSearchResultsDispatch: list => dispatch(setKeyworkerSearchResults(list)),
    keyworkerAllocationsDispatch: list => dispatch(setKeyworkerAllocationList(list)),
    keyworkerDispatch: id => dispatch(setKeyworker(id)),
    setCurrentPageDispatch: page => dispatch(setCurrentPage(page)),
    setErrorDispatch: error => dispatch(setError(error))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(KeyworkerProfileContainer);

