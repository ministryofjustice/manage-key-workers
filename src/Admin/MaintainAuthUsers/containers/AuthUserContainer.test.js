import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { MemoryRouter } from 'react-router-dom'
import { mount } from 'enzyme'

import ConnectedAuthUserContainer, { AuthUserContainer } from './AuthUserContainer'
import mockHistory from '../../../test/mockHistory'
import mockMatch from '../../../test/mockMatch'

const mockStore = configureMockStore([thunk])

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
      const store = mockStore({
        app: { error: '', loaded: true, message: '' },
        maintainAuthUsers: { contextUser: {} },
      })

      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter>
            <ConnectedAuthUserContainer />
          </MemoryRouter>
        </Provider>
      )
      expect(wrapper.contains(<div>User not found</div>)).toBe(true)
    })

    it('should render correctly with a user', () => {
      const store = mockStore({
        app: { error: '', loaded: true, message: '' },
        maintainAuthUsers: { contextUser: user },
      })

      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter>
            <ConnectedAuthUserContainer />
          </MemoryRouter>
        </Provider>
      )
      expect(wrapper.find('Page').props().title).toEqual('Auth User: Joe Smith')
    })
  })

  describe('handle functions', () => {
    const event = { target: { name: 'user', value: 'usersearched' }, preventDefault: jest.fn() }
    const roleList = [{ roleCode: 'roleA', roleName: 'Role A' }, { roleCode: 'roleB', roleName: 'Role B' }]
    const store = mockStore({ app: { error: '', loaded: true, message: '' } })
    const removeAuthRoleDispatch = jest.fn()
    const loadAuthUserAndRolesDispatch = jest.fn()

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <AuthUserContainer
            removeAuthRoleDispatch={removeAuthRoleDispatch}
            loadAuthUserAndRolesDispatch={loadAuthUserAndRolesDispatch}
            contextUser={user}
            roleList={roleList}
            error=""
            message=""
            match={mockMatch({ username: 'joebook' })}
            history={mockHistory}
          />
        </MemoryRouter>
      </Provider>
    )

    it('should call axios to remove role when remove button clicked', () => {
      wrapper.find('#remove-button-roleA button').simulate('click')

      expect(removeAuthRoleDispatch).toBeCalledWith('roleA')
    })

    it('should prevent default on the form submission', () => {
      wrapper.find('#remove-button-roleA button').simulate('click', event)

      expect(event.preventDefault).toBeCalled()
    })
  })
})
