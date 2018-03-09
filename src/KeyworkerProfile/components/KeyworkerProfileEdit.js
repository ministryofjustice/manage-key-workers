import React, { Component } from 'react';
import { properCaseName } from "../../stringUtils";
import PropTypes from 'prop-types';

class KeyworkerProfileEdit extends Component {
  render () {
    const keyworkerDisplayName = properCaseName(this.props.keyworker.firstName) + ' ' + properCaseName(this.props.keyworker.lastName);


    return (
      <div>
        <div className="pure-g">
          <div className="pure-u-md-8-12 padding-top">
            <h1 className="heading-large">Edit Profile for {keyworkerDisplayName}</h1>
          </div>
          <div className="">
            <div className="pure-u-md-2-12" >
              <label className="form-label" htmlFor="name">Establishment</label>
              <div>todo - API work</div>
            </div>

            <div className="pure-u-md-2-12" >
              <label className="form-label" htmlFor="name">Schedule type</label>
              <div>todo - API work</div>
            </div>

            <div className="pure-u-md-2-12" >
              <label className="form-label" htmlFor="name">Status</label>
              <div>todo - API work</div>
            </div>

            <div className="pure-u-md-2-12" >
              <label className="form-label" htmlFor="name">Capacity</label>
              <div>todo - API work</div>
            </div>

            <div className="pure-u-md-2-12" >
              <button id="saveButton" className="button" onClick={() => this.props.handleSaveChanges(this.props.history)}>Save changes</button>
              <button id="cancelButton" className="button" onClick={() => this.props.handleCancel(this.props.history)}>Cancel</button>
            </div>
          </div>
          <hr/>

        </div>
      </div>
    );
  }
}

KeyworkerProfileEdit.propTypes = {
  history: PropTypes.object,
  keyworker: PropTypes.object.isRequired,
  handleSaveChanges: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired
};


export default KeyworkerProfileEdit;
