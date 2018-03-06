import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Error from "../../Error/index";

import axiosWrapper from "../../backendWrapper";

class OffenderResults extends Component {
  componentWillMount () {
    this.gotoNext();
  }

  async getOffenders () {
    const response = await axiosWrapper.get('/tbc', {
      headers: {
        jwt: this.props.jwt
      },
      params: {
      //  staffId: staffId
      }
    });
    return response.data;
  }

  async gotoNext () {
    try {
      const data = await this.getOffenders();
      this.props.setCurrentPageDispatch(data);
    } catch (error) {
      this.props.displayError(error);
    }
  }

  render () {
    if (this.props.error) {
      return <Error {...this.props} />;
    }

    // todo create offender components
    return (<div>
      <div className="pure-g">
        <div className="pure-u-md-8-12 padding-top">
          <h1 className="heading-large">Offender Results Placeholder Page</h1>
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

