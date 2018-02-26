import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import axiosWrapper from '../backendWrapper';
import { setCurrentPage, setPrisonerSearchText, setPrisonerSearchAllocationStatus, setPrisonerSearchHousingLocation, setError, setMessage } from '../actions';
import { connect } from 'react-redux';

import AssignTransfer from "./index";

class AssignTransferContainer extends Component {
  constructor () {
    super();
    this.displayError = this.displayError.bind(this);
  }

  handleSearchTextChange (event) {
    this.props.prisonerSearchTextDispatch(event.target.value);
  }

  handleSearchAllocationStatusChange (event) {
    this.props.prisonerSearchAllocationStatusDispatch(event.target.value);
  }

  handleSearchHousingLocationChange (event) {
    this.props.prisonerSearchHousingLocationDispatch(event.target.value);
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
    return (<AssignTransfer handleSearchTextChange={(event) => this.handleSearchTextChange(event)}
      handleSearchAllocationStatusChange={(event) => this.handleSearchAllocationStatusChange(event)}
      handleSearchHousingLocationChange={(event) => this.handleSearchHousingLocationChange(event)} {...this.props}/>);
    /*switch (this.props.page) {
      case 1:
        return <Unallocated gotoNext={this.gotoManualAllocation} {...this.props} />;
      case 2:
        return (<ManualAllocation handleKeyworkerChange={this.handleKeyworkerChange} postManualOverride={this.postManualOverride}
          applyDateFilter={this.applyDateFilter} handleDateFilterChange={this.handleDateFilterChange} {...this.props} />);
      default:
        return "";
    }*/
  }
}

AssignTransferContainer.propTypes = {
  error: PropTypes.string,
  page: PropTypes.number.isRequired,
  searchText: PropTypes.string,
  allocationStatus: PropTypes.string,
  housingLocation: PropTypes.string,
  setCurrentPageDispatch: PropTypes.func.isRequired,
  setErrorDispatch: PropTypes.func.isRequired,
  setMessageDispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    searchText: state.searchText,
    allocationStatus: state.allocationStatus,
    housingLocation: state.housingLocation,
    page: state.app.page,
    error: state.app.error,
    message: state.app.message,
    agencyId: state.app.user.activeCaseLoadId
  };
};

const mapDispatchToProps = dispatch => {
  return {
    prisonerSearchTextDispatch: text => dispatch(setPrisonerSearchText(text)),
    prisonerSearchAllocationStatusDispatch: status => dispatch(setPrisonerSearchAllocationStatus(status)),
    prisonerSearchHousingLocationDispatch: location => dispatch(setPrisonerSearchHousingLocation(location)),
    setCurrentPageDispatch: page => dispatch(setCurrentPage(page)),
    setErrorDispatch: error => dispatch(setError(error)),
    setMessageDispatch: message => dispatch(setMessage(message))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AssignTransferContainer);
