import React from 'react'
import PropTypes from 'prop-types'
import InputField from '@govuk-react/input-field'
import Button from '@govuk-react/button'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'
import Select from '@govuk-react/select'
import { lookupMeta } from '../../../govuk-helpers'
import { authGroupListType, errorType } from '../../../types'

const AuthUserCreate = ({ handleChange, handleCreate, groupList, error }) => {
  const groupListOptions = groupList.map(group => (
    <option key={`group_option_${group.groupCode}`} data-qa={`${group.groupCode}_option`} value={group.groupCode}>
      {group.groupName}
    </option>
  ))

  const groupsAvailable = groupListOptions && groupListOptions.length > 0

  return (
    <GridRow>
      <GridCol setWidth="two-thirds">
        <form onSubmit={handleCreate} noValidate>
          <InputField
            meta={lookupMeta('username', error)}
            htmlFor="username"
            mb={6}
            input={{
              id: 'username',
              name: 'username',
              onChange: handleChange,
              autoComplete: 'create-username',
              spellCheck: false,
            }}
          >
            Username
          </InputField>
          <InputField
            meta={lookupMeta('email', error)}
            htmlFor="email"
            mb={6}
            input={{
              id: 'email',
              name: 'email',
              onChange: handleChange,
              autoComplete: 'create-email',
              type: 'email',
              spellCheck: false,
            }}
          >
            Email address
          </InputField>
          <InputField
            meta={lookupMeta('firstName', error)}
            htmlFor="firstName"
            mb={6}
            input={{ id: 'firstName', name: 'firstName', onChange: handleChange, spellCheck: false }}
          >
            First name
          </InputField>
          <InputField
            meta={lookupMeta('lastName', error)}
            htmlFor="lastName"
            mb={6}
            input={{ id: 'lastName', name: 'lastName', onChange: handleChange, spellCheck: false }}
          >
            Last name
          </InputField>

          {groupsAvailable && (
            <Select
              label="Select group"
              mb={6}
              meta={lookupMeta('groupCode', error)}
              htmlFor="groupCode"
              input={{ id: 'groupCode', name: 'groupCode', onChange: handleChange }}
            >
              <option key="choose" value="--">
                -- Select --
              </option>
              {groupListOptions}
            </Select>
          )}

          <Button type="submit" id="create-button">
            Create
          </Button>
        </form>
      </GridCol>
    </GridRow>
  )
}

AuthUserCreate.propTypes = {
  handleChange: PropTypes.func.isRequired,
  handleCreate: PropTypes.func.isRequired,
  groupList: authGroupListType.isRequired,
  error: errorType,
}

AuthUserCreate.defaultProps = {
  error: [],
}

export default AuthUserCreate
