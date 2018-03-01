import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import KeyworkerSearchPage from "../components/KeyworkerSearchPage";

Enzyme.configure({ adapter: new Adapter() });


describe('Keyworker search page component', () => {
  it('should render component correctly', async () => {
    const component = shallow(<KeyworkerSearchPage handleSearchTextChange={jest.fn()} handleSearch={jest.fn()}/>);
    expect(component.text()).toContain('Search for a key worker');
  });
});

describe('KeyworkerProfileContainer component', () => {
  // todo
});
