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
    const { setLoadedDispatch } = this.props;

    setLoadedDispatch(true);
  }

  async handleEnable (history) {
    const { agencyId, setLoadedDispatch, setMessageDispatch, handleError } = this.props;

    setLoadedDispatch(false);
    try {
      await axios.post('/api/enableNewNomis',
        {},
        {
          params:
            {
              agencyId
            }
        });
      setMessageDispatch("New NOMIS access updated");
      history.push(`/`);
    } catch (error) {
      handleError(error);
    }
    setLoadedDispatch(true);
  }

  handleCancel (history) {
    history.push(`/`);
  }

  render() {
    const { error, loaded } = this.props;

    if (error) return <Error {...this.props} />;

    if (loaded)
      return (
        <EnableNomis
          handleEnable={this.handleEnable}
          handleCancel={this.handleCancel}
          {...this.props}
        />
      );

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

