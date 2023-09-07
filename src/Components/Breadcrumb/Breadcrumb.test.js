import React from 'react'
import { shallow } from 'enzyme'
import { Breadcrumb } from './Breadcrumb'

const props = {
  breadcrumbs: [
    {
      breadcrumb: {
        props: {
          children: 'Application homepage',
        },
        type: 'span',
      },
      key: '/',
      location: {
        pathname: '/test-page',
        search: '',
        hash: '',
        key: '8h5b0i',
      },
      match: {
        path: '/',
        url: '/',
        isExact: true,
        params: {},
      },
    },
    {
      breadcrumb: {
        props: {
          children: 'Test page',
        },
        type: 'span',
      },
      key: '/test-page',
      location: {
        pathname: '/test-page',
        search: '',
        hash: '',
        key: '8h5b0i',
      },
      match: {
        path: '/test-page',
        url: '/test-page',
        isExact: true,
        params: {},
      },
    },
  ],
}

describe('<Breadcrumb />', () => {
  const wrapper = shallow(<Breadcrumb {...props} />)

  it('should have the Home link as the first Breadcrumb ', () => {
    expect(wrapper.find('BreadcrumbItem').first().find('a').text()).toEqual('Digital Prison Services')
  })
})
