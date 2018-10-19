import React from 'react';
import { shallow } from 'enzyme';
import { KeyworkerSearchPage } from "../components/KeyworkerSearchPage";

describe('Keyworker search component', () => {
  it('should render key worker search form correctly', async () => {
    const component = shallow(<KeyworkerSearchPage handleSearchTextChange={jest.fn()} handleStatusFilterChange={jest.fn()} handleSearch={jest.fn()} displayBack={jest.fn()}/>);
    expect(component.find('#search-text').length).toBe(1);
    expect(component.find('Status').shallow().find('#status-select').length).toBe(1);
    expect(component.find('button').length).toBe(1);
  });

  it('should handle click correctly', async () => {
    const searchCallBack = jest.fn();

    const component = shallow(<KeyworkerSearchPage handleSearchTextChange={jest.fn()} handleStatusFilterChange={jest.fn()} handleSearch={searchCallBack} displayBack={jest.fn()}/>);

    component.find('button').simulate('click');
    expect(searchCallBack.mock.calls.length).toEqual(1);
  });

  it('should search text entry correctly', async () => {
    const searchTextCallBack = jest.fn();

    const component = shallow(<KeyworkerSearchPage handleSearchTextChange={searchTextCallBack} handleStatusFilterChange={jest.fn()} handleSearch={jest.fn()} displayBack={jest.fn()}/>);

    component.find('input').simulate('change', { target: { value: 'Hello' } });
    expect(searchTextCallBack.mock.calls.length).toEqual(1);
    expect(searchTextCallBack.mock.calls[0][0]).toEqual({ target: { value: 'Hello' } });
  });

  it('should handle status select correctly', async () => {
    const callBack = jest.fn();

    const component = shallow(<KeyworkerSearchPage handleSearchTextChange={jest.fn()} handleStatusFilterChange={callBack} handleSearch={jest.fn()} displayBack={jest.fn()}/>);

    const statusSelect = component.find('Status').shallow();
    statusSelect.find('select').simulate('change', { target: { value: 'INACTIVE' } });
    expect(callBack.mock.calls.length).toEqual(1);
    expect(callBack.mock.calls[0][0]).toEqual({ target: { value: "INACTIVE" } });
  });
});
