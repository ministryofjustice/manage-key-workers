import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Select from '@govuk-react/select'
import Button from '@govuk-react/button'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'
import { BLACK, GREY_3 } from 'govuk-colours'
import { SPACING } from '@govuk-react/constants'
import { authGroupListType, errorType } from '../../../types'
import { lookupMeta } from '../../../govuk-helpers'

export const ButtonContainer = styled('div')`
  display: flex;
  flex-direction: row;
  button {
    margin-right: ${SPACING.SCALE_2};
  }
`

const AuthUserAddGroup = ({ groupFilterList, handleGroupAddChange, groupList, handleAdd, handleCancel, error }) => {
  const groupListWithoutCurrentGroups = groupFilterList.filter(
    filteredGroup => !groupList.some(currentGroup => currentGroup.groupCode === filteredGroup.groupCode)
  )

  const groupListOptions = groupListWithoutCurrentGroups
    ? groupListWithoutCurrentGroups.map(group => (
        <option key={`group_option_${group.groupCode}`} data-qa={`${group.groupCode}_option`} value={group.groupCode}>
          {group.groupName}
        </option>
      ))
    : []

  const groupsAvailable = groupListOptions && groupListOptions.length > 0

  return (
    <GridRow>
      <GridCol setWidth="two-thirds">
        <form onSubmit={handleAdd}>
          {!groupsAvailable && <div data-qa="no-groups">No groups available</div>}
          {groupsAvailable && (
            <Select
              label="Choose new group"
              mb={6}
              meta={lookupMeta('group', error)}
              htmlFor="group"
              input={{ id: 'group', name: 'group', onChange: handleGroupAddChange }}
            >
              <option key="choose" value="--">
                -- Select --
              </option>
              {groupListOptions}
            </Select>
          )}
          <ButtonContainer>
            {groupsAvailable && (
              <Button type="submit" data-qa="add-button">
                Add group
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

AuthUserAddGroup.propTypes = {
  handleGroupAddChange: PropTypes.func.isRequired,
  handleAdd: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  groupFilterList: authGroupListType.isRequired,
  groupList: authGroupListType.isRequired,
  error: errorType.isRequired,
}

export default AuthUserAddGroup
