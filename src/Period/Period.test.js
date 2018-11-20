import React from 'react'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'
import Period from './Period'

describe('<Period />', () => {
  it('renders without crashing', () => {
    shallow(<Period onButtonClick={jest.fn()} defaultDuration={4} defaultPeriod="week" />)
  })
  it('should render the default duration and period', () => {
    const tree = renderer.create(<Period onButtonClick={jest.fn()} defaultDuration={4} defaultPeriod="week" />)
    expect(tree).toMatchSnapshot()
  })
})
