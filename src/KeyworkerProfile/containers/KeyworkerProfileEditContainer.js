import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { setKeyworker, setKeyworkerCapacity, setKeyworkerStatus } from '../../redux/actions/index';
import { connect } from 'react-redux';
import KeyworkerProfileEdit from '../components/KeyworkerProfileEdit';
import Error from '../../Error';
import { withRouter } from 'react-router';
import { setMessage } from "../../redux/actions";

class KeyworkerProfileEditContainer extends Component {
  constructor () {
    super();
    this.handleSaveChanges = this.handleSaveChanges.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleStatusChange = this.handleStatusChange.bind(this);
    this.handleCapacityChange = this.handleCapacityChange.bind(this);
  }

  // to redirect to prfile if keyworker not in context?

  handleSaveChanges (history) {
    console.log("todo: save keyworker changes");
    // save to redux until confirmation on next page?...
    this.props.setMessageDispatch("Status updated");
    history.push(`/keyworker/${this.props.keyworker.staffId}/profile`);
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

    return <KeyworkerProfileEdit handleSaveChanges={this.handleSaveChanges} handleCancel={this.handleCancel} handleStatusChange={this.handleStatusChange} handleCapacityChange={this.handleCapacityChange} {...this.props} />;
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
  keyworkerCapacityDispatch: PropTypes.func
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

