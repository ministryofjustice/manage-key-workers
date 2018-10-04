import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import MessageBar from "../../../MessageBar";
import { properCaseName } from "../../../stringUtils";

class StaffRoleProfile extends Component {
  render () {
    const formattedName = this.props.contextUser && properCaseName(this.props.contextUser.firstName) + ' ' + properCaseName(this.props.contextUser.lastName);
    const results = this.props.roleList.map((a, index) => {
      return (
        <tr key={a.roleCode}>
          <td className="row-gutters">{a.roleName}</td>
          <td className="row-gutters"><button className="button removeButton" id={`remove-button-${a.roleCode}`} value={a.roleCode} onClick={(event) => { this.props.handleRemove(event, this.props.history);}}>Remove</button></td>
        </tr>
      );
    }
    );

    return (
      <div className="padding-bottom-large">
        <MessageBar {...this.props}/>
        {this.props.displayBack()}
        <div className="pure-g">
          <div className="pure-u-md-11-12 ">
            <h1 className="heading-large margin-top" id="page-title">Staff role profile</h1>

            <div className="pure-u-md-12-12 padding-top ">
              <div className="pure-u-md-2-12" >
                <div className="bold">Name</div>
              </div>
              <div className="pure-u-md-7-12" >
                <div>{formattedName}</div>
              </div>
            </div>

            <hr/>

            <div className="pure-u-md-7-12">
              <div className="padding-bottom-40">
                <table>
                  <thead>
                    <tr>
                      <th>Role</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>{results.length > 0 ? results : <tr><td className="padding-left font-small row-gutters no-results-row">No roles found</td></tr>}</tbody>
                </table>
              </div>
              <div><button className="button" id="add-button" onClick={(event) => { this.props.handleAdd(event, this.props.history);}}>Add role</button></div>
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
