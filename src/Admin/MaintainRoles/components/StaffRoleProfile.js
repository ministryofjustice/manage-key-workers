import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
// import '../index.scss';

class StaffRoleProfile extends Component {
  render () {
    return (
      <div className="padding-bottom-large">
        {this.props.displayBack()}
        <div className="pure-g">
          <div className="pure-u-md-11-12 ">
            <h1 className="heading-large margin-top" id="page-title">Staff role profile</h1>
            <div>TO DO</div>
          </div>
        </div>
      </div>
    );
  }
}

StaffRoleProfile.propTypes = {
  error: PropTypes.string,
  agencyId: PropTypes.string.isRequired,
  resetErrorDispatch: PropTypes.func,
  displayBack: PropTypes.func.isRequired,
  history: PropTypes.object
};

const StaffRoleProfileWithRouter = withRouter(StaffRoleProfile);

export { StaffRoleProfile };
export default StaffRoleProfileWithRouter;
