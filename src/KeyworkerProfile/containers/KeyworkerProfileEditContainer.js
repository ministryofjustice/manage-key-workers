import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { setKeyworker, setKeyworkerCapacity, setKeyworkerStatus } from '../../redux/actions/index';
import { connect } from 'react-redux';
import KeyworkerProfileEdit from '../components/KeyworkerProfileEdit';
import Error from '../../Error';
import { withRouter } from 'react-router';
import { resetValidationErrors, setMessage, setValidationError } from "../../redux/actions";
import axios from "axios";

class KeyworkerProfileEditContainer extends Component {
  constructor () {
    super();
    this.handleSaveChanges = this.handleSaveChanges.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleStatusChange = this.handleStatusChange.bind(this);
    this.handleCapacityChange = this.handleCapacityChange.bind(this);
  }

  componentDidMount () {
    //invalid deeplink
    if (!this.props.keyworker.staffId) {
      this.props.history.push(`/keyworker/${this.props.match.params.staffId}/profile`);
    }
  }

  async handleSaveChanges (history) {
    if (!this.validate()) {
      return;
    }
    let statusChange = (this.props.status !== this.props.keyworker.status);

    try {
      if (this.formChange()) {
        if (statusChange && this.props.status !== 'ACTIVE') {
          history.push(`/keyworker/${this.props.keyworker.staffId}/profile/edit/confirm`);
        } else {
          await this.postKeyworkerUpdate();
          this.props.setMessageDispatch("Profile changed");
          history.push(`/keyworker/${this.props.keyworker.staffId}/profile`);
        }
      } else {
        history.push(`/keyworker/${this.props.keyworker.staffId}/profile`);
      }
    } catch (error) {
      this.props.displayError(error);
    }
  }

  formChange () {
    let capacityChange = (this.props.capacity !== this.props.keyworker.capacity.toString());
    let statusChange = (this.props.status !== this.props.keyworker.status);
    return capacityChange || statusChange;
  }

  async postKeyworkerUpdate () {
    await axios.post('/api/keyworkerUpdate',
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

  stringIsInteger (input) {
    var parsed = Number.parseInt(input, 10);
    return !Number.isNaN(parsed);
  }

  validate () {
    if (!this.stringIsInteger(this.props.capacity)) {
      this.props.setValidationErrorDispatch("capacity", "Please enter a number");
      return false;
    }
    this.props.resetValidationErrorsDispatch();
    return true;
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
  capacity: PropTypes.string,
  validationErrors: PropTypes.object,
  setValidationErrorDispatch: PropTypes.func,
  resetValidationErrorsDispatch: PropTypes.func
};

const mapStateToProps = state => {
  return {
    agencyId: state.app.user.activeCaseLoadId,
    keyworker: state.keyworkerSearch.keyworker,
    capacity: state.keyworkerSearch.capacity,
    status: state.keyworkerSearch.status,
    validationErrors: state.app.validationErrors,
    setValidationErrorDispatch: PropTypes.func,
    resetValidationErrorsDispatch: PropTypes.func
  };
};

const mapDispatchToProps = dispatch => {
  return {
    keyworkerDispatch: object => dispatch(setKeyworker(object)),
    keyworkerStatusDispatch: status => dispatch(setKeyworkerStatus(status)),
    keyworkerCapacityDispatch: capacity => dispatch(setKeyworkerCapacity(capacity)),
    setMessageDispatch: (message) => dispatch(setMessage(message)),
    setValidationErrorDispatch: (fieldName, message) => dispatch(setValidationError(fieldName, message)),
    resetValidationErrorsDispatch: message => dispatch(resetValidationErrors())
  };
};

export { KeyworkerProfileEditContainer };
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(KeyworkerProfileEditContainer));

