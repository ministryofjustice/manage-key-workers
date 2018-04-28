import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import OffenderSearch from "../components/OffenderSearch";
import axiosWrapper from "../../backendWrapper";
import {
  resetValidationErrors, setKeyworkerChangeList,
  setOffenderSearchLocations, setValidationError
} from "../../redux/actions";

class OffenderSearchContainer extends Component {
  constructor () {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount () {
    this.getLocations();
    if (this.props.initialSearch) {
      this.props.offenderSearchTextDispatch('');
      this.props.offenderSearchAllocationStatusDispatch('all');
    }
  }

  async getLocations () {
    try {
      const response = await axiosWrapper.get('/api/userLocations');
      this.props.offenderSearchLocationsDispatch(response.data);
      // Use the first location by default
      if (this.props.initialSearch && response.data && response.data[0]) {
        this.props.offenderSearchHousingLocationDispatch(response.data[0].locationPrefix);
      }
    } catch (error) {
      this.props.displayError(error);
    }
  }

  validate () {
    /* TBC - validation story coming later.
    if (!/^[A-Za-z ]*$/.test(this.props.searchText)) {
      this.props.setValidationErrorDispatch("searchText", "Please enter letters or spaces");
      return false;
    }
    if (!this.props.searchText || this.props.searchText.length < 3) {
      this.props.setValidationErrorDispatch("searchText", "Please provide 3 or more characters");
      return false;
    }*/
    this.props.resetValidationErrorsDispatch();
    return true;
  }

  handleSubmit (history) {
    if (!this.validate()) {
      return;
    }
    if (this.props.initialSearch) {
      history.push('/offender/results');
    } else {
      this.props.doSearch();
    }
  }

  render () {
    return <OffenderSearch {...this.props} handleSubmit={this.handleSubmit}/>;
  }
}

OffenderSearchContainer.propTypes = {
  error: PropTypes.string,
  displayError: PropTypes.func,
  locations: PropTypes.array,
  offenderSearchLocationsDispatch: PropTypes.func,
  offenderSearchHousingLocationDispatch: PropTypes.func,
  searchText: PropTypes.string,
  setValidationErrorDispatch: PropTypes.func,
  resetValidationErrorsDispatch: PropTypes.func,
  offenderSearchTextDispatch: PropTypes.func,
  offenderSearchAllocationStatusDispatch: PropTypes.func,
  initialSearch: PropTypes.bool,
  doSearch: PropTypes.func
};

const mapStateToProps = state => {
  return {
    locations: state.offenderSearch.locations,
    searchText: state.offenderSearch.searchText,
    allocationStatus: state.offenderSearch.allocationStatus,
    validationErrors: state.app.validationErrors
  };
};

const mapDispatchToProps = dispatch => {
  return {
    offenderSearchLocationsDispatch: locationList => dispatch(setOffenderSearchLocations(locationList)),
    keyworkerChangeListDispatch: list => dispatch(setKeyworkerChangeList(list)),
    setValidationErrorDispatch: (fieldName, message) => dispatch(setValidationError(fieldName, message)),
    resetValidationErrorsDispatch: message => dispatch(resetValidationErrors())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OffenderSearchContainer);
