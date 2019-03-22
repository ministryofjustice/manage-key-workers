import React from 'react'
import renderer from 'react-test-renderer'
import Table from '@govuk-react/table'
import AuthUserSearchResults from './AuthUserSearchResults'

describe('Auth search results form', () => {
  const stubFunc = () => {}
  describe('no results', () => {
    const wrapper = renderer.create(
      <AuthUserSearchResults handleChange={stubFunc} handleSearch={stubFunc} user="" userList={[]} error={[]} />
    )
    it('should render correctly with no user and no results', () => {
      expect(wrapper.toJSON()).toMatchSnapshot()
    })
    it('should not render the table with no results', () => {
      expect(wrapper.root.findAllByType(Table)).toHaveLength(0)
    })
  })
  describe('some results', () => {
    const userList = [
      {
        username: 'AUTH_ADM',
        email: 'auth_test2@digital.justice.gov.uk',
        firstName: 'Auth',
        lastName: 'Adm',
        locked: true,
        enabled: false,
      },
      {
        username: 'AUTH_EXPIRED',
        email: 'auth_test2@digital.justice.gov.uk',
        firstName: 'Auth',
        lastName: 'Expired',
        locked: false,
        enabled: true,
      },
    ]
    const wrapper = renderer.create(
      <AuthUserSearchResults
        handleChange={stubFunc}
        handleSearch={stubFunc}
        user="someuser"
        userList={userList}
        error=""
      />
    )

    it('should render correctly with user and results', () => {
      expect(wrapper.toJSON()).toMatchSnapshot()
    })
    it('should render the table with a row for each result', () => {
      expect(wrapper.root.findAllByType(Table.Row)).toHaveLength(3)
    })
  })
})
