import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import KeyworkerSearchResult from "../components/KeyworkerSearchResults";

Enzyme.configure({ adapter: new Adapter() });

const getTestData = function () {
  const list = [
    {
      staffId: 2,
      firstName: 'Brent',
      lastName: 'Daggart',
      numberAllocated: 3,
      status: "active",
      currentRole: "Key worker2"
    },
    {
      staffId: 1,
      firstName: 'Amy',
      lastName: 'Hanson',
      numberAllocated: 4,
      status: "active",
      currentRole: "Key worker"
    },
    {
      staffId: 3,
      firstName: 'Florence',
      lastName: 'Welch',
      numberAllocated: 1,
      status: "active",
      currentRole: "Key worker3"
    }
  ];
  return list;
};

describe('Keyworker search result component', () => {
  it('should render component correctly', async () => {
    const list = getTestData();
    const component = shallow(<KeyworkerSearchResult keyworkerList={list} handleSearchTextChange={jest.fn()} gotoNext={jest.fn()}/>);
    expect(component.find('tr').length).toEqual(4); // includes header tr
    expect(component.find('tr').at(1).find('td').at(0).text()).toContain('Link');
    expect(component.find('tr').at(1).find('td').at(1).text()).toEqual('3');
  });
});


