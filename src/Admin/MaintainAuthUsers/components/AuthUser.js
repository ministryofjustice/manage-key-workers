import React from 'react'
import PropTypes from 'prop-types'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'
import Button from '@govuk-react/button'
import Table from '@govuk-react/table'
import Link from '@govuk-react/link'
import { Link as RouterLink } from 'react-router-dom'
import { BLACK, GREY_3 } from 'govuk-colours'
import moment from 'moment'
import MessageBar from '../../../MessageBar'
import { authGroupListType, authRoleListType, contextAuthUserType, userType } from '../../../types'

const AuthUser = props => {
  const {
    user: { maintainAuthUsers },
    roleList,
    groupList,
    handleRoleRemove,
    handleRoleAdd,
    handleGroupRemove,
    handleGroupAdd,
    contextUser,
    handleEnable,
    handleDisable,
  } = props

  const roleResults = roleList.map(a => (
    <Table.Row key={a.roleCode}>
      <Table.Cell>{a.roleName}</Table.Cell>
      <Table.Cell alignRight>
        <Button
          buttonColour={GREY_3}
          buttonTextColour={BLACK}
          mb={0}
          data-qa={`remove-button-${a.roleCode}`}
          value={a.roleCode}
          onClick={handleRoleRemove}
        >
          Remove
        </Button>
      </Table.Cell>
    </Table.Row>
  ))

  const groupResults = groupList.map(a => (
    <Table.Row key={a.groupCode}>
      <Table.Cell>{a.groupName}</Table.Cell>
      <Table.Cell alignRight>
        {maintainAuthUsers && (
          <Button
            buttonColour={GREY_3}
            buttonTextColour={BLACK}
            mb={0}
            data-qa={`remove-button-${a.groupCode}`}
            value={a.groupCode}
            onClick={handleGroupRemove}
          >
            Remove
          </Button>
        )}
      </Table.Cell>
    </Table.Row>
  ))

  return (
    <div>
      <MessageBar {...props} />
      <GridRow mb={5}>
        <GridCol setWidth="two-thirds">
          <Table data-qa="user-details">
            <Table.Row>
              <Table.CellHeader>Username</Table.CellHeader>
              <Table.Cell>{contextUser.username}</Table.Cell>
              <Table.Cell>&nbsp;</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.CellHeader>Name</Table.CellHeader>
              <Table.Cell>
                {contextUser.firstName} {contextUser.lastName}
              </Table.Cell>
              <Table.Cell>&nbsp;</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.CellHeader>Email</Table.CellHeader>
              <Table.Cell>{contextUser.email}</Table.Cell>
              <Table.Cell>
                <Link
                  data-qa="amend-link"
                  as={RouterLink}
                  to={`/admin-utilities/maintain-auth-users/${contextUser.username}/amend`}
                >
                  Change
                </Link>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.CellHeader>Locked</Table.CellHeader>
              <Table.Cell>{contextUser.locked ? 'Yes' : 'No'}</Table.Cell>
              <Table.Cell>&nbsp;</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.CellHeader>Enabled</Table.CellHeader>
              <Table.Cell>{contextUser.enabled ? 'Yes' : 'No'}</Table.Cell>
              <Table.Cell>
                <Button
                  buttonColour={GREY_3}
                  buttonTextColour={BLACK}
                  mb={0}
                  data-qa="enable-button"
                  value={contextUser.username}
                  onClick={contextUser.enabled ? handleDisable : handleEnable}
                >
                  {contextUser.enabled ? 'Disable' : 'Enable'}
                </Button>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.CellHeader>Verified</Table.CellHeader>
              <Table.Cell>{contextUser.verified ? 'Yes' : 'No'}</Table.Cell>
              <Table.Cell>&nbsp;</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.CellHeader>Last logged in</Table.CellHeader>
              <Table.Cell>{moment(contextUser.lastLoggedIn).format('D MMMM YYYY - HH:mm:ss')}</Table.Cell>
              <Table.Cell>&nbsp;</Table.Cell>
            </Table.Row>
          </Table>
        </GridCol>
      </GridRow>

      <GridRow>
        <GridCol setWidth="one-half">
          <Table data-qa="user-roles">
            <Table.Row>
              <Table.CellHeader>Current roles</Table.CellHeader>
              <Table.CellHeader>&nbsp;</Table.CellHeader>
            </Table.Row>
            {roleResults.length > 0 ? (
              roleResults
            ) : (
              <Table.Row>
                <Table.Cell>No roles found</Table.Cell>
                <Table.Cell>&nbsp;</Table.Cell>
              </Table.Row>
            )}
          </Table>
        </GridCol>
      </GridRow>

      <div>
        <Button data-qa="add-role-button" onClick={handleRoleAdd}>
          Add role
        </Button>
      </div>

      <GridRow>
        <GridCol setWidth="one-half">
          <Table data-qa="user-groups">
            <Table.Row>
              <Table.CellHeader>Current groups</Table.CellHeader>
              <Table.CellHeader>&nbsp;</Table.CellHeader>
            </Table.Row>
            {groupResults.length > 0 ? (
              groupResults
            ) : (
              <Table.Row>
                <Table.Cell>No groups found</Table.Cell>
                <Table.Cell>&nbsp;</Table.Cell>
              </Table.Row>
            )}
          </Table>
        </GridCol>
      </GridRow>
      {maintainAuthUsers && (
        <div>
          <Button data-qa="add-group-button" onClick={handleGroupAdd}>
            Add group
          </Button>
        </div>
      )}
    </div>
  )
}

AuthUser.propTypes = {
  user: userType.isRequired,
  contextUser: contextAuthUserType.isRequired,
  roleList: authRoleListType.isRequired,
  groupList: authGroupListType.isRequired,
  handleRoleRemove: PropTypes.func.isRequired,
  handleGroupRemove: PropTypes.func.isRequired,
  handleRoleAdd: PropTypes.func.isRequired,
  handleGroupAdd: PropTypes.func.isRequired,
  handleEnable: PropTypes.func.isRequired,
  handleDisable: PropTypes.func.isRequired,
}

export default AuthUser
