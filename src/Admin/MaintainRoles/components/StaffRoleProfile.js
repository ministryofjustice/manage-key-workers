import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import MessageBar from "../../../MessageBar";
import { properCaseName } from "../../../stringUtils";

class StaffRoleProfile extends Component {
  goBack (e, history) {
    e.preventDefault();
    // Return to previous page in history. There can be multiple origin pages.
    history.goBack();
  }

  render () {
    const { contextUser, roleList, history, handleAdd, handleRemove } = this.props;
    const formattedName = contextUser && properCaseName(contextUser.firstName) + ' ' + properCaseName(contextUser.lastName);
    const results = roleList.map((a) => (
        <tr key={a.roleCode}>
          <td className="row-gutters">{a.roleName}</td>
          <td className="row-gutters"><button type="button" className="button greyButtonNoMinWidth removeButton" id={`remove-button-${a.roleCode}`} value={a.roleCode} onClick={(event) => { handleRemove(event, history);}}>Remove</button></td>
        </tr>
      )
    );

    return (
      <div className="padding-bottom-large">
        <MessageBar {...this.props}/>
        <div className="padding-top">
          <a href="#back" title="Back link" className="link backlink" onClick={(event) => this.goBack(event, history)} >
            <img className="back-triangle" src="/images/BackTriangle.png" alt="" width="6" height="10"/> Back</a>
        </div>
        <div className="pure-g">
          <div className="pure-u-md-11-12 ">
            <h1 className="heading-large margin-top" id="page-title">Staff roles: {formattedName}</h1>

            <div className="pure-u-md-7-12">
              <div className="padding-bottom-40">
                <table>
                  <thead>
                    <tr>
                      <th>Current roles</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>{results.length > 0 ? results : <tr><td className="padding-left font-small row-gutters no-results-row">No roles found</td></tr>}</tbody>
                </table>
              </div>
              <div><button type="button" className="button" id="add-button" onClick={(event) => { handleAdd(event, history);}}>Add role</button></div>
            </div>
          </div>
        </div>
      </div>


    );
  }
}

StaffRoleProfile.propTypes = {
  error: PropTypes.string,
  agencyId: PropTypes.string.isRequired,
  resetErrorDispatch: PropTypes.func,
  displayBack: PropTypes.func.isRequired,
  history: PropTypes.object,
  contextUser: PropTypes.object.isRequired,
  roleList: PropTypes.array.isRequired,
  handleRemove: PropTypes.func,
  handleAdd: PropTypes.func
};

const StaffRoleProfileWithRouter = withRouter(StaffRoleProfile);

export { StaffRoleProfile };
export default StaffRoleProfileWithRouter;
