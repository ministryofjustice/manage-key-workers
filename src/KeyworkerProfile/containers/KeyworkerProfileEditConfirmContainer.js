import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { setKeyworker, setKeyworkerStatusChangeBehaviour } from '../../redux/actions/index';
import { connect } from 'react-redux';
import KeyworkerProfileEditConfirm from '../components/KeyworkerProfileEditConfirm';
import Error from '../../Error';
import { withRouter } from 'react-router';
import { resetValidationErrors, setMessage, setValidationError, setAnnualLeaveReturnDate } from "../../redux/actions";
import axios from "axios";
import * as behaviours from '../keyworkerStatusBehavour';
import moment from 'moment';
import { switchToIsoDateFormat, isBlank } from '../../stringUtils';

class KeyworkerProfileEditConfirmContainer extends Component {
  constructor () {
    super();
    this.handleSaveChanges = this.handleSaveChanges.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
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
    this.props.dateDispatch('');
  }

  async handleSaveChanges (history) {
    if (!this.validate()) {
      return;
    }
    try {
      await this.postKeyworkerUpdate();
      if (this.props.behaviour === behaviours.REMOVE_ALLOCATIONS_NO_AUTO) {
        if (this.props.keyworker.numberAllocated > 0) {
          this.props.setMessageDispatch("Prisoners removed from key worker");
        } else {
          this.props.setMessageDispatch("Profile changed");
        }
      } else {
        this.props.setMessageDispatch("Profile changed");
      }
      // On success, return to KW profile by 'popping' history
      history.goBack();
    } catch (error) {
      this.props.handleError(error);
    }
  }

  validate () {
    this.props.resetValidationErrorsDispatch();
    let result = true;
    if (!this.props.behaviour) {
      this.props.setValidationErrorDispatch("behaviourRadios", "Please choose an option");
      result = false;
    }
    if (this.props.status === 'UNAVAILABLE_ANNUAL_LEAVE' && isBlank(this.props.annualLeaveReturnDate)) {
      this.props.setValidationErrorDispatch("active-date", "Please choose a return date");
      result = false;
    }
    return result;
  }

  async postKeyworkerUpdate () {
    await axios.post('/api/keyworkerUpdate',
      {
        keyworker:
            {
              status: this.props.status,
              capacity: this.props.capacity,
              behaviour: this.props.behaviour,
              activeDate: switchToIsoDateFormat(this.props.annualLeaveReturnDate)
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
    // Use replace to ensure the profile page remains the history 'parent'
    history.replace(`/keyworker/${this.props.keyworker.staffId}/profile/edit`);
  }

  handleOptionChange (event) {
    this.props.setStatusChangeBehaviourDispatch(event.target.value);
  }

  handleDateChange (date) {
    if (date) {
      this.props.dateDispatch(moment(date).format('DD/MM/YYYY'));
    }
  }

  render () {
    if (this.props.error) {
      return <Error {...this.props} />;
    }

    return <KeyworkerProfileEditConfirm handleSaveChanges={this.handleSaveChanges} handleDateChange={this.handleDateChange} handleCancel={this.handleCancel} handleOptionChange={this.handleOptionChange} {...this.props} />;
  }
}

KeyworkerProfileEditConfirmContainer.propTypes = {
  error: PropTypes.string,
  status: PropTypes.string,
  capacity: PropTypes.string,
  behaviour: PropTypes.string,
  annualLeaveReturnDate: PropTypes.string,
  agencyId: PropTypes.string.isRequired,
  keyworkerDispatch: PropTypes.func,
  keyworker: PropTypes.object,
  setMessageDispatch: PropTypes.func,
  dateDispatch: PropTypes.func,
  handleError: PropTypes.func.isRequired,
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
    validationErrors: state.app.validationErrors,
    annualLeaveReturnDate: state.keyworkerSearch.annualLeaveReturnDate
  };
};

const mapDispatchToProps = dispatch => {
  return {
    keyworkerDispatch: object => dispatch(setKeyworker(object)),
    setMessageDispatch: (message) => dispatch(setMessage(message)),
    setStatusChangeBehaviourDispatch: (message) => dispatch(setKeyworkerStatusChangeBehaviour(message)),
    setValidationErrorDispatch: (fieldName, message) => dispatch(setValidationError(fieldName, message)),
    resetValidationErrorsDispatch: message => dispatch(resetValidationErrors()),
    dateDispatch: text => dispatch(setAnnualLeaveReturnDate(text))
  };
};

export { KeyworkerProfileEditConfirmContainer };
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(KeyworkerProfileEditConfirmContainer));

