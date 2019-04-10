import React from 'react'
import { shallow } from 'enzyme'
import { UserSearch } from './UserSearch'
import mockHistory from '../../../test/mockHistory'

const user = {
  activeCaseLoadId: 'LEI',
  caseLoadOptions: [{ caseLoadId: 'LEI', description: 'LEEDS (HMP)', type: 'INST', caseloadFunction: 'GENERAL' }],
}

describe('User search component', () => {
  it('should render the initial view of User search', async () => {
    const component = shallow(
      <UserSearch
        user={user}
        nameFilter=""
        roleFilter=""
        roleFilterList={[
          { roleCode: 'ROLE_1', roleName: 'Role 1', roleFunction: '', roleId: 1 },
          { roleCode: 'ROLE_2', roleName: 'Role 2', roleFunction: '', roleId: 2 },
        ]}
        agencyId="LEI"
        nameFilterDispatch={jest.fn()}
        displayBack={jest.fn()}
        handleAllowAutoChange={jest.fn()}
        roleFilterDispatch={jest.fn()}
        roleFilterListDispatch={jest.fn()}
        handleRoleFilterChange={jest.fn()}
        handleNameFilterChange={jest.fn()}
        handleSearch={jest.fn()}
        history={mockHistory}
      />
    )
    expect(component.find('#search-button').text()).toEqual('Search')
  })

  it('should handle updates', async () => {
    const handleSubmitMock = jest.fn()
    const handleNameFilterMock = jest.fn()
    const handleRoleSelectMock = jest.fn()
    const component = shallow(
      <UserSearch
        user={user}
        nameFilter=""
        roleFilter=""
        agencyId="LEI"
        nameFilterDispatch={jest.fn()}
        displayBack={jest.fn()}
        handleAllowAutoChange={jest.fn()}
        roleFilterDispatch={jest.fn()}
        roleFilterListDispatch={jest.fn()}
        handleRoleFilterChange={handleRoleSelectMock}
        handleNameFilterChange={handleNameFilterMock}
        handleSearch={handleSubmitMock}
        history={mockHistory}
        roleFilterList={[]}
      />
    )
    component.find('form').simulate('submit')
    expect(handleSubmitMock).toHaveBeenCalled()
    component.find('#name-filter').simulate('change', { target: { value: 'Hello' } })
    expect(handleNameFilterMock).toHaveBeenCalled()
    component.find('#role-select').simulate('change', { target: { value: 'ROLE_2' } })
    expect(handleRoleSelectMock).toHaveBeenCalled()
  })
})
