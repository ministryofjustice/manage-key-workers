const nock = require('nock')
const { hmppsManageUsersApiFactory } = require('./hmppsManageUsersApi')

const clientId = 'clientId'
const url = 'http://localhost'
const clientSecret = 'clientSecret'

const client = {}
const hmppsManageUsersApi = hmppsManageUsersApiFactory(client, { url, clientId, clientSecret })
const context = { some: 'context' }

describe('hmppsManageUsersApi tests', () => {
  beforeEach(() => {
    nock.cleanAll()
  })

  describe('currentUser', () => {
    const userDetails = { bob: 'hello there' }
    let actual

    beforeEach(() => {
      client.get = jest.fn().mockReturnValue({
        then: () => userDetails,
      })
      actual = hmppsManageUsersApi.currentUser(context)
    })

    it('should return user details from endpoint', () => {
      expect(actual).toEqual(userDetails)
    })
    it('should call user endpoint', () => {
      expect(client.get).toBeCalledWith(context, '/api/user/me')
    })
  })

  describe('currentRoles', () => {
    const roles = { bob: 'hello there' }
    let actual

    beforeEach(() => {
      client.get = jest.fn().mockReturnValue({
        then: () => roles,
      })
      actual = hmppsManageUsersApi.currentRoles(context)
    })

    it('should return roles from endpoint', () => {
      expect(actual).toEqual(roles)
    })
    it('should call user endpoint', () => {
      expect(client.get).toBeCalledWith(context, '/api/user/me/roles')
    })
  })
})
