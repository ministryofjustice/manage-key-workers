import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axiosWrapper from '../backendWrapper';
import { setCurrentPage, setOffenderSearchText, setOffenderSearchAllocationStatus, setOffenderSearchHousingLocation, setError, setMessage } from '../redux/actions';
import { connect } from 'react-redux';

import AssignTransfer from "./index";

class AssignTransferContainer extends Component {
  constructor () {
    super();
    this.displayError = this.displayError.bind(this);
  }

  handleSearchTextChange (event) {
    this.props.offenderSearchTextDispatch(event.target.value);
  }

  handleSearchAllocationStatusChange (event) {
    this.props.offenderSearchAllocationStatusDispatch(event.target.value);
  }

  handleSearchHousingLocationChange (event) {
    this.props.offenderSearchHousingLocationDispatch(event.target.value);
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
      handleSearchHousingLocationChange={(event) => this.handleSearchHousingLocationChange(event)}
      {...this.props}/>);
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
  offenderSearchTextDispatch: PropTypes.func,
  offenderSearchAllocationStatusDispatch: PropTypes.func,
  offenderSearchHousingLocationDispatch: PropTypes.func
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
    offenderSearchTextDispatch: text => dispatch(setOffenderSearchText(text)),
    offenderSearchAllocationStatusDispatch: status => dispatch(setOffenderSearchAllocationStatus(status)),
    offenderSearchHousingLocationDispatch: location => dispatch(setOffenderSearchHousingLocation(location)),
    setCurrentPageDispatch: page => dispatch(setCurrentPage(page)),
    setErrorDispatch: error => dispatch(setError(error)),
    setMessageDispatch: message => dispatch(setMessage(message))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AssignTransferContainer);
