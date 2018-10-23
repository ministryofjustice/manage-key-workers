import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import axios from 'axios'
import KeyworkerSettings from '../components/KeyworkerSettings'
import Error from '../../Error'
import {
  setLoaded,
  setMessage,
  setSettingsSupported,
  setSettingsMigrated,
  setSettingsCapacity,
  setSettingsSequenceFrequency,
  setSettingsAllowAutoAllocation,
  setSettingsExtCapacity,
  setSettings,
  setValidationError,
  resetValidationErrors,
} from '../../redux/actions'
import Spinner from '../../Spinner'
import { stringIsInteger } from '../../stringUtils'

class KeyworkerSettingsContainer extends Component {
  constructor() {
    super()
    this.handleUpdate = this.handleUpdate.bind(this)
    this.handleCapacityChange = this.handleCapacityChange.bind(this)
    this.handleExtCapacityChange = this.handleExtCapacityChange.bind(this)
    this.handleSequenceFrequency = this.handleSequenceFrequency.bind(this)
    this.handleMigratedChange = this.handleMigratedChange.bind(this)
    this.handleAllowAutoChange = this.handleAllowAutoChange.bind(this)
  }

  async componentWillMount() {
    const { setLoadedDispatch, resetValidationErrorsDispatch } = this.props

    setLoadedDispatch(true)
    resetValidationErrorsDispatch()
  }

  async handleUpdate() {
    const {
      setLoadedDispatch,
      allowAuto,
      supported,
      capacity,
      extCapacity,
      sequenceFrequency,
      agencyId,
      setSettingsMigratedDispatch,
      setSettingsSupportedDispatch,
      setMessageDispatch,
      handleError,
    } = this.props

    if (!this.validate()) return

    setLoadedDispatch(false)
    const controller = allowAuto ? '/api/autoAllocateMigrate' : '/api/manualAllocateMigrate'

    try {
      const response = await axios.post(
        controller,
        {
          migrate: !supported,
          capacity: `${capacity},${extCapacity}`,
          frequency: sequenceFrequency,
        },
        {
          params: {
            agencyId,
          },
        }
      )
      setSettingsMigratedDispatch(response.data.migrated)
      setSettingsSupportedDispatch(response.data.supported)
      setMessageDispatch('key worker settings updated')
    } catch (error) {
      handleError(error)
    }
    setLoadedDispatch(true)
  }

  handleCapacityChange(event) {
    const { setSettingsCapacityDispatch } = this.props

    setSettingsCapacityDispatch(event.target.value)
  }

  handleExtCapacityChange(event) {
    const { setSettingsExtCapacityDispatch } = this.props

    setSettingsExtCapacityDispatch(event.target.value)
  }

  handleMigratedChange(event) {
    const { setSettingsMigratedDispatch } = this.props

    setSettingsMigratedDispatch(event.target.value)
  }

  handleAllowAutoChange(event) {
    const { setSettingsAllowAutoDispatch } = this.props
    const allowAllocBoolean = event.target.value === 'true'

    setSettingsAllowAutoDispatch(allowAllocBoolean)
  }

  handleSequenceFrequency(event) {
    const { setSettingsSequenceFrequencyDispatch } = this.props

    setSettingsSequenceFrequencyDispatch(event.target.value)
  }

  validate() {
    const { resetValidationErrorsDispatch, capacity, extCapacity, setValidationErrorDispatch } = this.props

    resetValidationErrorsDispatch()
    if (!stringIsInteger(capacity)) {
      setValidationErrorDispatch('capacity', 'Please enter a number')
      return false
    }
    if (!stringIsInteger(extCapacity)) {
      setValidationErrorDispatch('extCapacity', 'Please enter a number')
      return false
    }
    if (capacity > extCapacity) {
      setValidationErrorDispatch('extCapacity', 'Capacity Tier 2 must be equal to or greater than Capacity Tier 1')
      return false
    }
    return true
  }

  render() {
    const { error, loaded } = this.props

    if (error) return <Error {...this.props} />

    if (loaded)
      return (
        <KeyworkerSettings
          handleUpdate={this.handleUpdate}
          handleAllowAutoChange={this.handleAllowAutoChange}
          handleCapacityChange={this.handleCapacityChange}
          handleExtCapacityChange={this.handleExtCapacityChange}
          handleSequenceFrequency={this.handleSequenceFrequency}
          {...this.props}
        />
      )

    return <Spinner />
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
  user: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  agencyId: state.app.user.activeCaseLoadId,
  loaded: state.app.loaded,
  allowAuto: state.keyworkerSettings.allowAuto,
  capacity: state.keyworkerSettings.capacity,
  extCapacity: state.keyworkerSettings.extCapacity,
  sequenceFrequency: state.keyworkerSettings.sequenceFrequency,
  supported: state.keyworkerSettings.supported,
  migrated: state.keyworkerSettings.migrated,
  validationErrors: state.app.validationErrors,
})

const mapDispatchToProps = dispatch => ({
  setMessageDispatch: message => dispatch(setMessage(message)),
  setLoadedDispatch: status => dispatch(setLoaded(status)),
  setSettingsCapacityDispatch: input => dispatch(setSettingsCapacity(input)),
  setSettingsExtCapacityDispatch: input => dispatch(setSettingsExtCapacity(input)),
  setSettingsMigratedDispatch: input => dispatch(setSettingsMigrated(input)),
  setSettingsSupportedDispatch: input => dispatch(setSettingsSupported(input)),
  setSettingsDispatch: input => dispatch(setSettings(input)),
  setSettingsAllowAutoDispatch: input => dispatch(setSettingsAllowAutoAllocation(input)),
  setSettingsSequenceFrequencyDispatch: input => dispatch(setSettingsSequenceFrequency(input)),
  setValidationErrorDispatch: (fieldName, message) => dispatch(setValidationError(fieldName, message)),
  resetValidationErrorsDispatch: () => dispatch(resetValidationErrors()),
})

export { KeyworkerSettingsContainer }
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(KeyworkerSettingsContainer))
