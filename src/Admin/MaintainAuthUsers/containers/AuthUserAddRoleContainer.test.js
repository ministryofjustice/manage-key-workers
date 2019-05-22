import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { MemoryRouter } from 'react-router-dom'
import { mount } from 'enzyme'
import axios from 'axios'

import ConnectedAuthUserAddRoleContainer, { AuthUserAddRoleContainer } from './AuthUserAddRoleContainer'
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
const roles = [
  { roleCode: 'ROLE_1', roleName: 'Role 1' },
  { roleCode: 'ROLE_2', roleName: 'Role 2' },
  { roleCode: 'ROLE_3', roleName: 'Role 3' },
]

describe('Auth user add role container', async () => {
  describe('rendering', () => {
    it('should render correctly without user', () => {
      const store = mockStore({
        app: { error: '', loaded: true, message: '' },
        maintainAuthUsers: { contextUser: {}, roleList: [] },
      })

      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter>
            <ConnectedAuthUserAddRoleContainer />
          </MemoryRouter>
        </Provider>
      )
      expect(wrapper.contains(<div>User not found</div>)).toBe(true)
    })

    it('should render correctly with a user but no roles', () => {
      const store = mockStore({
        app: { error: '', loaded: true, message: '' },
        maintainAuthUsers: { contextUser: user, roleList: [] },
      })

      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter>
            <ConnectedAuthUserAddRoleContainer />
          </MemoryRouter>
        </Provider>
      )
      expect(wrapper.contains(<div>User not found</div>)).toBe(true)
    })

    it('should render correctly with a user and roles', async () => {
      const store = mockStore({
        app: { error: '', loaded: true, message: '' },
        maintainAuthUsers: { contextUser: user, roleList: [] },
      })

      axios.get = jest.fn()
      axios.get.mockImplementation(() => Promise.resolve({ status: 200, data: roles, config: {} }))

      const wrapper = await mount(
        <Provider store={store}>
          <MemoryRouter>
            <ConnectedAuthUserAddRoleContainer />
          </MemoryRouter>
        </Provider>
      )
      await wrapper.update()
      expect(wrapper.find('Page').props().title).toEqual('Add role: Joe Smith')
    })
  })

  describe('handle functions', async () => {
    const event = { target: { name: 'role', value: 'ROLE_1' }, preventDefault: jest.fn() }
    const roleList = [{ roleCode: 'roleA', roleName: 'Role A' }, { roleCode: 'roleB', roleName: 'Role B' }]
    const store = mockStore({ app: { error: '', loaded: true, message: '' } })

    let dispatchFns
    let wrapper
    beforeEach(async () => {
      dispatchFns = {
        removeAuthRoleDispatch: jest.fn(),
        loadAuthUserAndRolesDispatch: jest.fn(),
        resetErrorDispatch: jest.fn(),
        setErrorDispatch: jest.fn(),
        setLoadedDispatch: jest.fn(),
        setMessageDispatch: jest.fn(),
        handleAxiosErrorDispatch: jest.fn(),
      }
      wrapper = await mount(
        <Provider store={store}>
          <MemoryRouter>
            <AuthUserAddRoleContainer
              {...dispatchFns}
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
      await wrapper.update()
    })

    describe('handleAdd', async () => {
      it('should require role to be selected when form submitted', () => {
        wrapper.find('form').simulate('submit', event)

        expect(dispatchFns.setErrorDispatch).toBeCalledWith([{ targetName: 'role', text: 'Select a role' }])
      })

      it('should call axios to add role', () => {
        axios.get = jest.fn()
        axios.get.mockImplementation(() => Promise.resolve({ status: 200, data: roles, config: {} }))

        wrapper.find('[data-qa="role"] select').simulate('change', event)
        wrapper.find('form').simulate('submit', event)

        expect(dispatchFns.setErrorDispatch).toHaveBeenCalledTimes(0)
        expect(axios.get).toHaveBeenCalledWith('/api/auth-user-roles-add', {
          params: { role: 'ROLE_1', username: 'joesmith' },
        })
      })

      it('should prevent default on the form submission', () => {
        wrapper.find('form').simulate('submit', event)

        expect(event.preventDefault).toBeCalled()
      })
    })

    describe('handleCancel', async () => {
      it('should call history go back', () => {
        wrapper.find('[data-qa="cancel-button"] button').simulate('click')

        expect(mockHistory.goBack).toHaveBeenCalled()
      })

      it('should prevent default on the form submission', () => {
        wrapper.find('[data-qa="cancel-button"] button').simulate('click', event)

        expect(event.preventDefault).toBeCalled()
      })
    })
  })
})
