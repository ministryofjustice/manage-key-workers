import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { properCaseName } from "../../../stringUtils";
import ValidationErrors from "../../../ValidationError";
// import '../index.scss';

class AddRole extends Component {
  render () {
    const formattedName = this.props.contextUser && properCaseName(this.props.contextUser.firstName) + ' ' + properCaseName(this.props.contextUser.lastName);

    const roleListWithoutCurrentRoles = this.props.roleFilterList.filter(
      filteredRole => !this.props.roleList.some(currentRole => currentRole.roleCode === filteredRole.roleCode)
    );


    const roleListOptions = roleListWithoutCurrentRoles ? roleListWithoutCurrentRoles.map((role, optionIndex) => {
      return <option key={`role_option_${optionIndex}`} id={`${role.roleCode}_option`} value={role.roleCode}>{role.roleName}</option>;
    }) : [];

    const rolesAvailable = roleListOptions && roleListOptions.length > 0;

    const roleSelect = (<select id="role-select" name="role-select" className="widthAuto form-control"
      value={this.props.roleFilter}
      onChange={this.props.handleRoleFilterChange}>
      <option key="choose" value="--">-- Select --</option>
      {roleListOptions}
    </select>);

    return (
      <div>
        <div className="padding-bottom-large">
          <div className="padding-top">
            <a href="#back" title="Back link" className="link backlink" onClick={(event) => this.props.handleCancel(event, this.props.history)} >
              <img className="back-triangle" src="/images/BackTriangle.png" alt="" width="6" height="10"/> Back</a>
          </div>
          <div className="pure-g">
            <div className="pure-u-md-11-12 ">
              <h1 className="heading-large margin-top" id="page-title">Add staff role: {formattedName}</h1>

              <div>
                <div className="pure-u-md-11-12 searchForm padding-top padding-bottom-large">
                  {!rolesAvailable && <div className="pure-u-md-6-12 margin-left-15">No roles available</div>}
                  {rolesAvailable && <div className="margin-left-15">
                    <label className="form-label" htmlFor="role-select">Choose new role</label>
                    <ValidationErrors validationErrors={this.props.validationErrors} fieldName={'role-select'} />
                    { roleSelect }
                  </div>}
                </div>
              </div>
            </div>
          </div>
          <div className="pure-u-md-7-12">
            {rolesAvailable && <button className="button margin-left margin-top-large" id="add-button" onClick={(event) => { this.props.handleAdd(event, this.props.history);}}>Add role</button>}
            <button className="button margin-left-15 margin-top-large" id="cancel-button" onClick={(event) => { this.props.handleCancel(event, this.props.history);}}>Cancel</button>
          </div>
        </div>
      </div>

    );
  }
}

AddRole.propTypes = {
  error: PropTypes.string,
  roleFilter: PropTypes.string,
  agencyId: PropTypes.string.isRequired,
  roleFilterDispatch: PropTypes.func,
  handleRoleFilterChange: PropTypes.func.isRequired,
  handleAdd: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  resetErrorDispatch: PropTypes.func,
  roleFilterList: PropTypes.array,
  roleList: PropTypes.array,
  history: PropTypes.object,
  contextUser: PropTypes.object,
  validationErrors: PropTypes.object
};

const AddRoleWithRouter = withRouter(AddRole);

export { AddRole };
export default AddRoleWithRouter;
