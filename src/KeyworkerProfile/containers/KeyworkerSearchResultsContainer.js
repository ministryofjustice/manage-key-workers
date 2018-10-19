import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';
import { setKeyworkerSearchText, setKeyworkerSearchResults, setLoaded, resetError, setKeyworkerStatusFilter, setSettings } from '../../redux/actions/index';
import KeyworkerSearchResults from '../components/KeyworkerSearchResults';
import Spinner from '../../Spinner';

import Error from "../../Error";

class KeyworkerSearchResultsContainer extends Component {
  constructor (props) {
    super();
    this.getKeyworkerList = this.getKeyworkerList.bind(this);
    this.handleSearchTextChange = this.handleSearchTextChange.bind(this);
    this.handleStatusFilterChange = this.handleStatusFilterChange.bind(this);
    this.performSearch = this.performSearch.bind(this);
  }

  async componentDidMount () {
    await this.getKeyworkerSettings();
    await this.performSearch();
  }

  async getKeyworkerSettings () {
    const { keyworkerSettingsDispatch, setErrorDispatch } = this.props;

    try {
      const keyworkerSettings = await axios.get('/api/keyworkerSettings');
      keyworkerSettingsDispatch(keyworkerSettings.data);
    } catch (error) {
      setErrorDispatch(error.message);
    }
  }

  async getKeyworkerList (agencyId) {
    const { searchText, statusFilter } = this.props;
    const response = await axios.get('/api/keyworkerSearch', {
      params: {
        agencyId,
        searchText,
        statusFilter,
      }
    });
    return response.data;
  }

  handleSearchTextChange (event) {
    const { keyworkerSearchTextDispatch } = this.props;

    keyworkerSearchTextDispatch(event.target.value);
  }

  handleStatusFilterChange (event) {
    const { keyworkerStatusFilterDispatch } = this.props;

    keyworkerStatusFilterDispatch(event.target.value);
  }

  async performSearch () {
    const {
      agencyId,
      resetErrorDispatch,
      setLoadedDispatch,
      keyworkerSearchResultsDispatch,
      handleError
    } = this.props;

    resetErrorDispatch();
    setLoadedDispatch(false);
    try {
      const list = await this.getKeyworkerList(agencyId);
      keyworkerSearchResultsDispatch(list);
    } catch (error) {
      handleError(error);
    }
    setLoadedDispatch(true);
  }

  render () {
    let inner;
    const { loaded } = this.props;

    if (loaded) {
      inner = (<KeyworkerSearchResults {...this.props}
        handleSearchTextChange={this.handleSearchTextChange}
        handleStatusFilterChange={this.handleStatusFilterChange}
        handleSearch={this.performSearch}/>);
    } else {
      inner = <Spinner/>;
    }

    return <div><Error {...this.props} /> {inner} </div>;
  }
}

KeyworkerSearchResultsContainer.propTypes = {
  error: PropTypes.string,
  paramStaffId: PropTypes.string,
  searchText: PropTypes.string,
  statusFilter: PropTypes.string,
  agencyId: PropTypes.string.isRequired,
  keyworkerSearchResultsDispatch: PropTypes.func,
  keyworkerSearchTextDispatch: PropTypes.func,
  keyworkerStatusFilterDispatch: PropTypes.func,
  keyworkerSettingsDispatch: PropTypes.func,
  setLoadedDispatch: PropTypes.func,
  setErrorDispatch: PropTypes.func,
  resetErrorDispatch: PropTypes.func,
  handleError: PropTypes.func.isRequired,
  keyworkerSettings: PropTypes.object,
  loaded: PropTypes.bool
};

const mapStateToProps = state => {
  return {
    searchText: state.keyworkerSearch.searchText,
    statusFilter: state.keyworkerSearch.statusFilter,
    agencyId: state.app.user.activeCaseLoadId,
    keyworkerList: state.keyworkerSearch.keyworkerSearchResults,
    loaded: state.app.loaded,
    keyworkerSettings: state.keyworkerSettings
  };
};

const mapDispatchToProps = dispatch => {
  return {
    keyworkerSearchResultsDispatch: list => dispatch(setKeyworkerSearchResults(list)),
    keyworkerSearchTextDispatch: text => dispatch(setKeyworkerSearchText(text)),
    keyworkerStatusFilterDispatch: status => dispatch(setKeyworkerStatusFilter(status)),
    setLoadedDispatch: (status) => dispatch(setLoaded(status)),
    resetErrorDispatch: () => dispatch(resetError()),
    keyworkerSettingsDispatch: (settings) => dispatch(setSettings(settings))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(KeyworkerSearchResultsContainer);
