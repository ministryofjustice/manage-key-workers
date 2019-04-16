import React from 'react'
import PropTypes from 'prop-types'
import Select from '@govuk-react/select'
import Button from '@govuk-react/button'
import { authRoleListType, errorType } from '../../../types'
import { lookupMeta } from '../../../govuk-helpers'

const AuthUserAddRole = ({ roleFilterList, handleRoleAddChange, roleList, handleAdd, error }) => {
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

  return (
    <div>
      {!rolesAvailable && <div id="no-roles">No roles available</div>}
      {rolesAvailable && (
        <Select
          label="Choose new role"
          mb={6}
          meta={lookupMeta('role', error)}
          htmlFor="role"
          input={{ id: 'role', name: 'role', onChange: handleRoleAddChange }}
        >
          <option key="choose" value="--">
            -- Select --
          </option>
          {roleListOptions}
        </Select>
      )}
      {rolesAvailable && (
        <Button id="add-button" onClick={handleAdd}>
          Add role
        </Button>
      )}
    </div>
  )
}

AuthUserAddRole.propTypes = {
  handleRoleAddChange: PropTypes.func.isRequired,
  handleAdd: PropTypes.func.isRequired,
  roleFilterList: authRoleListType.isRequired,
  roleList: authRoleListType.isRequired,
  error: errorType.isRequired,
}

export default AuthUserAddRole
