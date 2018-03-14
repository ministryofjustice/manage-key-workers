import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import OffenderSearch from "../components/OffenderSearch";
import axiosWrapper from "../../backendWrapper";
import { setOffenderSearchLocations } from "../../redux/actions";

class OffenderSearchContainer extends Component {
  componentWillMount () {
    this.getLocations();
  }

  async getLocations () {
    try {
      const response = await axiosWrapper.get('api/userLocations', {
        headers: {
          jwt: this.props.jwt
        }
      });
      this.props.offenderSearchLocationsDispatch(response.data);
    } catch (error) {
      this.props.displayError(error);
    }
  }

  render () {
    return <OffenderSearch {...this.props} />;
  }
}

OffenderSearchContainer.propTypes = {
  error: PropTypes.string,
  displayError: PropTypes.func,
  locations: PropTypes.array,
  offenderSearchLocationsDispatch: PropTypes.func,
  jwt: PropTypes.string.isRequired
};

const mapStateToProps = state => {
  return {
    locations: state.offenderSearch.locations
  };
};

const mapDispatchToProps = dispatch => {
  return {
    offenderSearchLocationsDispatch: locationList => dispatch(setOffenderSearchLocations(locationList))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OffenderSearchContainer);
