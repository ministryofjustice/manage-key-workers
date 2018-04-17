import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import HomePage from "./index";

Enzyme.configure({ adapter: new Adapter() });


describe('HomePage component', () => {
  it('should render links correctly', async () => {
    const component = shallow(<HomePage message="Hello!" clearMessage={jest.fn()}/>);
    expect(component.find('#auto_allocate_link').length).toBe(1);
    expect(component.find('#keyworker_profile_link').length).toBe(1);
    expect(component.find('#assign_transfer_link').length).toBe(1);
  });
});
