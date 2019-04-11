import React from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { mount } from 'enzyme'
import axios from 'axios'

import AuthUserContainer from './AuthUserContainer'

const user = {
  username: 'joesmith',
  firstName: 'Joe',
  lastName: 'Smith',
  locked: false,
  enabled: true,
  email: 'joe.smith@justice.gov.uk',
}

describe('Auth user container', () => {
  describe('rendering', () => {
    it('should render correctly without user', () => {
      const store = { subscribe: jest.fn(), dispatch: jest.fn(), getState: jest.fn(), setState: jest.fn() }
      const state = {
        app: { error: '', loaded: true, message: '' },
        maintainAuthUsers: { contextUser: {} },
      }
      store.getState.mockReturnValue(state)

      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter>
            <AuthUserContainer handleError={jest.fn()} />
          </MemoryRouter>
        </Provider>
      )
      expect(wrapper.contains(<div>User not found</div>)).toBe(true)
    })

    it('should render correctly with a user', () => {
      const store = { subscribe: jest.fn(), dispatch: jest.fn(), getState: jest.fn(), setState: jest.fn() }
      const state = {
        app: { error: '', loaded: true, message: '' },
        maintainAuthUsers: { contextUser: user },
      }
      store.getState.mockReturnValue(state)

      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter>
            <AuthUserContainer handleError={jest.fn()} />
          </MemoryRouter>
        </Provider>
      )
      expect(wrapper.find('Page').props().title).toEqual('Auth User: Joe Smith')
    })
  })

  describe('handle functions', () => {
    const event = { target: { name: 'user', value: 'usersearched' }, preventDefault: jest.fn() }
    const store = { subscribe: jest.fn(), dispatch: jest.fn(), getState: jest.fn(), setState: jest.fn() }
    const state = {
      app: { error: '', loaded: true, message: '' },
      maintainAuthUsers: {
        contextUser: user,
        roleList: [{ roleCode: 'roleA', roleName: 'Role A' }, { roleCode: 'roleB', roleName: 'Role B' }],
      },
    }
    store.getState.mockReturnValue(state)

    const mockAxios = jest.fn()
    axios.get = mockAxios

    mockAxios.mockImplementationOnce(() => Promise.resolve({ status: 200, data: {}, config: {} }))

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <AuthUserContainer handleError={jest.fn()} />
        </MemoryRouter>
      </Provider>
    )

    it('should call axios to remove role when remove button clicked', () => {
      wrapper.find('#remove-button-roleA button').simulate('click')

      expect(mockAxios).toBeCalledWith('/api/auth-user-roles-remove', {
        params: { role: 'roleA', username: 'joesmith' },
      })
    })

    it('should prevent default on the form submission', () => {
      wrapper.find('#remove-button-roleA button').simulate('click', event)

      expect(event.preventDefault).toBeCalled()
    })
  })
})
