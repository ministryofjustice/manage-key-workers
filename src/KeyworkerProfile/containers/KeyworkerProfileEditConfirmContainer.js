import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { setKeyworker, setKeyworkerStatusChangeBehaviour } from '../../redux/actions/index';
import { connect } from 'react-redux';
import KeyworkerProfileEditConfirm from '../components/KeyworkerProfileEditConfirm';
import Error from '../../Error';
import { withRouter } from 'react-router';
import { resetValidationErrors, setMessage, setValidationError } from "../../redux/actions";
import axiosWrapper from "../../backendWrapper";
import * as behaviours from '../keyworkerStatusBehavour';

class KeyworkerProfileEditContainer extends Component {
  constructor () {
    super();
    this.handleSaveChanges = this.handleSaveChanges.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
  }

  componentDidMount () {
    if (!this.props.status || this.props.status === '') {
      this.props.history.push(`/keyworker/${this.props.match.params.staffId}/profile`);
    }
    if (this.props.status === 'INACTIVE') {
      this.props.setStatusChangeBehaviourDispatch('REMOVE_ALLOCATIONS_NO_AUTO');
    } else {
      this.props.setStatusChangeBehaviourDispatch('');
    }
  }

  async handleSaveChanges (history) {
    if (!this.validate()) {
      return;
    }
    try {
      await this.postKeyworkerUpdate();
      if (this.props.behaviour === behaviours.REMOVE_ALLOCATIONS_NO_AUTO) {
        this.props.setMessageDispatch("Prisoners removed from key worker");
      } else {
        this.props.setMessageDispatch("Status updated");
      }
      history.push(`/keyworker/${this.props.keyworker.staffId}/profile`);
    } catch (error) {
      this.props.displayError(error);
    }
  }

  validate () {
    if (!this.props.behaviour) {
      this.props.setValidationErrorDispatch("behaviourRadios", "Please choose an option");
      return false;
    }
    this.props.resetValidationErrorsDispatch();
    return true;
  }

  async postKeyworkerUpdate () {
    await axiosWrapper.post('/api/keyworkerUpdate',
      {
        keyworker:
            {
              status: this.props.status,
              capacity: this.props.capacity,
              behaviour: this.props.behaviour
            }
      },
      {
        params:
            {
              agencyId: this.props.agencyId,
              staffId: this.props.keyworker.staffId
            }
      });
  }

  handleCancel (history) {
    history.push(`/keyworker/${this.props.keyworker.staffId}/profile/edit`);
  }

  handleOptionChange (event) {
    this.props.setStatusChangeBehaviourDispatch(event.target.value);
  }

  render () {
    if (this.props.error) {
      return <Error {...this.props} />;
    }

    return <KeyworkerProfileEditConfirm handleSaveChanges={this.handleSaveChanges} handleCancel={this.handleCancel} handleOptionChange={this.handleOptionChange} {...this.props} />;
  }
}

KeyworkerProfileEditContainer.propTypes = {
  error: PropTypes.string,
  status: PropTypes.string,
  capacity: PropTypes.string,
  behaviour: PropTypes.string,
  agencyId: PropTypes.string.isRequired,
  keyworkerDispatch: PropTypes.func,
  keyworker: PropTypes.object,
  setMessageDispatch: PropTypes.func,
  displayError: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  setStatusChangeBehaviourDispatch: PropTypes.func,
  history: PropTypes.object.isRequired,
  setValidationErrorDispatch: PropTypes.func,
  resetValidationErrorsDispatch: PropTypes.func,
  validationErrors: PropTypes.object
};

const mapStateToProps = state => {
  return {
    agencyId: state.app.user.activeCaseLoadId,
    keyworker: state.keyworkerSearch.keyworker,
    status: state.keyworkerSearch.status,
    capacity: state.keyworkerSearch.capacity,
    behaviour: state.keyworkerSearch.statusChangeBehaviour,
    validationErrors: state.app.validationErrors
  };
};

const mapDispatchToProps = dispatch => {
  return {
    keyworkerDispatch: object => dispatch(setKeyworker(object)),
    setMessageDispatch: (message) => dispatch(setMessage(message)),
    setStatusChangeBehaviourDispatch: (message) => dispatch(setKeyworkerStatusChangeBehaviour(message)),
    setValidationErrorDispatch: (fieldName, message) => dispatch(setValidationError(fieldName, message)),
    resetValidationErrorsDispatch: message => dispatch(resetValidationErrors())
  };
};

export { KeyworkerProfileEditContainer };
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(KeyworkerProfileEditContainer));

