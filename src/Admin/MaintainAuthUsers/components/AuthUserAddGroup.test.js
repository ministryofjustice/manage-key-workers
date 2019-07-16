import React from 'react'
import renderer from 'react-test-renderer'
import Label from '@govuk-react/label'
import AuthUserAddGroup from './AuthUserAddGroup'

const groups = [
  { groupCode: 'ROLE_1', groupName: 'Group 1' },
  { groupCode: 'ROLE_2', groupName: 'Group 2' },
  { groupCode: 'ROLE_3', groupName: 'Group 3' },
]

const stubFunc = () => {}

describe('Auth user add groups', () => {
  describe('no groups', () => {
    const wrapper = renderer.create(
      <AuthUserAddGroup
        groupList={groups}
        groupFilterList={[]}
        handleGroupAddChange={stubFunc}
        handleAdd={stubFunc}
        handleCancel={stubFunc}
        error=""
      />
    )
    it('should render correctly with user and no groups', () => {
      expect(wrapper.toJSON()).toMatchSnapshot()
    })

    it('should display message about no groups to add', () => {
      const noRowsMessage = wrapper.root.findByProps({ 'data-qa': 'no-groups' })
      // last table row should have message
      expect(noRowsMessage.props.children).toEqual('No groups available')
    })
  })

  it('should render the add group page with a filtered list of groups', () => {
    const component = renderer.create(
      <AuthUserAddGroup
        groupList={[{ groupCode: 'GROUP_2', groupName: 'Group 2' }]}
        groupFilterList={groups}
        handleAdd={jest.fn()}
        handleCancel={jest.fn()}
        handleGroupAddChange={jest.fn()}
        error=""
      />
    )
    expect(component.toJSON()).toMatchSnapshot()
  })

  describe('errors', () => {
    const component = renderer.create(
      <AuthUserAddGroup
        groupList={[{ groupCode: 'GROUP_2', groupName: 'Group 2' }]}
        groupFilterList={groups}
        handleAdd={jest.fn()}
        handleCancel={jest.fn()}
        handleGroupAddChange={jest.fn()}
        error={[{ targetName: 'group', text: 'something went wrong' }]}
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
