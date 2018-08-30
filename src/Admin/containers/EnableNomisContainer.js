import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import EnableNomis from '../components/EnableNomis';
import Error from '../../Error';
import { withRouter } from 'react-router';
import axios from "axios";
import { setMessage } from "../../redux/actions";

class EnableNomisContainer extends Component {
  constructor () {
    super();
    this.handleEnable = this.handleEnable.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  async handleEnable (history) {
    console.debug("agency id = " + this.props.agencyId);
    try {
      await axios.post('/api/enableNewNomis',
        {},
        {
          params:
            {
              agencyId: this.props.agencyId
            }
        });
      this.props.setMessageDispatch("New NOMIS access updated");
      history.push(`/`);
    } catch (error) {
      this.props.handleError(error);
    }
  }

  handleCancel (history) {
    history.push(`/`);
  }

  render () {
    if (this.props.error) {
      return <Error {...this.props} />;
    }

    return <EnableNomis handleEnable={this.handleEnable} handleCancel={this.handleCancel} {...this.props} />;
  }
}

EnableNomisContainer.propTypes = {
  error: PropTypes.string,
  agencyId: PropTypes.string.isRequired,
  setMessageDispatch: PropTypes.func,
  handleError: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    agencyId: state.app.user.activeCaseLoadId
  };
};

const mapDispatchToProps = dispatch => {
  return { setMessageDispatch: (message) => dispatch(setMessage(message)) };
};

export { EnableNomisContainer };
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(EnableNomisContainer));

