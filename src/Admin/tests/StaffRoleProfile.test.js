import React from 'react';
import { shallow } from 'enzyme';
import { StaffRoleProfile } from "../MaintainRoles/components/StaffRoleProfile";

const user = {
  staffId: 485576,
  username: "user",
  firstName: "CHARLIE",
  lastName: "BARTLET",
  lockedFlag: false,
  expiredFlag: false
};
const ROLE_DESCRIPTION_COLUMN = 0;

describe('Staff role profile component', () => {
  it('should render the initial view of the Staff role profile', async () => {
    const component = shallow(<StaffRoleProfile user={user}
      contextUser={user}
      roleList={[{ roleCode: 'ROLE_1', roleName: 'Role 1' }, { roleCode: 'ROLE_2', roleName: 'Role 2' }]}
      agencyId={'LEI'}
      displayBack={jest.fn()}
      handleRemove={jest.fn()}
      handleAdd={jest.fn()}/>);
    expect(component.find('#add-button').text()).toEqual("Add role");
    expect(component.find('.removeButton').length).toEqual(2);
    expect(component.find('tr').at(1).find('td').at(ROLE_DESCRIPTION_COLUMN).text()).toEqual('Role 1');
  });

  it('should handle updates', async () => {
    const handleRemoveMock = jest.fn();
    const handleAddMock = jest.fn();
    const component = shallow(<StaffRoleProfile user={user}
      contextUser={user}
      roleList={[{ roleCode: 'ROLE_1', roleName: 'Role 1' }, { roleCode: 'ROLE_2', roleName: 'Role 2' }]}
      agencyId={'LEI'}
      displayBack={jest.fn()}
      handleRemove={handleRemoveMock}
      handleAdd={handleAddMock}/>);
    component.find('#add-button').simulate('click');
    expect(handleAddMock).toHaveBeenCalled();
    component.find('#remove-button-ROLE_2').simulate('click');
    expect(handleRemoveMock).toHaveBeenCalled();
  });
});


