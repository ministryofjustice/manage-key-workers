import React from 'react'
import PropTypes from 'prop-types'
import { properCaseName } from '../../stringUtils'
import ValidationErrors from '../../ValidationError'
import Status from './Status'

const KeyworkerProfileEdit = ({
  keyworker,
  status,
  handleStatusChange,
  handleCancel,
  history,
  capacity,
  validationErrors,
  handleCapacityChange,
  handleSaveChanges,
}) => {
  const keyworkerDisplayName = `${properCaseName(keyworker.firstName)} ${properCaseName(keyworker.lastName)}`
  const statusSelect = (
    <div>
      <label className="form-label" htmlFor="status-select">
        Status
      </label>
      <Status statusValue={status || keyworker.status} handleStatusChange={handleStatusChange} />
    </div>
  )

  return (
    <div>
      <div className="pure-g">
        <div className="pure-u-md-8-12 padding-top">
          <a href="#back" title="Back link" className="link backlink" onClick={() => handleCancel(history)}>
            <img className="back-triangle" src="/images/BackTriangle.png" alt="" width="6" height="10" /> Back
          </a>
          <h1 className="heading-large margin-top">Edit profile</h1>
        </div>
        <div className="padding-top">
          <div className="pure-u-md-2-12">
            <span className="form-label">Name</span>
            <div className="bold padding-top-small">{keyworkerDisplayName}</div>
          </div>
          <div className="pure-u-md-2-12">
            <span className="form-label">Establishment</span>
            <div className="bold padding-top-small">{keyworker.agencyDescription}</div>
          </div>
          <div className="pure-u-md-2-12">
            <span className="form-label">Schedule type</span>
            <div className="bold padding-top-small">{keyworker.scheduleType}</div>
          </div>
          <div className="pure-u-md-1-12">
            <label className="form-label" htmlFor="capacity">
              Capacity
            </label>
            <div>
              <ValidationErrors validationErrors={validationErrors} fieldName="capacity" />
              <input
                type="text"
                className="form-control capacityInput"
                id="capacity"
                name="capacity"
                value={capacity}
                onChange={handleCapacityChange}
              />
            </div>
          </div>
          <div className="pure-u-md-3-12">{statusSelect}</div>
        </div>
        <div className="pure-u-md-5-12 padding-top-large margin-top">
          <div className="buttonGroup">
            <button type="button" className="button button-save" onClick={() => handleSaveChanges(history)}>
              Save and continue
            </button>
          </div>
          <div className="buttonGroup">
            <button type="button" className="button greyButton button-cancel" onClick={() => handleCancel(history)}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

KeyworkerProfileEdit.propTypes = {
  history: PropTypes.object,
  keyworker: PropTypes.object.isRequired,
  handleSaveChanges: PropTypes.func.isRequired,
  handleStatusChange: PropTypes.func.isRequired,
  handleCapacityChange: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  status: PropTypes.string,
  capacity: PropTypes.string,
  validationErrors: PropTypes.object,
}

export default KeyworkerProfileEdit
