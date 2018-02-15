import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import MessageBar from "../MessageBar";

Enzyme.configure({ adapter: new Adapter() });


describe('ManualAllocation component', () => {
  it('should render message correctly', async () => {
    const component = shallow(<MessageBar message="Hello!"/>);
    expect(component.find('div').at(1).text()).toEqual('Hello!');
  });

  it('should not render message bar if no message provided', async () => {
    const component = shallow(<MessageBar message=""/>);
    expect(component.find('div').exists()).toEqual(false);
  });
});
