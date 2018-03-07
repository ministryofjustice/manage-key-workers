import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import AssignTransfer from "../index";

Enzyme.configure({ adapter: new Adapter() });


describe('Assign transfer component', () => {
  it('should render component correctly', async () => {
    const component = shallow(<AssignTransfer />);
    expect(component.find('div').at(1).text()).toContain('Search for an offender');
  });
});

describe('AssignTransferContainer component', () => {
  // todo
});
