import React from 'react'
import { shallow } from 'enzyme'
import { AddRole } from '../MaintainRoles/components/AddRole'

const user = {
  staffId: 485576,
  username: 'user',
  firstName: 'CHARLIE',
  lastName: 'BARTLET',
  lockedFlag: false,
  expiredFlag: false,
}

describe('User search component', () => {
  it('should render the initial view of the add role page with a filtered list of roles', async () => {
    const component = shallow(
      <AddRole
        contextUser={user}
        roleList={[{ roleCode: 'ROLE_1', roleName: 'Role 1' }]}
        roleFilterList={[{ roleCode: 'ROLE_1', roleName: 'Role 1' }, { roleCode: 'ROLE_2', roleName: 'Role 2' }]}
        handleRoleFilterChange={jest.fn()}
        agencyId="LEI"
        handleCancel={jest.fn()}
        handleAdd={jest.fn()}
      />
    )
    expect(component.find('#add-button').text()).toEqual('Add role')
    expect(component.find('#cancel-button').length).toEqual(1)
    expect(component.find('#role-select').find('option').length).toEqual(2) // there is also a '-- select--' option
  })

  it('should handle updates', async () => {
    const handleCancelMock = jest.fn()
    const handleAddMock = jest.fn()
    const component = shallow(
      <AddRole
        contextUser={user}
        roleList={[{ roleCode: 'ROLE_1', roleName: 'Role 1' }, { roleCode: 'ROLE_2', roleName: 'Role 2' }]}
        roleFilterList={[
          { roleCode: 'ROLE_1', roleName: 'Role 1' },
          { roleCode: 'ROLE_2', roleName: 'Role 2' },
          { roleCode: 'ROLE_3', roleName: 'Role 3' },
        ]}
        agencyId="LEI"
        handleRoleFilterChange={jest.fn()}
        handleCancel={handleCancelMock}
        handleAdd={handleAddMock}
      />
    )
    component.find('#add-button').simulate('click')
    expect(handleAddMock).toHaveBeenCalled()
    component.find('#cancel-button').simulate('click')
    expect(handleCancelMock).toHaveBeenCalled()
  })

  it('should display message if no roles to allocate', async () => {
    const component = shallow(
      <AddRole
        contextUser={user}
        roleList={[{ roleCode: 'ROLE_1', roleName: 'Role 1' }, { roleCode: 'ROLE_2', roleName: 'Role 2' }]}
        roleFilterList={[{ roleCode: 'ROLE_1', roleName: 'Role 1' }, { roleCode: 'ROLE_2', roleName: 'Role 2' }]}
        agencyId="LEI"
        handleRoleFilterChange={jest.fn()}
        handleCancel={jest.fn()}
        handleAdd={jest.fn()}
      />
    )
    expect(component.find('#add-button').length).toEqual(0)
    expect(component.text()).toContain('No roles available')
  })
})
