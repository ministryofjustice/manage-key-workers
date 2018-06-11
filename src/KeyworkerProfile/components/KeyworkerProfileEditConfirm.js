import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getStatusStyle, getStatusDescription } from "../keyworkerStatus";
import ValidationErrors from "../../ValidationError";

class KeyworkerProfileEditConfirm extends Component {
  render () {
    let innerContents = (<div id="inactiveWarning" className="padding-top"><span><img alt="" className="" src="/images/icon-important-2x.png" height="30" width="30"/></span><div className="padding-left pure-u-md-7-12">
      This will remove the key worker from the auto-allocation pool and release all of their allocated prisoners.</div></div>);

    if (this.props.status !== 'INACTIVE') {
      innerContents = (<div className="pure-u-md-6-12">
        <div className="padding-bottom">Choose an option:</div>
        <ValidationErrors validationErrors={this.props.validationErrors} fieldName={'behaviourRadios'} />
        <div name="behaviourRadios" id="behaviourRadios" className="multiple-choice">
          <input type="radio" name="allocationOption" value="KEEP_ALLOCATIONS" onClick={this.props.handleOptionChange}/>
          <label>Continue to auto-allocate</label>
        </div>
        <div className="multiple-choice">
          <input type="radio" name="allocationOption" value="KEEP_ALLOCATIONS_NO_AUTO" onClick={this.props.handleOptionChange}/>
          <label>Stop allocating</label>
        </div>
        <div className="multiple-choice">
          <input type="radio" name="allocationOption" value="REMOVE_ALLOCATIONS_NO_AUTO" onClick={this.props.handleOptionChange}/>
          <label>Stop allocating and unallocate all their current prisoners</label>
        </div>
      </div>);
    }

    const statusStyle = getStatusStyle(this.props.status);
    return (
      <div>
        <div className="pure-g padding-top">
          <div className="pure-u-md-8-12 padding-top">
            <h1 className="heading-large margin-top">Status change</h1>
          </div>
          <div className="pure-g">
            <div className="pure-u-md-4-12">
              <label className="form-label" htmlFor="keyworker-status">Proposed new status:</label>
              <div id="keyworker-status" name="keyworker-status"
                className={`${statusStyle}Status margin-top`}>{getStatusDescription(this.props.status)}</div>
            </div>
          </div>
          <div className="pure-g padding-top form-group">

            {innerContents}

            <div className="pure-u-md-8-12 padding-top-large margin-top">
              <div className="pure-u-md-10-12">
                <div className="buttonGroup">
                  <button id="saveButton" className="button"
                    onClick={() => this.props.handleSaveChanges(this.props.history)}>Save changes
                  </button>
                </div>
                <div className="buttonGroup">
                  <button id="cancelButton" className="button greyButton button-cancel"
                    onClick={() => this.props.handleCancel(this.props.history)}>Cancel and go back
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

KeyworkerProfileEditConfirm.propTypes = {
  history: PropTypes.object,
  keyworker: PropTypes.object.isRequired,
  handleSaveChanges: PropTypes.func.isRequired,
  handleOptionChange: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  status: PropTypes.string,
  capacity: PropTypes.string,
  validationErrors: PropTypes.object
};


export default KeyworkerProfileEditConfirm;
