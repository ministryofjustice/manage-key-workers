import React from 'react'
import PropTypes from 'prop-types'
import ReactRouterPropTypes from 'react-router-prop-types'
import { withRouter } from 'react-router'
import ValidationErrors from '../../../ValidationError'
import { roleFilterListType, roleListType } from '../../../types'

const AddRole = ({
  history,
  handleCancel,
  validationErrors,
  roleFilter,
  roleFilterList,
  handleRoleAddChange,
  roleList,
  handleAdd,
}) => {
  const roleListWithoutCurrentRoles = roleFilterList.filter(
    filteredRole => !roleList.some(currentRole => currentRole.roleCode === filteredRole.roleCode)
  )

  const roleListOptions = roleListWithoutCurrentRoles
    ? roleListWithoutCurrentRoles.map(role => (
        <option key={`role_option_${role.roleCode}`} id={`${role.roleCode}_option`} value={role.roleCode}>
          {role.roleName}
        </option>
      ))
    : []

  const rolesAvailable = roleListOptions && roleListOptions.length > 0

  const roleSelect = (
    <select
      id="role-select"
      name="role-select"
      className="widthAuto form-control"
      value={roleFilter}
      onChange={handleRoleAddChange}
    >
      <option key="choose" value="--">
        -- Select --
      </option>
      {roleListOptions}
    </select>
  )

  return (
    <div>
      <div className="padding-bottom-large">
        <div className="pure-g">
          <div className="pure-u-md-11-12 ">
            <div className="pure-u-md-11-12 searchForm padding-top padding-bottom-large">
              {!rolesAvailable && <div className="pure-u-md-6-12 margin-left-15">No roles available</div>}
              {rolesAvailable && (
                <div className="margin-left-15">
                  <label className="form-label" htmlFor="role-select">
                    Choose new role
                  </label>
                  <ValidationErrors validationErrors={validationErrors} fieldName="role-select" />
                  {roleSelect}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="pure-u-md-7-12">
          {rolesAvailable && (
            <button
              type="button"
              className="button margin-left margin-top-large"
              id="add-button"
              onClick={event => {
                handleAdd(event, history)
              }}
            >
              Add role
            </button>
          )}
          <button
            type="button"
            className="button greyButtonNoMinWidth margin-left-15 margin-top-large"
            id="cancel-button"
            onClick={event => {
              handleCancel(event, history)
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

AddRole.propTypes = {
  roleFilter: PropTypes.string.isRequired,
  handleRoleAddChange: PropTypes.func.isRequired,
  handleAdd: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  roleFilterList: roleFilterListType.isRequired,
  roleList: roleListType.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  validationErrors: PropTypes.shape({}).isRequired,
}

const AddRoleWithRouter = withRouter(AddRole)

export { AddRole }
export default AddRoleWithRouter
