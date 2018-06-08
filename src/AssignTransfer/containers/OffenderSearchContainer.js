import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import OffenderSearch from "../components/OffenderSearch";
import axios from 'axios';
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
    this.props.offenderSearchTextDispatch('');
    this.props.offenderSearchAllocationStatusDispatch('all');
  }

  async getLocations () {
    try {
      const response = await axios.get('/api/userLocations');
      this.props.offenderSearchLocationsDispatch(response.data);
      // Use the first location by default
      if (this.props.initialSearch && response.data && response.data[0]) {
        this.props.offenderSearchHousingLocationDispatch(response.data[0].locationPrefix);
      }
    } catch (error) {
      this.props.handleError(error);
    }
  }


  handleSubmit (history) {
    history.push('/offender/results');
  }

  render () {
    return <OffenderSearch {...this.props} handleSubmit={this.handleSubmit}/>;
  }
}

OffenderSearchContainer.propTypes = {
  error: PropTypes.string,
  handleError: PropTypes.func,
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
