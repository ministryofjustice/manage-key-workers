import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { setKeyworkerSearchText, setKeyworkerSearchResults, setLoaded, resetError, setKeyworkerStatusFilter, setSettings } from '../../redux/actions/index';
import { connect } from 'react-redux';
import KeyworkerSearchResults from '../components/KeyworkerSearchResults';
import Spinner from '../../Spinner';

import axios from 'axios';
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

  async performSearch () {
    this.props.resetErrorDispatch();
    this.props.setLoadedDispatch(false);
    try {
      const list = await this.getKeyworkerList(this.props.agencyId);
      this.props.keyworkerSearchResultsDispatch(list);
    } catch (error) {
      this.props.handleError(error);
    }
    this.props.setLoadedDispatch(true);
  }

  async getKeyworkerSettings () {
    try {
      const keyworkerSettings = await axios.get('/api/keyworkerSettings');
      this.props.keyworkerSettingsDispatch(keyworkerSettings.data);
    } catch (error) {
      this.props.setErrorDispatch(error.message);
    }
  }

  handleSearchTextChange (event) {
    this.props.keyworkerSearchTextDispatch(event.target.value);
  }

  handleStatusFilterChange (event) {
    this.props.keyworkerStatusFilterDispatch(event.target.value);
  }

  async getKeyworkerList (agencyId) {
    const response = await axios.get('/api/keyworkerSearch', {
      params: {
        agencyId: agencyId,
        searchText: this.props.searchText,
        statusFilter: this.props.statusFilter
      }
    });
    return response.data;
  }

  render () {
    let inner;
    if (this.props.loaded) {
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
