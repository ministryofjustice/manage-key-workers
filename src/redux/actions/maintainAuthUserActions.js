import axios from 'axios'
import { SET_AUTH_USER_CONTEXT_USER, SET_AUTH_USER_ROLE_LIST, SET_AUTH_USER_SEARCH_RESULTS_LIST } from './actionTypes'
import { handleAxiosError, resetError, setLoaded, setMessage } from './index'

export const setMaintainAuthUsersList = userList => ({ type: SET_AUTH_USER_SEARCH_RESULTS_LIST, userList })
export const setMaintainAuthRoleList = roleList => ({ type: SET_AUTH_USER_ROLE_LIST, roleList })
export const setMaintainAuthContextUser = contextUser => ({ type: SET_AUTH_USER_CONTEXT_USER, contextUser })

const getUserRoles = async (dispatch, username) => {
  try {
    const roles = await axios.get('/api/auth-user-roles', {
      params: {
        username,
      },
    })
    dispatch(setMaintainAuthRoleList(roles.data))
  } catch (error) {
    dispatch(handleAxiosError(error))
  }
}

const loadUser = async (dispatch, username) => {
  try {
    const user = await axios.get('/api/auth-user-get', {
      params: {
        username,
      },
    })
    dispatch(setMaintainAuthContextUser(user.data))
  } catch (error) {
    dispatch(handleAxiosError(error))
  }
}

export const loadAuthUserAndRoles = username => dispatch => {
  dispatch(setLoaded(false))
  dispatch(resetError())

  loadUser(dispatch, username)
  getUserRoles(dispatch, username)

  dispatch(setLoaded(true))
}

export const removeAuthRole = roleCode => async (dispatch, getState) => {
  const {
    contextUser: { username },
    roleList,
  } = getState().maintainAuthUsers

  const selectedRole = roleList.find(r => r.roleCode === roleCode)

  try {
    await axios.get('/api/auth-user-roles-remove', {
      params: {
        username,
        role: selectedRole.roleCode,
      },
    })
    await getUserRoles(dispatch, username)
    dispatch(setMessage(`Role ${selectedRole.roleName} removed`))
  } catch (error) {
    dispatch(handleAxiosError(error))
  }
}

export const enableUser = () => async (dispatch, getState) => {
  const { username, firstName, lastName } = getState().maintainAuthUsers.contextUser

  try {
    await axios.get('/api/auth-user-enable', {
      params: {
        username,
      },
    })
    await loadUser(dispatch, username)
    dispatch(setMessage(`User ${firstName} ${lastName} enabled`))
  } catch (error) {
    dispatch(handleAxiosError(error))
  }
}

export const disableUser = () => async (dispatch, getState) => {
  const { username, firstName, lastName } = getState().maintainAuthUsers.contextUser

  try {
    await axios.get('/api/auth-user-disable', {
      params: {
        username,
      },
    })
    await loadUser(dispatch, username)
    dispatch(setMessage(`User ${firstName} ${lastName} disabled`))
  } catch (error) {
    dispatch(handleAxiosError(error))
  }
}
