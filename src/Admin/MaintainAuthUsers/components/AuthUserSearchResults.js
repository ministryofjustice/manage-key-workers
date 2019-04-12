import React from 'react'
import PropTypes from 'prop-types'
import Button from '@govuk-react/button'
import Table from '@govuk-react/table'
import { GREY_3, BLACK } from 'govuk-colours'
import AuthUserSearch from './AuthUserSearch'
import { authUserListType, errorType } from '../../../types'

const AuthUserSearchResults = props => {
  const { user, userList, handleChange, handleSearch, handleEdit, error } = props
  const results = userList.map((a, index) => (
    <Table.Row key={a.username}>
      <Table.Cell>
        {a.firstName} {a.lastName}
      </Table.Cell>
      <Table.Cell>{a.username}</Table.Cell>
      <Table.Cell>{a.email}</Table.Cell>
      <Table.Cell>{a.locked ? 'Yes' : 'No'}</Table.Cell>
      <Table.Cell>{a.enabled ? 'Yes' : 'No'}</Table.Cell>
      <Table.Cell>
        <Button
          buttonColour={GREY_3}
          buttonTextColour={BLACK}
          mb={0}
          id={`edit-button-${a.username}`}
          value={index}
          onClick={handleEdit}
        >
          Edit
        </Button>
      </Table.Cell>
    </Table.Row>
  ))

  return (
    <div>
      <AuthUserSearch handleSearch={handleSearch} handleChange={handleChange} user={user} error={error} />

      {results.length > 0 && (
        <Table>
          <Table.Row>
            <Table.CellHeader>Name</Table.CellHeader>
            <Table.CellHeader>Username</Table.CellHeader>
            <Table.CellHeader>Email</Table.CellHeader>
            <Table.CellHeader>Locked</Table.CellHeader>
            <Table.CellHeader>Enabled</Table.CellHeader>
            <Table.CellHeader>&nbsp;</Table.CellHeader>
          </Table.Row>
          {results}
        </Table>
      )}
    </div>
  )
}

AuthUserSearchResults.propTypes = {
  user: PropTypes.string,
  userList: authUserListType.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
  error: errorType.isRequired,
}

AuthUserSearchResults.defaultProps = {
  user: '',
}

export default AuthUserSearchResults
