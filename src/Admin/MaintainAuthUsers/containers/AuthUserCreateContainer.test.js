import axios from 'axios'
import React from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { mount, shallow } from 'enzyme'
import mockHistory from '../../../test/mockHistory'

import ConnectedAuthUserCreateContainer, { AuthUserCreateContainer } from './AuthUserCreateContainer'

const groups = [
  { groupCode: 'GROUP_1', groupName: 'Group 1' },
  { groupCode: 'GROUP_2', groupName: 'Group 2' },
  { groupCode: 'GROUP_3', groupName: 'Group 3' },
]

describe('Auth create container', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<ConnectedAuthUserCreateContainer />)
    expect(wrapper).toMatchSnapshot()
  })

  describe('handle functions', () => {
    const store = { subscribe: jest.fn(), dispatch: jest.fn(), getState: jest.fn(), setState: jest.fn() }
    const state = { app: { error: '', loaded: true }, groups }
    store.getState.mockReturnValue(state)
    axios.get = jest.fn()
    axios.get.mockImplementation(() => Promise.resolve({ status: 200, data: groups }))

    let wrapper
    let dispatchFns
    beforeEach(() => {
      dispatchFns = {
        resetErrorDispatch: jest.fn(),
        setErrorDispatch: jest.fn(),
        handleAxiosErrorDispatch: jest.fn(),
        dispatchLoaded: jest.fn(),
      }
      wrapper = mount(
        <Provider store={store}>
          <MemoryRouter>
            <AuthUserCreateContainer {...dispatchFns} history={mockHistory} error="" />
          </MemoryRouter>
        </Provider>
      )
    })
    describe('state changes', () => {
      it('should call axios to load the groups', () => {
        expect(axios.get).toBeCalled()
      })
      it('should set the user input on username changes', () => {
        wrapper
          .find('input#username')
          .simulate('change', { target: { name: 'username', value: 'usercreated' }, preventDefault: jest.fn() })
        expect(wrapper.find('AuthUserCreateContainer').state().username).toEqual('usercreated')
      })
      it('should set the user input on email changes', () => {
        wrapper
          .find('input#email')
          .simulate('change', { target: { name: 'email', value: 'usercreated' }, preventDefault: jest.fn() })
        expect(wrapper.find('AuthUserCreateContainer').state().email).toEqual('usercreated')
      })
      it('should set the user input on firstName changes', () => {
        wrapper
          .find('input#firstName')
          .simulate('change', { target: { name: 'firstName', value: 'usercreated' }, preventDefault: jest.fn() })
        expect(wrapper.find('AuthUserCreateContainer').state().firstName).toEqual('usercreated')
      })
      it('should set the user input on lastName changes', () => {
        wrapper
          .find('input#lastName')
          .simulate('change', { target: { name: 'lastName', value: 'usercreated' }, preventDefault: jest.fn() })
        expect(wrapper.find('AuthUserCreateContainer').state().lastName).toEqual('usercreated')
      })
      it('should set the user select on group changes', () => {
        wrapper.update()
        wrapper
          .find('select#groupCode')
          .simulate('change', { target: { name: 'groupCode', value: 'GROUP_1' }, preventDefault: jest.fn() })
        expect(wrapper.find('AuthUserCreateContainer').state().groupCode).toEqual('GROUP_1')
      })
    })

    it('should validate input on form submission', async () => {
      wrapper
        .find('input#username')
        .simulate('change', { target: { name: 'username', value: 'user' }, preventDefault: jest.fn() })
      wrapper
        .find('input#email')
        .simulate('change', { target: { name: 'email', value: 'user@created.com' }, preventDefault: jest.fn() })
      wrapper
        .find('input#firstName')
        .simulate('change', { target: { name: 'firstName', value: 'first' }, preventDefault: jest.fn() })
      wrapper
        .find('input#lastName')
        .simulate('change', { target: { name: 'lastName', value: 'last' }, preventDefault: jest.fn() })
      axios.post = jest.fn()
      axios.post.mockImplementation(() => Promise.resolve({ status: 200, data: {}, config: {} }))

      const submitEvent = { target: { value: 'create' }, preventDefault: jest.fn() }
      await wrapper.find('form').simulate('submit', submitEvent)

      expect(dispatchFns.setErrorDispatch).toHaveBeenCalledWith([
        { targetName: 'username', text: 'Username must be 6 characters or more' },
      ])
      expect(axios.post).not.toBeCalled()
    })

    it('should call axios when form submitted', async () => {
      wrapper
        .find('input#username')
        .simulate('change', { target: { name: 'username', value: 'userme' }, preventDefault: jest.fn() })
      wrapper
        .find('input#email')
        .simulate('change', { target: { name: 'email', value: 'user@created.com' }, preventDefault: jest.fn() })
      wrapper
        .find('input#firstName')
        .simulate('change', { target: { name: 'firstName', value: 'first' }, preventDefault: jest.fn() })
      wrapper
        .find('input#lastName')
        .simulate('change', { target: { name: 'lastName', value: 'last' }, preventDefault: jest.fn() })
      axios.post = jest.fn()
      axios.post.mockImplementation(() => Promise.resolve({ status: 200, data: {}, config: {} }))

      const submitEvent = { target: { value: 'create' }, preventDefault: jest.fn() }
      await wrapper.find('form').simulate('submit', submitEvent)

      expect(dispatchFns.setErrorDispatch).toHaveBeenCalledTimes(0)
      expect(axios.post).toBeCalledWith(
        '/api/auth-user-create',
        { email: 'user@created.com', firstName: 'first', lastName: 'last', username: 'userme', groups },
        { params: { username: 'userme' } }
      )
      expect(mockHistory.push).toBeCalledWith('/admin-utilities/maintain-auth-users/userme')
    })

    it('should prevent default on the form submission', () => {
      const submitEvent = { target: { value: 'create' }, preventDefault: jest.fn() }
      wrapper.find('form').simulate('submit', submitEvent)

      expect(submitEvent.preventDefault).toBeCalled()
    })
  })
})
