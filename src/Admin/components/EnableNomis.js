import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";


class EnableNomis extends Component {
  render () {
    const { user, history, handleEnable, handleCancel } = this.props;
    const caseLoadOption = user.caseLoadOptions ? user.caseLoadOptions.find((option) => option.caseLoadId === user.activeCaseLoadId) : undefined;
    const caseLoadDesc = caseLoadOption ? caseLoadOption.description : user.activeCaseLoadId;

    return (
      <div>
        <div className="pure-g">
          <div className="pure-u-md-12-12 padding-top">
            <Link id={`back_link`} title="Back link" className="link backlink" to={`/`} >
              <img className="back-triangle" src="/images/BackTriangle.png" alt="" width="6" height="10"/> Back</Link>
            <h1 className="heading-large margin-top">Give access to New NOMIS</h1>
          </div>
          <div className="pure-u-md-12-12 padding-top">
            <div className="pure-u-md-2-12" >
              <div className="bold">Prison</div>
            </div>
            <div className="pure-u-md-4-12" >
              <div>{caseLoadDesc}</div>
            </div>
            <hr/>
          </div>
          <div className="pure-u-md-12-12 padding-top">
            <div className="pure-u-md-4-12 padding-top bold">
            Select Yes to give a prison access to New NOMIS for the first time, or to add new prison staff to this prison&apos;s account.
            </div>
          </div>
          <div className="pure-u-md-5-12 padding-top-large margin-top" >
            <div className="buttonGroup" >
              <button id="giveAccessButton" className="button button-save" onClick={() => handleEnable(history)}>Yes, give access now</button>
            </div>
            <div className="buttonGroup">
              <button className="button greyButton button-cancel" onClick={() => handleCancel(history)}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

EnableNomis.propTypes = {
  history: PropTypes.object,
  handleEnable: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  user: PropTypes.object
};


export default EnableNomis;
