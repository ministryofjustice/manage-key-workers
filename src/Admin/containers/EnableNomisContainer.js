import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import EnableNomis from '../components/EnableNomis';
import Error from '../../Error';
import { withRouter } from 'react-router';
import axios from "axios";
import { setLoaded, setMessage } from "../../redux/actions";
import Spinner from '../../Spinner';

class EnableNomisContainer extends Component {
  constructor () {
    super();
    this.handleEnable = this.handleEnable.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentWillMount () {
    this.props.setLoadedDispatch(true);
  }

  async handleEnable (history) {
    this.props.setLoadedDispatch(false);
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
    this.props.setLoadedDispatch(true);
  }

  handleCancel (history) {
    history.push(`/`);
  }

  render () {
    if (this.props.error) {
      return <Error {...this.props} />;
    }
    if (this.props.loaded) {
      return <EnableNomis handleEnable={this.handleEnable} handleCancel={this.handleCancel} {...this.props} />;
    }
    return <Spinner />;
  }
}

EnableNomisContainer.propTypes = {
  error: PropTypes.string,
  agencyId: PropTypes.string.isRequired,
  setMessageDispatch: PropTypes.func,
  setLoadedDispatch: PropTypes.func,
  handleError: PropTypes.func.isRequired,
  loaded: PropTypes.bool
};

const mapStateToProps = state => {
  return {
    agencyId: state.app.user.activeCaseLoadId,
    loaded: state.app.loaded
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setMessageDispatch: (message) => dispatch(setMessage(message)),
    setLoadedDispatch: (status) => dispatch(setLoaded(status))
  };
};

export { EnableNomisContainer };
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(EnableNomisContainer));

