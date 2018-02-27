import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import KeyworkerSearch from "./index";

Enzyme.configure({ adapter: new Adapter() });


describe('Keyworker search component', () => {
  it('should render key worker search form correctly', async () => {
    const component = shallow(<KeyworkerSearch handleSearchTextChange={jest.fn()} gotoNext={jest.fn()}/>);
    expect(component.find('#search-text').length).toBe(1);
    expect(component.find('button').length).toBe(1);
  });

  it('should handle click correctly', async () => {
    let searchCallBack = jest.fn();

    const component = shallow(<KeyworkerSearch handleSearchTextChange={jest.fn()} gotoNext={searchCallBack}/>);

    component.find('button').simulate('click');
    expect(searchCallBack.mock.calls.length).toEqual(1);
  });

  it('should search text entry correctly', async () => {
    let searchTextCallBack = jest.fn();

    const component = shallow(<KeyworkerSearch handleSearchTextChange={searchTextCallBack} gotoNext={jest.fn()}/>);

    component.find('input').simulate('change', { target: { value: 'Hello' } });
    expect(searchTextCallBack.mock.calls.length).toEqual(1);
  });
});
