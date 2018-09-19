import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import HomePage from "./index";

Enzyme.configure({ adapter: new Adapter() });


describe('HomePage component', () => {
  it('should render links correctly', async () => {
    const user = {
      writeAccess: true
    };
    const component = shallow(<HomePage message="Hello!" clearMessage={jest.fn()} user={user} allowAuto/>);
    expect(component.find('#auto_allocate_link').length).toBe(1);
    expect(component.find('#keyworker_profile_link').length).toBe(1);
    expect(component.find('#assign_transfer_link').length).toBe(1);
  });
  it('should hide the auto allocate link when user does not have write access', () => {
    const component = shallow(
      <HomePage
        message="Hello!"
        clearMessage={jest.fn()}
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
      />);
    expect(component.find('#auto_allocate_link').length).toBe(0);
  });
});
