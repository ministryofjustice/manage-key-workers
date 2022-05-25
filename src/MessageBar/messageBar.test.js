import React from 'react'
import { shallow } from 'enzyme'
import MessageBar from '.'

describe('ManualAllocation component', () => {
  it('should render message correctly', async () => {
    const component = shallow(<MessageBar message="Updated" clearMessage={jest.fn()} />)
    expect(component.find('div').at(2).text()).toEqual('Updated')
  })

  it('should clear message after displayTime expires', (done) => {
    const clearMessageMock = jest.fn()
    shallow(<MessageBar message="Hello!" displayTime={100} clearMessage={clearMessageMock} />)
    setTimeout(() => {
      expect(clearMessageMock.mock.calls.length).toBe(1)
      done()
    }, 200)
  })

  it('should not render message bar if no message provided', async () => {
    const component = shallow(<MessageBar message="" clearMessage={jest.fn()} />)
    expect(component.find('div').exists()).toEqual(false)
  })
})
