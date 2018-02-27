import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import KeyworkerProfile from "./index";

Enzyme.configure({ adapter: new Adapter() });


describe('KeyworkerProfile component', () => {
  it('should render component correctly', async () => {
    const component = shallow(<KeyworkerProfile handleSearchTextChange={jest.fn()} gotoNext={jest.fn()}/>);
    expect(component.find('KeyworkerSearch').exists()).toEqual(true);
    expect(component.find('div').at(1).text()).toContain('Search for a key worker');
  });
});

describe('KeyworkerProfileContainer component', () => {
  // todo
});
