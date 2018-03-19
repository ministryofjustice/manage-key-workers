import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { setKeyworkerSearchText, setKeyworkerSearchResults, setLoaded } from '../../redux/actions/index';
import { connect } from 'react-redux';
import KeyworkerSearchResults from '../components/KeyworkerSearchResults';

import axiosWrapper from "../../backendWrapper";
import Error from "../../Error";

class KeyworkerSearchResultsContainer extends Component {
  constructor (props) {
    super();
    this.getKeyworkerList = this.getKeyworkerList.bind(this);
    props.setLoadedDispatch(false);
  }

  async componentDidMount () {
    await this.performSearch();
    this.props.setLoadedDispatch(true);
  }

  async performSearch () {
    try {
      const list = await this.getKeyworkerList(this.props.agencyId);
      this.props.keyworkerSearchResultsDispatch(list);
    } catch (error) {
      this.props.displayError(error);
    }
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
    if (this.props.error) {
      return <Error {...this.props} />;
    }
    if (this.props.loaded) {
      return (<KeyworkerSearchResults {...this.props} handleSearchTextChange={(event) => this.handleSearchTextChange(event)}
        handleSearch={() => this.performSearch()}/>);
    }
    return null;
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
  loaded: PropTypes.boolean
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
    setLoadedDispatch: (status) => dispatch(setLoaded(status))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(KeyworkerSearchResultsContainer);

