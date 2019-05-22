import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Select from '@govuk-react/select'
import Button from '@govuk-react/button'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'
import { BLACK, GREY_3 } from 'govuk-colours'
import { SPACING } from '@govuk-react/constants'
import { authRoleListType, errorType } from '../../../types'
import { lookupMeta } from '../../../govuk-helpers'

export const ButtonContainer = styled('div')`
  display: flex;
  flex-direction: row;
  button {
    margin-right: ${SPACING.SCALE_2};
  }
`

const AuthUserAddRole = ({ roleFilterList, handleRoleAddChange, roleList, handleAdd, handleCancel, error }) => {
  const roleListWithoutCurrentRoles = roleFilterList.filter(
    filteredRole => !roleList.some(currentRole => currentRole.roleCode === filteredRole.roleCode)
  )

  const roleListOptions = roleListWithoutCurrentRoles
    ? roleListWithoutCurrentRoles.map(role => (
        <option key={`role_option_${role.roleCode}`} data-qa={`${role.roleCode}_option`} value={role.roleCode}>
          {role.roleName}
        </option>
      ))
    : []

  const rolesAvailable = roleListOptions && roleListOptions.length > 0

  return (
    <GridRow>
      <GridCol setWidth="two-thirds">
        <form onSubmit={handleAdd}>
          {!rolesAvailable && <div data-qa="no-roles">No roles available</div>}
          {rolesAvailable && (
            <Select
              label="Choose new role"
              mb={6}
              meta={lookupMeta('role', error)}
              htmlFor="role"
              input={{ 'data-qa': 'role', name: 'role', onChange: handleRoleAddChange }}
            >
              <option key="choose" value="--">
                -- Select --
              </option>
              {roleListOptions}
            </Select>
          )}
          <ButtonContainer>
            {rolesAvailable && (
              <Button type="submit" data-qa="add-button">
                Add role
              </Button>
            )}
            <Button
              type="button"
              data-qa="cancel-button"
              onClick={handleCancel}
              buttonColour={GREY_3}
              buttonTextColour={BLACK}
            >
              Cancel
            </Button>
          </ButtonContainer>
        </form>
      </GridCol>
    </GridRow>
  )
}

AuthUserAddRole.propTypes = {
  handleRoleAddChange: PropTypes.func.isRequired,
  handleAdd: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  roleFilterList: authRoleListType.isRequired,
  roleList: authRoleListType.isRequired,
  error: errorType.isRequired,
}

export default AuthUserAddRole
