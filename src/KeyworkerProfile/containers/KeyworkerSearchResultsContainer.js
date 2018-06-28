import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { setKeyworkerSearchText, setKeyworkerSearchResults, setLoaded, resetError } from '../../redux/actions/index';
import { connect } from 'react-redux';
import KeyworkerSearchResults from '../components/KeyworkerSearchResults';
import Spinner from '../../Spinner';

import axios from 'axios';
import Error from "../../Error";
import { setKeyworkerStatusFilter } from "../../redux/actions";

class KeyworkerSearchResultsContainer extends Component {
  constructor (props) {
    super();
    this.getKeyworkerList = this.getKeyworkerList.bind(this);
    this.handleSearchTextChange = this.handleSearchTextChange.bind(this);
    this.handleStatusFilterChange = this.handleStatusFilterChange.bind(this);
    this.performSearch = this.performSearch.bind(this);
  }

  async componentDidMount () {
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
  setLoadedDispatch: PropTypes.func,
  resetErrorDispatch: PropTypes.func,
  handleError: PropTypes.func.isRequired,
  loaded: PropTypes.bool
};

const mapStateToProps = state => {
  return {
    searchText: state.keyworkerSearch.searchText,
    statusFilter: state.keyworkerSearch.statusFilter,
    agencyId: state.app.user.activeCaseLoadId,
    keyworkerList: state.keyworkerSearch.keyworkerSearchResults,
    loaded: state.app.loaded
  };
};

const mapDispatchToProps = dispatch => {
  return {
    keyworkerSearchResultsDispatch: list => dispatch(setKeyworkerSearchResults(list)),
    keyworkerSearchTextDispatch: text => dispatch(setKeyworkerSearchText(text)),
    keyworkerStatusFilterDispatch: status => dispatch(setKeyworkerStatusFilter(status)),
    setLoadedDispatch: (status) => dispatch(setLoaded(status)),
    resetErrorDispatch: () => dispatch(resetError())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(KeyworkerSearchResultsContainer);
