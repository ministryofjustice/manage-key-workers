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
      expect(wrapper.find('Page').props().title).toEqual('Auth user: Joe Smith')
    })
  })

  describe('handle functions', () => {
    const event = { target: { name: 'user', value: 'usersearched' } }
    const roleList = [{ roleCode: 'roleA', roleName: 'Role A' }, { roleCode: 'roleB', roleName: 'Role B' }]
    const groupList = [{ groupCode: 'group1', groupName: 'Group 1' }, { groupCode: 'group2', groupName: 'Group 2' }]
    const store = mockStore({ app: { error: '', loaded: true, message: '' } })

    const props = {
      contextUser: user,
      roleList,
      groupList,
      error: '',
      message: '',
      match: mockMatch({ username: 'joebook' }),
      history: mockHistory,
    }
    let wrapper

    beforeEach(() => {
      event.preventDefault = jest.fn()

      props.removeAuthRoleDispatch = jest.fn()
      props.removeAuthGroupDispatch = jest.fn()
      props.enableDispatch = jest.fn()
      props.disableDispatch = jest.fn()
      props.clearMessage = jest.fn()
      props.loadAuthUserRolesAndGroupsDispatch = jest.fn()

      wrapper = mount(
        <Provider store={store}>
          <MemoryRouter>
            <AuthUserContainer {...props} />
          </MemoryRouter>
        </Provider>
      )
    })

    describe('handleRoleRemove', () => {
      it('should call axios to remove role when remove button clicked', () => {
        wrapper.find('[data-qa="remove-button-roleA"] button').simulate('click')

        expect(props.removeAuthRoleDispatch).toBeCalledWith('roleA')
      })

      it('should prevent default on the form submission', () => {
        wrapper.find('[data-qa="remove-button-roleA"] button').simulate('click', event)

        expect(event.preventDefault).toBeCalled()
      })
    })

    describe('handleRoleAdd', () => {
      it('should set history when add button clicked', () => {
        wrapper.find('[data-qa="add-role-button"] button').simulate('click')

        expect(mockHistory.push).toBeCalledWith('/admin-utilities/maintain-auth-users/joesmith/add-role')
      })

      it('should prevent default on the form submission', () => {
        wrapper.find('[data-qa="add-role-button"] button').simulate('click', event)

        expect(event.preventDefault).toBeCalled()
      })
    })

    describe('handleGroupRemove', () => {
      it('should call axios to remove group when remove button clicked', () => {
        wrapper.find('[data-qa="remove-button-group1"] button').simulate('click')

        expect(props.removeAuthGroupDispatch).toBeCalledWith('group1')
      })

      it('should prevent default on the form submission', () => {
        wrapper.find('[data-qa="remove-button-group1"] button').simulate('click', event)

        expect(event.preventDefault).toBeCalled()
      })
    })

    describe('handleGroupAdd', () => {
      it('should set history when add button clicked', () => {
        wrapper.find('[data-qa="add-group-button"] button').simulate('click')

        expect(mockHistory.push).toBeCalledWith('/admin-utilities/maintain-auth-users/joesmith/add-group')
      })

      it('should prevent default on the form submission', () => {
        wrapper.find('[data-qa="add-group-button"] button').simulate('click', event)

        expect(event.preventDefault).toBeCalled()
      })
    })

    describe('handleDisable', () => {
      it('should call axios to disable user when button clicked', () => {
        wrapper.find('[data-qa="enable-button"] button').simulate('click')

        expect(props.disableDispatch).toBeCalled()
      })

      it('should prevent default on the form submission', () => {
        wrapper.find('[data-qa="enable-button"] button').simulate('click', event)

        expect(event.preventDefault).toBeCalled()
      })
    })

    describe('handleEnable', () => {
      it('should call axios to enable user when button clicked', () => {
        user.enabled = false
        wrapper = mount(
          <Provider store={store}>
            <MemoryRouter>
              <AuthUserContainer {...props} />
            </MemoryRouter>
          </Provider>
        )

        wrapper.find('[data-qa="enable-button"] button').simulate('click')

        expect(props.enableDispatch).toBeCalled()
      })

      it('should prevent default on the form submission', () => {
        wrapper.find('[data-qa="enable-button"] button').simulate('click', event)

        expect(event.preventDefault).toBeCalled()
      })
    })
  })
})
