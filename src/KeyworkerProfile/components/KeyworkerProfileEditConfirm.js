import React from 'react'
import PropTypes from 'prop-types'
import { getStatusStyle, getStatusDescription } from '../keyworkerStatus'
import ValidationErrors from '../../ValidationError'
import DatePickerInput from '../../DatePickerInput'

const KeyworkerProfileEditConfirm = ({
  status,
  history,
  validationErrors,
  handleOptionChange,
  handleDateChange,
  handleSaveChanges,
  handleCancel,
}) => {
  let innerContents = (
    <div id="inactiveWarning" className="padding-top">
      <span>
        <img alt="" className="" src="/images/icon-important-2x.png" height="30" width="30" />
      </span>
      <div className="padding-left pure-u-md-7-12">
        This will remove the key worker from the auto-allocation pool and release all of their allocated prisoners.
      </div>
    </div>
  )

  if (status !== 'INACTIVE') {
    innerContents = (
      <div>
        <div className="pure-u-md-6-12">
          <div className="padding-bottom">Choose an option:</div>
          <ValidationErrors validationErrors={validationErrors} fieldName="behaviourRadios" />
          <div name="behaviourRadios" id="behaviourRadios" className="multiple-choice">
            <input
              type="radio"
              name="allocationOption"
              id="keep"
              value="KEEP_ALLOCATIONS"
              onClick={handleOptionChange}
            />
            <label htmlFor="keep">Continue to auto-allocate</label>
          </div>
          <div className="multiple-choice">
            <input
              type="radio"
              name="allocationOption"
              id="keepNoAuto"
              value="KEEP_ALLOCATIONS_NO_AUTO"
              onClick={handleOptionChange}
            />
            <label htmlFor="keepNoAuto">Stop allocating</label>
          </div>
          <div className="multiple-choice">
            <input
              type="radio"
              name="allocationOption"
              id="remove"
              value="REMOVE_ALLOCATIONS_NO_AUTO"
              onClick={handleOptionChange}
            />
            <label htmlFor="remove">Stop allocating and unallocate all their current prisoners</label>
          </div>
        </div>

        {status === 'UNAVAILABLE_ANNUAL_LEAVE' && (
          <div className="pure-u-md-8-12 padding-top bold">
            <div className="padding-bottom padding-top">What date will they return from annual leave?</div>
            <ValidationErrors validationErrors={validationErrors} fieldName="active-date" />
            <div className="pure-u-md-5-12" id="active-date">
              <DatePickerInput
                className="annualLeaveDate"
                handleDateChange={handleDateChange}
                additionalClassName="dateInput"
                inputId="search-date"
              />
            </div>
          </div>
        )}
      </div>
    )
  }

  const statusStyle = getStatusStyle(status)

  return (
    <div>
      <div className="pure-g">
        <div className="pure-u-md-8-12 padding-top">
          <a href="#back" title="Back link" className="link backlink" onClick={history.goBack}>
            <img className="back-triangle" src="/images/BackTriangle.png" alt="" width="6" height="10" /> Back
          </a>
          <h1 className="heading-large margin-top">Update status</h1>
        </div>
        <div className="pure-g">
          <div className="pure-u-md-4-12">
            <span className="form-label">Proposed new status:</span>
            <div id="keyworker-status" name="keyworker-status" className={`${statusStyle}Status margin-top`}>
              {getStatusDescription(status)}
            </div>
          </div>
        </div>
        <div className="pure-g padding-top form-group">
          {innerContents}

          <div className="pure-u-md-8-12 padding-top-large margin-top">
            <div className="pure-u-md-10-12">
              <div className="buttonGroup">
                <button type="button" className="button button-save" onClick={() => handleSaveChanges(history)}>
                  Save changes
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
      </div>
    </div>
  )
}

KeyworkerProfileEditConfirm.propTypes = {
  history: PropTypes.object.isRequired,
  handleSaveChanges: PropTypes.func.isRequired,
  handleOptionChange: PropTypes.func.isRequired,
  handleDateChange: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
  validationErrors: PropTypes.object.isRequired,
}

export default KeyworkerProfileEditConfirm
