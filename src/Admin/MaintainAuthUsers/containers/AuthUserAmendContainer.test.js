import axios from 'axios'
import React from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { mount } from 'enzyme'
import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'
import mockHistory from '../../../test/mockHistory'
import mockMatch from '../../../test/mockMatch'

import ConnectedAuthUserAmendContainer, { AuthUserAmendContainer } from './AuthUserAmendContainer'

const mockStore = configureMockStore([thunk])

const user = {
  username: 'joesmith',
  firstName: 'Joe',
  lastName: 'Smith',
  locked: false,
  enabled: true,
  email: 'joe.smith@justice.gov.uk',
}

describe('Auth amend container', () => {
  describe('rendering', () => {
    it('should render correctly without user', () => {
      const store = mockStore({
        app: { error: '', loaded: true, message: '' },
        maintainAuthUsers: { contextUser: {} },
      })

      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter>
            <ConnectedAuthUserAmendContainer />
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
            <ConnectedAuthUserAmendContainer />
          </MemoryRouter>
        </Provider>
      )
      expect(wrapper.find('Page').props().title).toEqual('Amend auth user: Joe Smith')
    })
  })

  describe('handle functions', () => {
    const store = { subscribe: jest.fn(), dispatch: jest.fn(), getState: jest.fn(), setState: jest.fn() }
    const state = { app: { error: '', loaded: true } }
    store.getState.mockReturnValue(state)

    let wrapper
    let dispatchFns
    beforeEach(() => {
      dispatchFns = {
        resetErrorDispatch: jest.fn(),
        setErrorDispatch: jest.fn(),
        handleAxiosErrorDispatch: jest.fn(),
        loadAuthUserAndRolesDispatch: jest.fn(),
        setMessageDispatch: jest.fn(),
      }
      wrapper = mount(
        <Provider store={store}>
          <MemoryRouter>
            <AuthUserAmendContainer
              {...dispatchFns}
              history={mockHistory}
              error=""
              match={mockMatch({ username: 'joebook' })}
              contextUser={user}
            />
          </MemoryRouter>
        </Provider>
      )
    })
    describe('state changes', () => {
      it('should set the user input on email changes', () => {
        wrapper
          .find('input#email')
          .simulate('change', { target: { name: 'email', value: 'useramendd' }, preventDefault: jest.fn() })
        expect(wrapper.find('AuthUserAmendContainer').state().email).toEqual('useramendd')
      })
    })

    it('should validate input on form submission', async () => {
      wrapper
        .find('input#email')
        .simulate('change', { target: { name: 'email', value: 'useramendd.com' }, preventDefault: jest.fn() })
      axios.post = jest.fn()
      axios.post.mockImplementation(() => Promise.resolve({ status: 200, data: {}, config: {} }))

      const submitEvent = { target: { value: 'amend' }, preventDefault: jest.fn() }
      await wrapper.find('form').simulate('submit', submitEvent)

      expect(dispatchFns.setErrorDispatch).toHaveBeenCalledWith([
        { targetName: 'email', text: 'Enter an email address in the correct format, like first.last@justice.gov.uk' },
      ])
      expect(axios.post).not.toBeCalled()
    })

    it('should call axios when form submitted', async () => {
      wrapper
        .find('input#email')
        .simulate('change', { target: { name: 'email', value: 'user@amendd.com' }, preventDefault: jest.fn() })
      axios.post = jest.fn()
      axios.post.mockImplementation(() => Promise.resolve({ status: 200, data: {}, config: {} }))

      const submitEvent = { target: { value: 'amend' }, preventDefault: jest.fn() }
      await wrapper.find('form').simulate('submit', submitEvent)

      expect(dispatchFns.setErrorDispatch).toHaveBeenCalledTimes(0)
      expect(axios.post).toBeCalledWith(
        '/api/auth-user-amend',
        { email: 'user@amendd.com' },
        { params: { username: 'joesmith' } }
      )
      expect(mockHistory.push).toBeCalledWith('/admin-utilities/maintain-auth-users/joesmith')
    })

    it('should prevent default on the form submission', () => {
      const submitEvent = { target: { value: 'amend' }, preventDefault: jest.fn() }
      wrapper.find('form').simulate('submit', submitEvent)

      expect(submitEvent.preventDefault).toBeCalled()
    })
  })
})
