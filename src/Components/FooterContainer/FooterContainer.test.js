import React from 'react'
import renderer from 'react-test-renderer'

import FooterContainer from '.'

const props = {
  supportUrl: '/',
  prisonStaffHubUrl: '/prisonStaffHubUrl/',
}

describe('<FooterContainer />', () => {
  it('should render correctly', () => {
    const tree = renderer.create(<FooterContainer {...props} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should render a link with the supportUrl prop', () => {
    const { root } = renderer.create(<FooterContainer {...props} />)
    const link = root.findByProps({ href: props.supportUrl })
    expect(link).toBeDefined()
    expect(link.props.children).toBe('Feedback and support')
  })

  it('should render a terms and conditions link with the prisonStaffHubUrl prop', () => {
    const { root } = renderer.create(<FooterContainer {...props} />)
    const link = root.findByProps({ href: `${props.prisonStaffHubUrl}content/terms-conditions` })
    expect(link).toBeDefined()
    expect(link.props.children).toBe('Terms and conditions')
  })
})
