import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import OffenderResults from "../components/OffenderResults";

import axiosWrapper from "../../backendWrapper";
import { setKeyworkerChangeList, setOffenderSearchResults } from "../../redux/actions";

class OffenderResultsContainer extends Component {
  constructor () {
    super();
    this.doSearch = this.doSearch.bind(this);
    this.handleKeyworkerChange = this.handleKeyworkerChange.bind(this);
    this.postManualOverride = this.postManualOverride.bind(this);
  }

  componentWillMount () {
    this.doSearch();
  }

  async doSearch () {
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
      this.props.offenderSearchResultsDispatch(data);
    } catch (error) {
      this.props.offenderSearchResultsDispatch({
        keyworkerResponse: [],
        offenderResponse: [] });
      this.props.displayError(error);
    }
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
    return (<OffenderResults
      handleKeyworkerChange={this.handleKeyworkerChange}
      postManualOverride={this.postManualOverride}
      doSearch = {this.doSearch} {...this.props} />);
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
  displayError: PropTypes.func.isRequired,
  setMessageDispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    searchText: state.offenderSearch.searchText,
    allocationStatus: state.offenderSearch.allocationStatus,
    keyworkerChangeList: state.offenderSearch.keyworkerChangeList,
    housingLocation: state.offenderSearch.housingLocation,
    offenderResults: state.offenderSearch.offenderResults
  };
};

const mapDispatchToProps = dispatch => {
  return {
    offenderSearchResultsDispatch: resultList => dispatch(setOffenderSearchResults(resultList)),
    keyworkerChangeListDispatch: list => dispatch(setKeyworkerChangeList(list))
  };
};

export { OffenderResultsContainer };
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(OffenderResultsContainer));
