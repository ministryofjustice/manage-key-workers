import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { OffenderSearch } from "../components/OffenderSearch";

Enzyme.configure({ adapter: new Adapter() });


describe('Offender search component', () => {
  it('should render offender search form correctly', async () => {
    const component = shallow(<OffenderSearch handleSearchTextChange ={() => {}} handleSearchHousingLocationChange={() => {}}
      history ={{}} />);
    //console.log(component.debug());
    expect(component.find('#search-text').length).toBe(1);
    expect(component.find('#housing-location-select').length).toBe(1);
  });
});
