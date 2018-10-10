import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import KeyworkerSettings from '../components/KeyworkerSettings';
import Error from '../../Error';
import { withRouter } from 'react-router';
import {
  setLoaded, setMessage, setSettingsSupported, setSettingsMigrated, setSettingsCapacity,
  setSettingsSequenceFrequency, setSettingsAllowAutoAllocation, setSettingsExtCapacity,
  setSettings, setValidationError, resetValidationErrors
} from "../../redux/actions";
import Spinner from '../../Spinner';
import axios from "axios";
import { stringIsInteger } from "../../stringUtils";

class KeyworkerSettingsContainer extends Component {
  constructor () {
    super();
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleCapacityChange = this.handleCapacityChange.bind(this);
    this.handleExtCapacityChange = this.handleExtCapacityChange.bind(this);
    this.handleSequenceFrequency = this.handleSequenceFrequency.bind(this);
    this.handleMigratedChange = this.handleMigratedChange.bind(this);
    this.handleAllowAutoChange = this.handleAllowAutoChange.bind(this);
  }

  async componentWillMount () {
    this.props.setLoadedDispatch(true);
    this.props.resetValidationErrorsDispatch();
  }

  async handleUpdate (history) {
    if (!this.validate()) {
      return;
    }
    this.props.setLoadedDispatch(false);
    const controller = this.props.allowAuto ? '/api/autoAllocateMigrate' : '/api/manualAllocateMigrate';

    try {
      const response = await axios.post(controller,
        {
          migrate: !this.props.supported,
          capacity: `${this.props.capacity},${this.props.extCapacity}`,
          frequency: this.props.sequenceFrequency
        },
        {
          params:
            {
              agencyId: this.props.agencyId
            }
        });
      this.props.setSettingsMigratedDispatch(response.data.migrated);
      this.props.setSettingsSupportedDispatch(response.data.supported);
      this.props.setMessageDispatch("key worker settings updated");
    } catch (error) {
      this.props.handleError(error);
    }
    this.props.setLoadedDispatch(true);
  }

  handleCapacityChange (event) {
    this.props.setSettingsCapacityDispatch(event.target.value);
  }

  handleExtCapacityChange (event) {
    this.props.setSettingsExtCapacityDispatch(event.target.value);
  }

  handleMigratedChange (event) {
    this.props.setSettingsMigratedDispatch(event.target.value);
  }

  handleAllowAutoChange (event) {
    const allowAllocBoolean = (event.target.value === 'true');
    this.props.setSettingsAllowAutoDispatch(allowAllocBoolean);
  }

  handleSequenceFrequency (event) {
    this.props.setSettingsSequenceFrequencyDispatch(event.target.value);
  }

  validate () {
    this.props.resetValidationErrorsDispatch();
    if (!stringIsInteger(this.props.capacity)) {
      this.props.setValidationErrorDispatch("capacity", "Please enter a number");
      return false;
    }
    if (!stringIsInteger(this.props.extCapacity)) {
      this.props.setValidationErrorDispatch("extCapacity", "Please enter a number");
      return false;
    }
    if (this.props.capacity > this.props.extCapacity) {
      this.props.setValidationErrorDispatch("extCapacity", "Capacity Tier 2 must be equal to or greater than Capacity Tier 1");
      return false;
    }
    return true;
  }

  render () {
    if (this.props.error) {
      return <Error {...this.props} />;
    }
    if (this.props.loaded) {
      return (<KeyworkerSettings handleUpdate={this.handleUpdate}
        handleAllowAutoChange={this.handleAllowAutoChange}
        handleCapacityChange={this.handleCapacityChange}
        handleExtCapacityChange={this.handleExtCapacityChange}
        handleSequenceFrequency={this.handleSequenceFrequency} {...this.props} />);
    }
    return <Spinner />;
  }
}

KeyworkerSettingsContainer.propTypes = {
  error: PropTypes.string,
  agencyId: PropTypes.string.isRequired,
  setMessageDispatch: PropTypes.func,
  setLoadedDispatch: PropTypes.func,
  setSettingsCapacityDispatch: PropTypes.func,
  setSettingsDispatch: PropTypes.func,
  setSettingsExtCapacityDispatch: PropTypes.func,
  setSettingsMigratedDispatch: PropTypes.func,
  setSettingsSupportedDispatch: PropTypes.func,
  setSettingsAllowAutoDispatch: PropTypes.func,
  setSettingsSequenceFrequencyDispatch: PropTypes.func,
  resetValidationErrorsDispatch: PropTypes.func,
  setValidationErrorDispatch: PropTypes.func,
  handleError: PropTypes.func.isRequired,
  allowAuto: PropTypes.bool,
  migrated: PropTypes.bool,
  supported: PropTypes.bool,
  sequenceFrequency: PropTypes.string,
  capacity: PropTypes.string,
  extCapacity: PropTypes.string,
  loaded: PropTypes.bool,
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    agencyId: state.app.user.activeCaseLoadId,
    loaded: state.app.loaded,
    allowAuto: state.keyworkerSettings.allowAuto,
    capacity: state.keyworkerSettings.capacity,
    extCapacity: state.keyworkerSettings.extCapacity,
    sequenceFrequency: state.keyworkerSettings.sequenceFrequency,
    supported: state.keyworkerSettings.supported,
    migrated: state.keyworkerSettings.migrated,
    validationErrors: state.app.validationErrors
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setMessageDispatch: (message) => dispatch(setMessage(message)),
    setLoadedDispatch: (status) => dispatch(setLoaded(status)),
    setSettingsCapacityDispatch: (input) => dispatch(setSettingsCapacity(input)),
    setSettingsExtCapacityDispatch: (input) => dispatch(setSettingsExtCapacity(input)),
    setSettingsMigratedDispatch: (input) => dispatch(setSettingsMigrated(input)),
    setSettingsSupportedDispatch: (input) => dispatch(setSettingsSupported(input)),
    setSettingsDispatch: (input) => dispatch(setSettings(input)),
    setSettingsAllowAutoDispatch: (input) => dispatch(setSettingsAllowAutoAllocation(input)),
    setSettingsSequenceFrequencyDispatch: (input) => dispatch(setSettingsSequenceFrequency(input)),
    setValidationErrorDispatch: (fieldName, message) => dispatch(setValidationError(fieldName, message)),
    resetValidationErrorsDispatch: message => dispatch(resetValidationErrors())
  };
};

export { KeyworkerSettingsContainer };
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(KeyworkerSettingsContainer));

