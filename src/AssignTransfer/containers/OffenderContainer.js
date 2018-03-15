import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Error from "../../Error/index";

import axiosWrapper from "../../backendWrapper";

class OffenderContainer extends Component {
  componentWillMount () {
    this.loadOffender();
  }

  async loadOffender () {
    try {
      await this.getOffenderDetails(this.props.match.params.offenderId);
      // todo call dispatch
    } catch (error) {
      this.displayError(error);
    }
  }

  async getOffenderDetails (offenderId) {
    const response = await axiosWrapper.get('/api/keyworker', {
      params: {
        offenderId: offenderId
      }
    });
    return response.data;
  }

  render () {
    // todo create offender components
    return (<div>
      <Error {...this.props} />
      <div className="pure-g">
        <div className="pure-u-md-8-12 padding-top">
          <h1 className="heading-large">Offender Placeholder Page for offenderId={this.props.match.params.offenderId}</h1>
        </div>
      </div>
    </div>);
  }
}

OffenderContainer.propTypes = {
  error: PropTypes.string,
  match: PropTypes.object.isRequired,
  displayError: PropTypes.func.isRequired
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
