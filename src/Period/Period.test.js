import React from 'react'
import { mount } from 'enzyme'
import Period from './Period'

describe('<Period />', () => {
  const props = {
    onButtonClick: jest.fn(),
    onInputChange: jest.fn(),
    onSubmit: jest.fn(),
    fromDate: '2018-12-01',
    toDate: '2018-12-31',
  }

  const wrapper = mount(<Period {...props} />)

  it('should render the default from date in the correct format', () => {
    const fromDate = wrapper.find('Date').first()

    expect(fromDate.prop('value')).toEqual('01/12/2018')
  })

  it('should render the default to date in the correct format', () => {
    const toDate = wrapper.find('Date').last()

    expect(toDate.prop('value')).toEqual('31/12/2018')
  })

  it('should call the onSubmit prop with correct date values', () => {
    wrapper.find('form').simulate('submit')

    expect(props.onSubmit).toBeCalledWith(
      { fromDate: '01/12/2018', toDate: '31/12/2018' },
      expect.any(Object),
      expect.any(Function)
    )
  })
})
