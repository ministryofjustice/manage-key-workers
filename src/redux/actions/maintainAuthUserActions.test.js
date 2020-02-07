import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import axios from 'axios'

import {
  RESET_ERROR,
  SET_AUTH_USER_CONTEXT_USER,
  SET_AUTH_USER_GROUP_LIST,
  SET_AUTH_USER_ROLE_LIST,
  SET_AUTH_USER_SEARCH_RESULTS_LIST,
  SET_ERROR,
  SET_LOADED,
} from './actionTypes'
import {
  disableUser,
  enableUser,
  loadAuthUserRolesAndGroups,
  removeAuthGroup,
  removeAuthRole,
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
    describe('loadAuthUserRolesAndGroups', () => {
      it('should create an action to load auth users and roles', async () => {
        const roleB = { roleCode: 'roleB', roleName: 'Role B' }
        const groupB = { groupCode: 'groupB', groupName: 'Group B' }
        axios.get = jest.fn()
        axios.get.mockImplementationOnce(() =>
          Promise.resolve({ status: 200, data: { username: 'fetcheduser' }, config: {} })
        )
        axios.get.mockImplementationOnce(() => Promise.resolve({ status: 200, data: [roleB], config: {} }))
        axios.get.mockImplementationOnce(() => Promise.resolve({ status: 200, data: [groupB], config: {} }))

        const store = mockStore({
          maintainAuthUsers: {
            contextUser: { username: 'fetcheduser', firstName: 'Auth', lastName: 'User' },
            roleList: [{ roleCode: 'roleA', roleName: 'Role A' }, roleB],
            groupList: [{ roleCode: 'groupA', roleName: 'Group A' }, groupB],
          },
        })
        await store.dispatch(loadAuthUserRolesAndGroups('user'))

        expect(store.getActions()).toEqual([
          { loaded: false, type: SET_LOADED },
          { type: RESET_ERROR },
          { loaded: true, type: SET_LOADED },
          { contextUser: { username: 'fetcheduser' }, type: SET_AUTH_USER_CONTEXT_USER },
          { roleList: [roleB], type: SET_AUTH_USER_ROLE_LIST },
          { groupList: [groupB], type: SET_AUTH_USER_GROUP_LIST },
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
        await store.dispatch(loadAuthUserRolesAndGroups('user'))

        expect(store.getActions()).toEqual([
          { loaded: false, type: SET_LOADED },
          { type: RESET_ERROR },
          { error: 'Something went wrong: Error: User not found', type: SET_ERROR },
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

    describe('removeAuthGroup', () => {
      it('should create an action to remove auth group from user', async () => {
        const groupB = { groupCode: 'groupB', groupName: 'Group B' }
        axios.get = jest.fn()
        axios.get.mockImplementation(() => Promise.resolve({ status: 200, data: [groupB], config: {} }))

        const store = mockStore({
          maintainAuthUsers: {
            contextUser: { username: 'fetcheduser', firstName: 'Auth', lastName: 'User' },
            groupList: [{ groupCode: 'groupA', groupName: 'Group A' }, groupB],
          },
        })
        await store.dispatch(removeAuthGroup('groupA'))

        expect(store.getActions()).toEqual([{ groupList: [groupB], type: SET_AUTH_USER_GROUP_LIST }])
      })
      it('should handle axios errors', async () => {
        const groupB = { groupCode: 'groupB', groupName: 'Group B' }
        axios.get = jest.fn()
        axios.get.mockImplementation(() => throw new Error('User not found'))

        const store = mockStore({
          maintainAuthUsers: {
            contextUser: { username: 'fetcheduser', firstName: 'Auth', lastName: 'User' },
            groupList: [{ groupCode: 'groupA', groupName: 'Group A' }, groupB],
          },
        })
        await store.dispatch(removeAuthGroup('groupA'))

        expect(store.getActions()).toEqual([{ error: 'Something went wrong: Error: User not found', type: SET_ERROR }])
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
