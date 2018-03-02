import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Error from "../Error";

import axiosWrapper from "../backendWrapper";

class OffenderContainer extends Component {
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

  render () {
    if (this.props.error) {
      return <Error {...this.props} />;
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
  match: PropTypes.object.isRequired,
  displayError: PropTypes.func.isRequired,
  jwt: PropTypes.string.isRequired
};

const mapStateToProps = state => {
  return {
  };
};

const mapDispatchToProps = dispatch => {
  return {
  };
};


export { OffenderContainer };
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(OffenderContainer));

