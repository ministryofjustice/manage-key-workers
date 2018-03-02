import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { setError } from '../redux/actions/index';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import axiosWrapper from "../backendWrapper";

class OffenderContainer extends Component {
  constructor () {
    super();
    this.displayError = this.displayError.bind(this);
  }

  componentWillMount () {
    this.getOffenderDetails();
  }

  async loadOffender () {
    try {
      // todo await this.getOffenderDetails(this.props.match.params.offenderId);
      // todo call dispatch
    } catch (error) {
      this.displayError(error);
    }
  }

  async getOffenderDetails (offenderId) {
    const response = await axiosWrapper.get('/keyworker', {
      headers: {
        jwt: this.props.jwt
      },
      params: {
        offenderId: offenderId
      }
    });
    return response.data;
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

    // todo create offender components
    return (<div>
      <div className="pure-g">
        <div className="pure-u-md-8-12 padding-top">
          <h1 className="heading-large">Offender Placeholder Page for offenderId {this.props.match.params.offenderId}</h1>
        </div>
      </div>
    </div>);
  }
}

OffenderContainer.propTypes = {
  error: PropTypes.string,
  jwt: PropTypes.string.isRequired,
  setErrorDispatch: PropTypes.func,
  match: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    error: state.app.error,
    jwt: state.app.jwt
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setErrorDispatch: error => dispatch(setError(error))
  };
};

export { OffenderContainer };
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(OffenderContainer));

