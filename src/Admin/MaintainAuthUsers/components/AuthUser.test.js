import React from 'react'
import renderer from 'react-test-renderer'
import Table from '@govuk-react/table'
import { MemoryRouter } from 'react-router-dom'
import AuthUser from './AuthUser'

const user = {
  username: 'joesmith',
  firstName: 'Joe',
  lastName: 'Smith',
  locked: false,
  enabled: true,
  email: 'joe.smith@justice.gov.uk',
  lastLoggedIn: '2019-02-02T12:05:10',
}
const groupManagerUser = {
  username: 'joesmith',
  firstName: 'Joe',
  lastName: 'Smith',
  locked: false,
  enabled: true,
  email: 'joe.smith@justice.gov.uk',
  maintainAuthUsers: false,
  lastLoggedIn: '2019-02-02T12:05:10',
}
const adminUser = {
  username: 'joesmith',
  firstName: 'Joe',
  lastName: 'Smith',
  locked: false,
  enabled: true,
  email: 'joe.smith@justice.gov.uk',
  maintainAuthUsers: true,
  lastLoggedIn: '2019-02-02T12:05:10',
}

describe('Auth user display', () => {
  const stubFunc = () => {}

  describe('no roles', () => {
    const wrapper = renderer.create(
      <MemoryRouter>
        <AuthUser
          user={adminUser}
          contextUser={user}
          roleList={[]}
          groupList={[]}
          handleRoleAdd={stubFunc}
          handleRoleRemove={stubFunc}
          handleGroupAdd={stubFunc}
          handleGroupRemove={stubFunc}
          handleEnable={stubFunc}
          handleDisable={stubFunc}
        />
      </MemoryRouter>
    )
    it('should render correctly with user and no roles', () => {
      expect(wrapper.toJSON()).toMatchSnapshot()
    })

    it('should display message about no roles found', () => {
      const tableRows = wrapper.root.findAllByType(Table.Row)
      // last table row should have message
      expect(tableRows[tableRows.length - 3].props.children[0].props.children).toEqual('No roles found')
    })
  })

  describe('no groups - add groups not available for Group Manager', () => {
    const wrapper = renderer.create(
      <MemoryRouter>
        <AuthUser
          user={adminUser}
          contextUser={user}
          roleList={[]}
          groupList={[]}
          handleRoleAdd={stubFunc}
          handleRoleRemove={stubFunc}
          handleEnable={stubFunc}
          handleDisable={stubFunc}
          handleGroupAdd={stubFunc}
          handleGroupRemove={stubFunc}
        />
      </MemoryRouter>
    )
    it('should render correctly with user and no groups', () => {
      expect(wrapper.toJSON()).toMatchSnapshot()
    })

    it('should display message about no groups found', () => {
      const tableRows = wrapper.root.findAllByType(Table.Row)
      // last table row should have message
      expect(tableRows[tableRows.length - 1].props.children[0].props.children).toEqual('No groups found')
    })
  })

  describe('no groups - add groups available for admin user', () => {
    const wrapper = renderer.create(
      <MemoryRouter>
        <AuthUser
          user={adminUser}
          contextUser={user}
          roleList={[]}
          groupList={[]}
          handleRoleAdd={stubFunc}
          handleRoleRemove={stubFunc}
          handleGroupAdd={stubFunc}
          handleGroupRemove={stubFunc}
          handleEnable={stubFunc}
          handleDisable={stubFunc}
        />
      </MemoryRouter>
    )
    it('should render correctly with user and no groups', () => {
      expect(wrapper.toJSON()).toMatchSnapshot()
    })

    it('should display message about no groups found', () => {
      const tableRows = wrapper.root.findAllByType(Table.Row)
      // last table row should have message
      expect(tableRows[tableRows.length - 1].props.children[0].props.children).toEqual('No groups found')
    })
  })

  it('should render correctly with user roles and groups - add groups not available for Group Manager', () => {
    const verifiedUser = { verified: true, ...user }
    const wrapper = renderer.create(
      <MemoryRouter>
        <AuthUser
          user={groupManagerUser}
          contextUser={verifiedUser}
          roleList={[{ roleCode: 'roleA', roleName: 'Role A' }, { roleCode: 'roleB', roleName: 'Role B' }]}
          groupList={[{ groupCode: 'group1', groupName: 'Group 1' }, { groupCode: 'group2', groupName: 'Group 2' }]}
          handleRoleAdd={stubFunc}
          handleRoleRemove={stubFunc}
          handleEnable={stubFunc}
          handleDisable={stubFunc}
          handleGroupAdd={stubFunc}
          handleGroupRemove={stubFunc}
        />
      </MemoryRouter>
    )

    expect(wrapper.toJSON()).toMatchSnapshot()
  })

  it('should render correctly with user roles and groups - add groups available for admin user', () => {
    const verifiedUser = { verified: true, ...user }
    const wrapper = renderer.create(
      <MemoryRouter>
        <AuthUser
          user={adminUser}
          contextUser={verifiedUser}
          roleList={[{ roleCode: 'roleA', roleName: 'Role A' }, { roleCode: 'roleB', roleName: 'Role B' }]}
          groupList={[{ groupCode: 'group1', groupName: 'Group 1' }, { groupCode: 'group2', groupName: 'Group 2' }]}
          handleRoleAdd={stubFunc}
          handleRoleRemove={stubFunc}
          handleGroupAdd={stubFunc}
          handleGroupRemove={stubFunc}
          handleEnable={stubFunc}
          handleDisable={stubFunc}
        />
      </MemoryRouter>
    )

    expect(wrapper.toJSON()).toMatchSnapshot()
  })
})
