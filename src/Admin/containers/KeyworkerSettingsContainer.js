import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import axios from 'axios'
import KeyworkerSettings from '../components/KeyworkerSettings'
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
import { userType } from '../../types'
import Page from '../../Components/Page'

const INTEGER_PATTERN = /^[0-9\b]+$/

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
      setMessageDispatch('Key worker settings updated')
    } catch (error) {
      handleError(error)
    }
    setLoadedDispatch(true)
  }

  handleCapacityChange(event) {
    const { setSettingsCapacityDispatch } = this.props
    if (event.target.value === '' || INTEGER_PATTERN.test(event.target.value)) {
      setSettingsCapacityDispatch(event.target.value)
    }
  }

  handleExtCapacityChange(event) {
    const { setSettingsExtCapacityDispatch } = this.props
    if (event.target.value === '' || INTEGER_PATTERN.test(event.target.value)) {
      setSettingsExtCapacityDispatch(event.target.value)
    }
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
    if (Number.parseInt(capacity, 10) > Number.parseInt(extCapacity, 10)) {
      setValidationErrorDispatch('extCapacity', 'Capacity Tier 2 must be equal to or greater than Capacity Tier 1')
      return false
    }
    return true
  }

  render() {
    return (
      <Page title="Manage key worker settings">
        <KeyworkerSettings
          handleUpdate={this.handleUpdate}
          handleAllowAutoChange={this.handleAllowAutoChange}
          handleCapacityChange={this.handleCapacityChange}
          handleExtCapacityChange={this.handleExtCapacityChange}
          handleSequenceFrequency={this.handleSequenceFrequency}
          {...this.props}
        />
      </Page>
    )
  }
}

KeyworkerSettingsContainer.propTypes = {
  error: PropTypes.string.isRequired,
  agencyId: PropTypes.string.isRequired,
  setMessageDispatch: PropTypes.func.isRequired,
  setLoadedDispatch: PropTypes.func.isRequired,
  setSettingsCapacityDispatch: PropTypes.func.isRequired,
  setSettingsDispatch: PropTypes.func.isRequired,
  setSettingsExtCapacityDispatch: PropTypes.func.isRequired,
  setSettingsMigratedDispatch: PropTypes.func.isRequired,
  setSettingsSupportedDispatch: PropTypes.func.isRequired,
  setSettingsAllowAutoDispatch: PropTypes.func.isRequired,
  setSettingsSequenceFrequencyDispatch: PropTypes.func.isRequired,
  resetValidationErrorsDispatch: PropTypes.func.isRequired,
  setValidationErrorDispatch: PropTypes.func.isRequired,
  handleError: PropTypes.func.isRequired,
  allowAuto: PropTypes.bool.isRequired,
  migrated: PropTypes.bool.isRequired,
  supported: PropTypes.bool.isRequired,
  sequenceFrequency: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  capacity: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  extCapacity: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  loaded: PropTypes.bool.isRequired,
  user: userType.isRequired,
  validationErrors: PropTypes.shape({}).isRequired,
  message: PropTypes.string.isRequired,
}

const mapStateToProps = state => ({
  error: state.app.error,
  user: state.app.user,
  agencyId: state.app.user.activeCaseLoadId,
  loaded: state.app.loaded,
  allowAuto: state.keyworkerSettings.allowAuto,
  capacity: state.keyworkerSettings.capacity,
  extCapacity: state.keyworkerSettings.extCapacity,
  sequenceFrequency: state.keyworkerSettings.sequenceFrequency,
  supported: state.keyworkerSettings.supported,
  migrated: state.keyworkerSettings.migrated,
  validationErrors: state.app.validationErrors,
  message: state.app.message,
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
