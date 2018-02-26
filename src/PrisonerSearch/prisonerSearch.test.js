import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import PrisonerSearch from "./index";

Enzyme.configure({ adapter: new Adapter() });


describe('Prisoner search component', () => {
  it('should render prisoner search form correctly', async () => {
    const component = shallow(<PrisonerSearch />);
    console.log(component.debug());
    expect(component.find('#search-text').length).toBe(1);
    expect(component.find('#housing-location-select').length).toBe(1);
    expect(component.find('#allocation-status-select').length).toBe(1);
  });
});
