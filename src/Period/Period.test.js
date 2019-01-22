import React from 'react'
import { shallow } from 'enzyme'
import Period from './Period'

describe('<Period />', () => {
  const props = {
    onButtonClick: jest.fn(),
    onInputChange: jest.fn(),
    fromDate: '2018-12-01',
    toDate: '2018-12-31',
  }

  it('renders without crashing', () => {
    shallow(<Period {...props} />)
  })

  it('should render the default from date in the correct format', () => {
    const wrapper = shallow(<Period {...props} />)
    const fromDate = wrapper.findWhere(node => node.props().inputId === 'keyWorkerStatsFromDate')

    expect(fromDate.prop('defaultValue')).toEqual('01/12/2018')
  })

  it('should render the default to date in the correct format', () => {
    const wrapper = shallow(<Period {...props} />)
    const toDateInput = wrapper.findWhere(node => node.props().inputId === 'keyWorkerStatsToDate')

    expect(toDateInput.prop('defaultValue')).toEqual('31/12/2018')
  })
})
