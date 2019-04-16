import React from 'react'
import PropTypes from 'prop-types'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'
import Button from '@govuk-react/button'
import Table from '@govuk-react/table'
import { BLACK, GREY_3 } from 'govuk-colours'
import MessageBar from '../../../MessageBar'
import { authRoleListType, contextAuthUserType } from '../../../types'

const AuthUser = props => {
  const { roleList, handleRemove, handleAdd, contextUser } = props

  const results = roleList.map(a => (
    <Table.Row key={a.roleCode}>
      <Table.Cell>{a.roleName}</Table.Cell>
      <Table.Cell alignRight>
        <Button
          buttonColour={GREY_3}
          buttonTextColour={BLACK}
          mb={0}
          id={`remove-button-${a.roleCode}`}
          value={a.roleCode}
          onClick={handleRemove}
        >
          Remove
        </Button>
      </Table.Cell>
    </Table.Row>
  ))

  return (
    <div>
      <MessageBar {...props} />
      <GridRow mb={5}>
        <GridCol setWidth="two-thirds">
          <Table id="user-details">
            <Table.Row>
              <Table.CellHeader>Username</Table.CellHeader>
              <Table.Cell>{contextUser.username}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.CellHeader>Name</Table.CellHeader>
              <Table.Cell>
                {contextUser.firstName} {contextUser.lastName}
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.CellHeader>Email</Table.CellHeader>
              <Table.Cell>{contextUser.email}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.CellHeader>Locked</Table.CellHeader>
              <Table.Cell>{contextUser.locked ? 'Yes' : 'No'}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.CellHeader>Enabled</Table.CellHeader>
              <Table.Cell>{contextUser.enabled ? 'Yes' : 'No'}</Table.Cell>
            </Table.Row>
          </Table>
        </GridCol>
      </GridRow>

      <GridRow>
        <GridCol setWidth="one-half">
          <Table id="user-roles">
            <Table.Row>
              <Table.CellHeader>Current roles</Table.CellHeader>
              <Table.CellHeader>&nbsp;</Table.CellHeader>
            </Table.Row>
            {results.length > 0 ? (
              results
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
        <Button id="add-button" onClick={handleAdd}>
          Add role
        </Button>
      </div>
    </div>
  )
}

AuthUser.propTypes = {
  contextUser: contextAuthUserType.isRequired,
  roleList: authRoleListType.isRequired,
  handleRemove: PropTypes.func.isRequired,
  handleAdd: PropTypes.func.isRequired,
}

export default AuthUser
