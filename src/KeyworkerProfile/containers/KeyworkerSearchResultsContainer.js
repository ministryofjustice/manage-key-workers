import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { setKeyworkerSearchText, setKeyworkerSearchResults } from '../../redux/actions/index';
import { connect } from 'react-redux';
import KeyworkerSearchResults from '../components/KeyworkerSearchResults';

import axiosWrapper from "../../backendWrapper";
import Error from "../../Error";

class KeyworkerSearchResultsContainer extends Component {
  constructor () {
    super();
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
    return (<KeyworkerSearchResults {...this.props} handleSearchTextChange={(event) => this.handleSearchTextChange(event)}
      handleSearch={() => this.performSearch()}/>);
  }
}

KeyworkerSearchResultsContainer.propTypes = {
  error: PropTypes.string,
  paramStaffId: PropTypes.string,
  searchText: PropTypes.string,
  agencyId: PropTypes.string.isRequired,
  keyworkerSearchResultsDispatch: PropTypes.func,
  keyworkerSearchTextDispatch: PropTypes.func,
  displayError: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    searchText: state.keyworkerSearch.searchText,
    agencyId: state.app.user.activeCaseLoadId,
    keyworkerList: state.keyworkerSearch.keyworkerSearchResults
  };
};

const mapDispatchToProps = dispatch => {
  return {
    keyworkerSearchResultsDispatch: list => dispatch(setKeyworkerSearchResults(list)),
    keyworkerSearchTextDispatch: text => dispatch(setKeyworkerSearchText(text))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(KeyworkerSearchResultsContainer);

