import React from 'react';
import { shallow } from 'enzyme';
import HomePage from "./index";

describe('HomePage component', () => {
  it('should render links correctly', async () => {
    const user = {
      writeAccess: true
    };
    const component = shallow(<HomePage message="Hello!" config={{}} clearMessage={jest.fn()} user={user} allowAuto/>);
    expect(component.find('#auto_allocate_link').length).toBe(1);
    expect(component.find('#keyworker_profile_link').length).toBe(1);
    expect(component.find('#assign_transfer_link').length).toBe(1);
  });
  it('should hide the auto allocate link when user does not have write access', () => {
    const component = shallow(
      <HomePage
        message="Hello!"
        clearMessage={jest.fn()}
        config={{}}
        user={{}}
      />);
    expect(component.find('#auto_allocate_link').length).toBe(0);
  });
  it('should show the auto allocate link when allow autoallocate (keyworker settings) is true and user has writeAccess', () => {
    const user = {
      writeAccess: true
    };
    const component = shallow(
      <HomePage
        message="Hello!"
        clearMessage={jest.fn()}
        user={user}
        allowAuto
        config={{}}
      />);
    expect(component.find('#auto_allocate_link').length).toBe(1);
  });
  it('should hide the auto allocate link when allow autoallocate (keyworker settings) is false and user has writeAccess', () => {
    const user = {
      writeAccess: true
    };
    const component = shallow(
      <HomePage
        message="Hello!"
        clearMessage={jest.fn()}
        user={user}
        allowAuto={false}
        config={{}}
      />);
    expect(component.find('#auto_allocate_link').length).toBe(0);
  });
  it('should hide the maintain roles link when feature toggle off', () => {
    const user = {
      writeAccess: true,
      maintainAccess: true
    };
    const config = {
      maintainRolesEnabled: false
    };
    const component = shallow(
      <HomePage
        message="Hello!"
        clearMessage={jest.fn()}
        user={user}
        allowAuto={false}
        config={config}
      />);
    expect(component.find('#maintain_roles_link').length).toBe(0);
  });
  it('should show the maintain roles link when feature toggle on (and correct role exists for user)', () => {
    const user = {
      writeAccess: true,
      maintainAccess: true
    };
    const config = {
      maintainRolesEnabled: "true"
    };
    const component = shallow(
      <HomePage
        message="Hello!"
        clearMessage={jest.fn()}
        user={user}
        allowAuto={false}
        config={config}
      />);
    expect(component.find('#maintain_roles_link').length).toBe(1);
  });
});
