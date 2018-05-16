import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { setKeyworkerSearchText, setKeyworkerSearchResults, setLoaded, resetError } from '../../redux/actions/index';
import { connect } from 'react-redux';
import KeyworkerSearchResults from '../components/KeyworkerSearchResults';
import Spinner from '../../Spinner';

import axiosWrapper from "../../backendWrapper";
import Error from "../../Error";

class KeyworkerSearchResultsContainer extends Component {
  constructor (props) {
    super();
    this.getKeyworkerList = this.getKeyworkerList.bind(this);
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
      this.props.displayError(error);
    }
    this.props.setLoadedDispatch(true);
  }

  handleSearchTextChange (event) {
    this.props.keyworkerSearchTextDispatch(event.target.value);
  }

  async getKeyworkerList (agencyId) {
    const response = await axiosWrapper.get('/api/keyworkerSearch', {
      params: {
        agencyId: agencyId,
        searchText: this.props.searchText
      }
    });
    return response.data;
  }

  render () {
    let inner;
    if (this.props.loaded) {
      inner = (<KeyworkerSearchResults {...this.props} handleSearchTextChange={(event) => this.handleSearchTextChange(event)}
        handleSearch={() => this.performSearch()}/>);
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
  agencyId: PropTypes.string.isRequired,
  keyworkerSearchResultsDispatch: PropTypes.func,
  keyworkerSearchTextDispatch: PropTypes.func,
  setLoadedDispatch: PropTypes.func,
  displayError: PropTypes.func.isRequired,
  loaded: PropTypes.bool
};

const mapStateToProps = state => {
  return {
    searchText: state.keyworkerSearch.searchText,
    agencyId: state.app.user.activeCaseLoadId,
    keyworkerList: state.keyworkerSearch.keyworkerSearchResults,
    loaded: state.app.loaded
  };
};

const mapDispatchToProps = dispatch => {
  return {
    keyworkerSearchResultsDispatch: list => dispatch(setKeyworkerSearchResults(list)),
    keyworkerSearchTextDispatch: text => dispatch(setKeyworkerSearchText(text)),
    setLoadedDispatch: (status) => dispatch(setLoaded(status)),
    resetErrorDispatch: () => dispatch(resetError())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(KeyworkerSearchResultsContainer);

