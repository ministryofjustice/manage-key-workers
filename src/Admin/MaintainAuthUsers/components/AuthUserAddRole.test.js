import React from 'react'
import renderer from 'react-test-renderer'
import Label from '@govuk-react/label'
import AuthUserAddRole from './AuthUserAddRole'

const roles = [
  { roleCode: 'ROLE_1', roleName: 'Role 1' },
  { roleCode: 'ROLE_2', roleName: 'Role 2' },
  { roleCode: 'ROLE_3', roleName: 'Role 3' },
]

const stubFunc = () => {}

describe('Auth user add roles', () => {
  describe('no roles', () => {
    const wrapper = renderer.create(
      <AuthUserAddRole
        roleList={roles}
        roleFilterList={[]}
        handleRoleAddChange={stubFunc}
        handleAdd={stubFunc}
        handleCancel={stubFunc}
        error=""
      />
    )
    it('should render correctly with user and no roles', () => {
      expect(wrapper.toJSON()).toMatchSnapshot()
    })

    it('should display message about no roles to add', () => {
      const noRowsMessage = wrapper.root.findByProps({ 'data-qa': 'no-roles' })
      // last table row should have message
      expect(noRowsMessage.props.children).toEqual('No roles available')
    })
  })

  it('should render the add role page with a filtered list of roles', () => {
    const component = renderer.create(
      <AuthUserAddRole
        roleList={[{ roleCode: 'ROLE_2', roleName: 'Role 2' }]}
        roleFilterList={roles}
        handleAdd={jest.fn()}
        handleCancel={jest.fn()}
        handleRoleAddChange={jest.fn()}
        error=""
      />
    )
    expect(component.toJSON()).toMatchSnapshot()
  })

  describe('errors', () => {
    const component = renderer.create(
      <AuthUserAddRole
        roleList={[{ roleCode: 'ROLE_2', roleName: 'Role 2' }]}
        roleFilterList={roles}
        handleAdd={jest.fn()}
        handleCancel={jest.fn()}
        handleRoleAddChange={jest.fn()}
        error={[{ targetName: 'role', text: 'something went wrong' }]}
      />
    )
    it('should render an error on the select if error occurred', () => {
      expect(component.toJSON()).toMatchSnapshot()
    })
    it('should display error', () => {
      expect(component.root.findByType(Label).props.error).toEqual('something went wrong')
    })
  })
})
