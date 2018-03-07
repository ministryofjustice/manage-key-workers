import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Error from "../../Error/index";

import axiosWrapper from "../../backendWrapper";

class OffenderResultsContainer extends Component {
  componentWillMount () {
    this.doSearch();
  }

  async getOffenders () {
    const response = await axiosWrapper.get('/searchOffenders', {
      headers: {
        jwt: this.props.jwt
      },
      params: {
        locationPrefix: this.props.housingLocation,
        keywords: this.props.searchText,
        allocationStatus: this.props.allocationStatus
      }
    });
    return response.data;
  }

  async doSearch () {
    try {
      const data = await this.getOffenders();
      // TODO this.props.set???Dispatch(data);
      return data;
    } catch (error) {
      this.props.displayError(error);
    }
  }

  render () {
    if (this.props.error) {
      return <Error {...this.props} />;
    }

    // TODO create offender table
    return (<div>
      <div className="pure-g">
        <div className="pure-u-md-8-12 padding-top">
          <h1 className="heading-large">Offender Results Container Placeholder Page</h1>
        </div>
      </div>
    </div>);
  }
}

OffenderResultsContainer.propTypes = {
  error: PropTypes.string,
  searchText: PropTypes.string,
  allocationStatus: PropTypes.string,
  housingLocation: PropTypes.string,
  match: PropTypes.object.isRequired,
  displayError: PropTypes.func.isRequired,
  jwt: PropTypes.string.isRequired
};

const mapStateToProps = state => {
  return {
    searchText: state.offenderSearch.searchText,
    allocationStatus: state.offenderSearch.allocationStatus,
    housingLocation: state.offenderSearch.housingLocation
  };
};

const mapDispatchToProps = dispatch => {
  return {
  };
};

export { OffenderResultsContainer };
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(OffenderResultsContainer));
