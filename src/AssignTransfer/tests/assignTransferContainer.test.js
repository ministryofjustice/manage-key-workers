import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { AssignTransferContainer } from "../AssignTransferContainer";
import jsdom from 'jsdom';

jest.mock('../../Spinner/index', () => '');

const doc = jsdom.jsdom('<!doctype html><html><body></body></html>');
global.document = doc;
global.window = doc.defaultView;
Enzyme.configure({ adapter: new Adapter() });

describe('AssignTransferContainer', () => {
  it('should render initial Search correctly', async () => {
    const component = shallow(<AssignTransferContainer initialSearch displayBack={jest.fn()} setErrorDispatch={() => {}}/>);
    expect(component.find('div').at(1).text()).toContain('Search for an offender');
  });

  it('should render results correctly', async () => {
    const component = shallow(<AssignTransferContainer setErrorDispatch={() => {}}/>);
    const connect = component.find('Connect');
    expect(connect.text()).toContain('OffenderResultsContainer');
  });
});
