import React from 'react'
import renderer from 'react-test-renderer'

import AuthUserBreadcrumb from './AuthUserBreadcrumb'

describe('Auth user breadcrumb', () => {
  it('should render correctly retrieving user from state', () => {
    const store = { subscribe: jest.fn(), dispatch: jest.fn(), getState: jest.fn(), setState: jest.fn() }
    store.getState.mockReturnValue({
      app: { error: '', loaded: true },
      maintainAuthUsers: { contextUser: { firstName: 'Bob', lastName: 'Smith', username: 'bobsmith' } },
    })

    const wrapper = renderer.create(<AuthUserBreadcrumb store={store} />).toJSON()
    expect(wrapper).toEqual('Bob Smith')
  })

  it('should fallback to default when user not in state', () => {
    const store = { subscribe: jest.fn(), dispatch: jest.fn(), getState: jest.fn(), setState: jest.fn() }
    store.getState.mockReturnValue({
      app: { error: '', loaded: true },
      maintainAuthUsers: {},
    })

    const wrapper = renderer
      .create(<AuthUserBreadcrumb store={store} match={{ params: { username: 'bobthebuilder' } }} />)
      .toJSON()
    expect(wrapper).toEqual('bobthebuilder')
  })

  it('should fallback to default when contextUser set to default', () => {
    const store = { subscribe: jest.fn(), dispatch: jest.fn(), getState: jest.fn(), setState: jest.fn() }
    store.getState.mockReturnValue({
      app: { error: '', loaded: true },
      maintainAuthUsers: { contextUser: {} },
    })

    const wrapper = renderer
      .create(<AuthUserBreadcrumb store={store} match={{ params: { username: 'bobthebuilder' } }} />)
      .toJSON()
    expect(wrapper).toEqual('bobthebuilder')
  })
})
