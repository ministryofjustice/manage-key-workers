import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { OffenderSearch } from "../components/OffenderSearch";

Enzyme.configure({ adapter: new Adapter() });

const housingLocations = [{ id: 123, description: "block 1" }, { id: 223, description: "block 2" }];


describe('Offender search component', () => {
  it('should render initial offender search form correctly', async () => {
    const component = shallow(<OffenderSearch initialSearch locations={housingLocations}
      handleSearchTextChange ={() => {}} handleSearchHousingLocationChange={() => {}}
      history ={{}} />);

    expect(component.find('#search-text').length).toBe(1);
    expect(component.find('#housing-location-select').length).toBe(1);
  });

  it('should render results offender search form correctly', async () => {
    const component = shallow(<OffenderSearch locations={housingLocations}
      handleSearchTextChange ={() => {}} handleSearchHousingLocationChange={() => {}}
      history ={{}} />);
    //console.log(component.debug());
    expect(component.find('#search-text').length).toBe(1);
    expect(component.find('#housing-location-select').length).toBe(1);
  });

  it('should handle results submit form correctly', async () => {
    const handleSubmitMock = jest.fn();
    const component = shallow(<OffenderSearch locations={housingLocations}
      handleSearchTextChange ={() => {}}
      handleSearchHousingLocationChange={() => {}}
      setValidationErrorDispatch={() => {}}
      handleSubmit ={handleSubmitMock} history ={{}}/>);

    component.find('button').simulate('click');
    expect(handleSubmitMock).toHaveBeenCalled();
  });
});
