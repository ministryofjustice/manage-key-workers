import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import OffenderResults from "../components/OffenderResults";
import Spinner from '../../Spinner';

import axiosWrapper from "../../backendWrapper";
import { resetError, setKeyworkerChangeList, setLoaded, setOffenderSearchResults } from "../../redux/actions";

class OffenderResultsContainer extends Component {
  constructor (props) {
    super();
    this.doSearch = this.doSearch.bind(this);
    this.handleKeyworkerChange = this.handleKeyworkerChange.bind(this);
    this.postManualOverride = this.postManualOverride.bind(this);
  }

  async componentWillMount () {
    /* if arriving from a page refresh - redirect to initial search */
    if (!this.props.locations || this.props.locations.length === 0) {
      console.log("\nredirecting after refresh");
      this.props.history.push({
        pathname: '/offender/search',
        state: { initialSearch: true }
      });
    } else {
      await this.doSearch();
    }
  }

  async doSearch () {
    this.props.resetErrorDispatch();
    this.props.setLoadedDispatch(false);
    try {
      const response = await axiosWrapper.get('/api/searchOffenders', {
        params: {
          locationPrefix: this.props.housingLocation,
          keywords: this.props.searchText,
          allocationStatus: this.props.allocationStatus,
          agencyId: this.props.agencyId
        }
      });
      const data = await response.data;
      this.props.keyworkerChangeListDispatch([]);
      this.props.offenderSearchResultsDispatch(data);
    } catch (error) {
      this.props.offenderSearchResultsDispatch({
        keyworkerResponse: [],
        offenderResponse: [] });
      this.props.displayError(error);
    }
    this.props.setLoadedDispatch(true);
  }

  handleKeyworkerChange (event, index, offenderNo) {
    const keyworkerChangeList = this.props.keyworkerChangeList ? [...this.props.keyworkerChangeList] : [];
    if (event.target.value === '--') {
      keyworkerChangeList[index] = null;
    } else {
      keyworkerChangeList[index] = {
        staffId: event.target.value,
        offenderNo: offenderNo
      };
    }
    this.props.keyworkerChangeListDispatch(keyworkerChangeList);
  }

  async postManualOverride (history) {
    try {
      if (this.props.keyworkerChangeList && this.props.keyworkerChangeList.length > 0) {
        await axiosWrapper.post('/api/manualoverride', { allocatedKeyworkers: this.props.keyworkerChangeList }, { params: { agencyId: this.props.agencyId } });
        this.props.setMessageDispatch('Key workers successfully updated.');
      }
      history.push('/');
    } catch (error) {
      this.props.displayError(error);
    }
  }

  render () {
    if (this.props.loaded) {
      return (<OffenderResults
        handleKeyworkerChange={this.handleKeyworkerChange}
        postManualOverride={this.postManualOverride}
        doSearch={this.doSearch} {...this.props} />);
    }
    return <Spinner />;
  }
}

OffenderResultsContainer.propTypes = {
  error: PropTypes.string,
  searchText: PropTypes.string,
  allocationStatus: PropTypes.string,
  housingLocation: PropTypes.string,
  agencyId: PropTypes.string.isRequired,
  offenderSearchResultsDispatch: PropTypes.func.isRequired,
  keyworkerChangeListDispatch: PropTypes.func.isRequired,
  keyworkerChangeList: PropTypes.array,
  locations: PropTypes.array,
  displayError: PropTypes.func.isRequired,
  setMessageDispatch: PropTypes.func.isRequired,
  resetErrorDispatch: PropTypes.func,
  setLoadedDispatch: PropTypes.func.isRequired,
  loaded: PropTypes.bool,
  history: PropTypes.object
};

const mapStateToProps = state => {
  return {
    searchText: state.offenderSearch.searchText,
    allocationStatus: state.offenderSearch.allocationStatus,
    keyworkerChangeList: state.offenderSearch.keyworkerChangeList,
    housingLocation: state.offenderSearch.housingLocation,
    offenderResults: state.offenderSearch.offenderResults,
    agencyId: state.app.user.activeCaseLoadId,
    locations: state.offenderSearch.locations,
    loaded: state.app.loaded
  };
};

const mapDispatchToProps = dispatch => {
  return {
    offenderSearchResultsDispatch: resultList => dispatch(setOffenderSearchResults(resultList)),
    keyworkerChangeListDispatch: list => dispatch(setKeyworkerChangeList(list)),
    setLoadedDispatch: (status) => dispatch(setLoaded(status)),
    resetErrorDispatch: () => dispatch(resetError())
  };
};

export { OffenderResultsContainer };
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(OffenderResultsContainer));
