import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getStatusStyle, getStatusDescription } from "../keyworkerStatus";

class KeyworkerProfileEditConfirm extends Component {
  render () {
    let innerContents = (<div className="padding-top"><span><img alt="" className="" src="/images/icon-important.png"/></span><div className="padding-left pure-u-md-7-12">
      This will remove the key worker from the auto-allocation pool and release all of their allocated offenders</div></div>);

    if (this.props.status !== 'INACTIVE') {
      innerContents = (<div className="pure-u-md-6-12">
        <div className="padding-bottom">Choose an option:</div>
        <div className="multiple-choice">
          <input type="radio" name="allocationOption" value="KEEP_ALLOCATIONS" onClick={this.props.handleOptionChange}/>
          <label>Continue to auto-allocate
          prisoners to this key worker and keep those already
          allocated to them</label>
        </div>
        <div className="multiple-choice">
          <input type="radio" name="allocationOption" value="KEEP_ALLOCATIONS_NO_AUTO" onClick={this.props.handleOptionChange}/>
          <label>No longer
          auto-allocate to key worker but keep those already allocated to them</label>
        </div>
        <div className="multiple-choice">
          <input type="radio" name="allocationOption" value="REMOVE_ALLOCATIONS_NO_AUTO" onClick={this.props.handleOptionChange}/>
          <label>No longer auto-allocate to key worker and remove
          those already allocated to them</label>
        </div>
      </div>);
    }

    const statusStyle = getStatusStyle(this.props.status);
    return (
      <div>
        <div className="pure-g padding-top">
          <div className="pure-u-md-8-12 padding-top">
            <h1 className="heading-large">Status change</h1>
          </div>
          <div className="pure-g">
            <div className="pure-u-md-3-12">
              <label className="form-label" htmlFor="keyworker-status">Proposed new status</label>
              <div id="keyworker-status" name="keyworker-status"
                className={`${statusStyle}Status margin-top`}>{getStatusDescription(this.props.status)}</div>
            </div>
          </div>
          <div className="pure-g padding-top form-group">

            {innerContents}

            <div className="pure-u-md-8-12 padding-top-large margin-top">
              <div className="pure-u-md-3-12">
                <button id="saveButton" className="button"
                  onClick={() => this.props.handleSaveChanges(this.props.history)}>Save and continue
                </button>
              </div>
              <div className="pure-u-md-3-12">
                <button id="cancelButton" className="button button-cancel"
                  onClick={() => this.props.handleCancel(this.props.history)}>Cancel and go back
                </button>
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
  status: PropTypes.string
};


export default KeyworkerProfileEditConfirm;
