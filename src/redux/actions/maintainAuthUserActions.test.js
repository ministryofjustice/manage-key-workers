import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import axios from 'axios'

import {
  RESET_ERROR,
  SET_AUTH_USER_CONTEXT_USER,
  SET_AUTH_USER_ROLE_LIST,
  SET_AUTH_USER_SEARCH_RESULTS_LIST,
  SET_ERROR,
  SET_LOADED,
  SET_MESSAGE,
} from './actionTypes'
import {
  loadAuthUserAndRoles,
  removeAuthRole,
  enableUser,
  disableUser,
  setMaintainAuthContextUser,
  setMaintainAuthRoleList,
  setMaintainAuthUsersList,
} from './maintainAuthUserActions'

const mockStore = configureMockStore([thunk])

describe('maintain auth users', () => {
  describe('simple actions', () => {
    it('should create an action to maintain auth users', () => {
      const someList = [{ username: 'username' }]
      const expectedAction = {
        type: SET_AUTH_USER_SEARCH_RESULTS_LIST,
        userList: someList,
      }
      expect(setMaintainAuthUsersList(someList)).toEqual(expectedAction)
    })
    it('should create an action to set auth roles', () => {
      const someList = [{ username: 'username' }]
      const expectedAction = {
        type: SET_AUTH_USER_ROLE_LIST,
        roleList: someList,
      }
      expect(setMaintainAuthRoleList(someList)).toEqual(expectedAction)
    })
    it('should create an action to update auth context user', () => {
      const some = { username: 'username' }
      const expectedAction = {
        type: SET_AUTH_USER_CONTEXT_USER,
        contextUser: some,
      }
      expect(setMaintainAuthContextUser(some)).toEqual(expectedAction)
    })
  })

  describe('thunks', () => {
    describe('loadAuthUserAndRoles', () => {
      it('should create an action to load auth users and roles', async () => {
        const roleB = { roleCode: 'roleB', roleName: 'Role B' }
        axios.get = jest.fn()
        axios.get.mockImplementationOnce(() =>
          Promise.resolve({ status: 200, data: { username: 'fetcheduser' }, config: {} })
        )
        axios.get.mockImplementationOnce(() => Promise.resolve({ status: 200, data: [roleB], config: {} }))

        const store = mockStore({
          maintainAuthUsers: {
            contextUser: { username: 'fetcheduser', firstName: 'Auth', lastName: 'User' },
            roleList: [{ roleCode: 'roleA', roleName: 'Role A' }, roleB],
          },
        })
        await store.dispatch(loadAuthUserAndRoles('user'))

        expect(store.getActions()).toEqual([
          { loaded: false, type: SET_LOADED },
          { type: RESET_ERROR },
          { loaded: true, type: SET_LOADED },
          { contextUser: { username: 'fetcheduser' }, type: SET_AUTH_USER_CONTEXT_USER },
          { roleList: [roleB], type: SET_AUTH_USER_ROLE_LIST },
        ])
      })
      it('should handle axios errors', async () => {
        const roleB = { roleCode: 'roleB', roleName: 'Role B' }
        axios.get = jest.fn()
        axios.get.mockImplementation(() => throw new Error('User not found'))

        const store = mockStore({
          maintainAuthUsers: {
            contextUser: { username: 'fetcheduser', firstName: 'Auth', lastName: 'User' },
            roleList: [{ roleCode: 'roleA', roleName: 'Role A' }, roleB],
          },
        })
        await store.dispatch(loadAuthUserAndRoles('user'))

        expect(store.getActions()).toEqual([
          { loaded: false, type: SET_LOADED },
          { type: RESET_ERROR },
          { error: 'Something went wrong: Error: User not found', type: SET_ERROR },
          { error: 'Something went wrong: Error: User not found', type: SET_ERROR },
          { loaded: true, type: SET_LOADED },
        ])
      })
    })

    describe('removeAuthRole', () => {
      it('should create an action to remove auth role from user', async () => {
        const roleB = { roleCode: 'roleB', roleName: 'Role B' }
        axios.get = jest.fn()
        axios.get.mockImplementation(() => Promise.resolve({ status: 200, data: [roleB], config: {} }))

        const store = mockStore({
          maintainAuthUsers: {
            contextUser: { username: 'fetcheduser', firstName: 'Auth', lastName: 'User' },
            roleList: [{ roleCode: 'roleA', roleName: 'Role A' }, roleB],
          },
        })
        await store.dispatch(removeAuthRole('roleA'))

        expect(store.getActions()).toEqual([
          { type: 'RESET_ERROR' },
          { roleList: [roleB], type: SET_AUTH_USER_ROLE_LIST },
          { message: 'Role Role A removed', type: SET_MESSAGE },
        ])
      })
      it('should handle axios errors', async () => {
        const roleB = { roleCode: 'roleB', roleName: 'Role B' }
        axios.get = jest.fn()
        axios.get.mockImplementation(() => throw new Error('User not found'))

        const store = mockStore({
          maintainAuthUsers: {
            contextUser: { username: 'fetcheduser', firstName: 'Auth', lastName: 'User' },
            roleList: [{ roleCode: 'roleA', roleName: 'Role A' }, roleB],
          },
        })
        await store.dispatch(removeAuthRole('roleA'))

        expect(store.getActions()).toEqual([
          { type: 'RESET_ERROR' },
          { error: 'Something went wrong: Error: User not found', type: SET_ERROR },
        ])
      })
    })

    describe('enableUser', () => {
      it('should create an action to enable a user', async () => {
        axios.get = jest.fn()
        axios.get.mockImplementationOnce(() => Promise.resolve({ status: 200, config: {} }))
        axios.get.mockImplementationOnce(() =>
          Promise.resolve({ status: 200, data: { username: 'fetcheduser' }, config: {} })
        )

        const store = mockStore({
          maintainAuthUsers: {
            contextUser: { username: 'fetcheduser', firstName: 'Auth', lastName: 'User' },
          },
        })
        await store.dispatch(enableUser())

        expect(store.getActions()).toEqual([
          {
            contextUser: { username: 'fetcheduser' },
            type: 'SET_AUTH_USER_CONTEXT_USER',
          },
          { message: 'User Auth User enabled', type: SET_MESSAGE },
        ])
      })
      it('should handle axios errors', async () => {
        axios.get = jest.fn()
        axios.get.mockImplementationOnce(() => throw new Error('User not found'))

        const store = mockStore({
          maintainAuthUsers: {
            contextUser: { username: 'fetcheduser', firstName: 'Auth', lastName: 'User' },
          },
        })
        await store.dispatch(enableUser())

        expect(store.getActions()).toEqual([{ error: 'Something went wrong: Error: User not found', type: SET_ERROR }])
      })
    })

    describe('disableUser', () => {
      it('should create an action to disable a user', async () => {
        axios.get = jest.fn()
        axios.get.mockImplementationOnce(() => Promise.resolve({ status: 200, config: {} }))
        axios.get.mockImplementationOnce(() =>
          Promise.resolve({ status: 200, data: { username: 'fetcheduser' }, config: {} })
        )

        const store = mockStore({
          maintainAuthUsers: {
            contextUser: { username: 'fetcheduser', firstName: 'Auth', lastName: 'User' },
          },
        })
        await store.dispatch(disableUser())

        expect(store.getActions()).toEqual([
          { contextUser: { username: 'fetcheduser' }, type: 'SET_AUTH_USER_CONTEXT_USER' },
          { message: 'User Auth User disabled', type: SET_MESSAGE },
        ])
      })
      it('should handle axios errors', async () => {
        axios.get = jest.fn()
        axios.get.mockImplementationOnce(() => throw new Error('User not found'))

        const store = mockStore({
          maintainAuthUsers: {
            contextUser: { username: 'fetcheduser', firstName: 'Auth', lastName: 'User' },
          },
        })
        await store.dispatch(disableUser())

        expect(store.getActions()).toEqual([{ error: 'Something went wrong: Error: User not found', type: SET_ERROR }])
      })
    })
  })
})
