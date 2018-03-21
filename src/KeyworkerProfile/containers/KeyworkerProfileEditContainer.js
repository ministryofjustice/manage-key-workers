import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { setKeyworker, setKeyworkerCapacity, setKeyworkerStatus } from '../../redux/actions/index';
import { connect } from 'react-redux';
import KeyworkerProfileEdit from '../components/KeyworkerProfileEdit';
import Error from '../../Error';
import { withRouter } from 'react-router';
import { setMessage } from "../../redux/actions";
import axiosWrapper from "../../backendWrapper";

class KeyworkerProfileEditContainer extends Component {
  constructor () {
    super();
    this.handleSaveChanges = this.handleSaveChanges.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleStatusChange = this.handleStatusChange.bind(this);
    this.handleCapacityChange = this.handleCapacityChange.bind(this);
  }

  componentDidMount () {
    //someone has deeplinked  - send back to profile page
    if (!this.props.keyworker.staffId) {
      this.props.history.push(`/keyworker/${this.props.match.params.staffId}/profile`);
    }
  }

  async handleSaveChanges (history) {
    if ((this.props.status === '')) {
      history.push(`/keyworker/${this.props.keyworker.staffId}/profile`);
    } else if (this.props.status === 'ACTIVE') {
      await this.postKeyworkerUpdate();
      this.props.setMessageDispatch("Status updated");
      history.push(`/keyworker/${this.props.keyworker.staffId}/profile`);
    } else {
      history.push(`/keyworker/${this.props.keyworker.staffId}/profile/edit/confirm`);
    }
  }

  async postKeyworkerUpdate () {
    try {
      await axiosWrapper.post('/api/keyworkerUpdate',
        {
          keyworker:
            {
              status: this.props.status,
              capacity: this.props.capacity
            }
        },
        {
          params:
            {
              agencyId: this.props.agencyId,
              staffId: this.props.keyworker.staffId
            }
        });
    } catch (error) {
      this.props.displayError(error);
    }
  }

  handleCancel (history) {
    history.push(`/keyworker/${this.props.keyworker.staffId}/profile`);
  }

  handleStatusChange (event) {
    this.props.keyworkerStatusDispatch(event.target.value);
  }

  handleCapacityChange (event) {
    this.props.keyworkerCapacityDispatch(event.target.value);
  }

  render () {
    if (this.props.error) {
      return <Error {...this.props} />;
    }

    return (<KeyworkerProfileEdit handleSaveChanges={this.handleSaveChanges} handleCancel={this.handleCancel}
      handleStatusChange={this.handleStatusChange}
      handleCapacityChange={this.handleCapacityChange} {...this.props} />);
  }
}

KeyworkerProfileEditContainer.propTypes = {
  error: PropTypes.string,
  agencyId: PropTypes.string.isRequired,
  keyworkerDispatch: PropTypes.func,
  keyworker: PropTypes.object,
  setMessageDispatch: PropTypes.func,
  displayError: PropTypes.func.isRequired,
  keyworkerStatusDispatch: PropTypes.func,
  keyworkerCapacityDispatch: PropTypes.func,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  status: PropTypes.string,
  capacity: PropTypes.string
};

const mapStateToProps = state => {
  return {
    agencyId: state.app.user.activeCaseLoadId,
    keyworker: state.keyworkerSearch.keyworker,
    capacity: state.keyworkerSearch.capacity,
    status: state.keyworkerSearch.status
  };
};

const mapDispatchToProps = dispatch => {
  return {
    keyworkerDispatch: object => dispatch(setKeyworker(object)),
    keyworkerStatusDispatch: status => dispatch(setKeyworkerStatus(status)),
    keyworkerCapacityDispatch: capacity => dispatch(setKeyworkerCapacity(capacity)),
    setMessageDispatch: (message) => dispatch(setMessage(message))
  };
};

export { KeyworkerProfileEditContainer };
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(KeyworkerProfileEditContainer));

