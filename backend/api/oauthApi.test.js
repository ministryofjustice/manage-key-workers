const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')

chai.use(sinonChai)
const { expect } = chai

const MockAdapter = require('axios-mock-adapter')
const querystring = require('querystring')
const { oauthApiFactory } = require('./oauthApi')

const clientId = 'clientId'
const url = 'http://localhost'
const clientSecret = 'clientSecret'

const encodeClientCredentials = () =>
  Buffer.from(`${querystring.escape(clientId)}:${querystring.escape(clientSecret)}`).toString('base64')

const client = {}
const oauthApi = oauthApiFactory(client, { url, clientId, clientSecret })
const mock = new MockAdapter(oauthApi.oauthAxios)
const context = { some: 'context' }

const baseResponse = {
  token_type: 'bearer',
  expires_in: 59,
  scope: 'write',
  internalUser: true,
  jti: 'bf5e8f62-1d2a-4126-96e2-a4ae91997ba6',
}

describe('oathApi tests', () => {
  describe('refresh', () => {
    let refreshResponse
    let requestConfig

    beforeAll(() => {
      // Some hackery to catch the configuration used by axios to make the authentication / refresh request.
      oauthApi.oauthAxios.interceptors.request.use(config => {
        requestConfig = config
        return config
      })

      mock.reset()
      mock.onAny('oauth/token').reply(200, {
        ...baseResponse,
        access_token: 'newAccessToken',
        refresh_token: 'newRefreshToken',
      })

      refreshResponse = oauthApi.refresh('refreshToken')
    })

    describe('should save tokens', () => {
      it('should save access token', () =>
        refreshResponse.then(response => {
          expect(response.access_token).to.equal('newAccessToken')
        }))

      it('should save refresh token', () =>
        refreshResponse.then(response => {
          expect(response.refresh_token).to.equal('newRefreshToken')
        }))
    })

    it('should have set correct request configuration', () =>
      refreshResponse.then(response => {
        expect(requestConfig.method).to.equal('post')
        expect(requestConfig.baseURL).to.equal(url)
        expect(requestConfig.url).to.equal('http://localhost/oauth/token')
        expect(requestConfig.data).to.equal('refresh_token=refreshToken&grant_type=refresh_token')
        expect(requestConfig.headers.authorization).to.equal(`Basic ${encodeClientCredentials()}`)
        expect(requestConfig.headers['Content-Type']).to.equal('application/x-www-form-urlencoded')
      }))
  })

  describe('userRoles', () => {
    const roles = { bob: 'hello there' }
    let actual

    beforeEach(() => {
      client.get = sinon.stub().returns({
        then: () => roles,
      })
      actual = oauthApi.userRoles(context, { username: 'joe' })
    })

    it('should return roles from endpoint', () => {
      expect(actual).to.equal(roles)
    })
    it('should call auth roles endpoint', () => {
      expect(client.get).to.have.been.calledWith(context, 'api/authuser/joe/roles')
    })
  })

  describe('getUser', () => {
    const userDetails = { bob: 'hello there' }
    let actual

    beforeEach(() => {
      client.get = sinon.stub().returns({
        then: () => userDetails,
      })
      actual = oauthApi.getUser(context, { username: 'joe' })
    })

    it('should return roles from endpoint', () => {
      expect(actual).to.equal(userDetails)
    })
    it('should call auth user endpoint', () => {
      expect(client.get).to.have.been.calledWith(context, 'api/authuser/joe')
    })
  })

  describe('currentUser', () => {
    const userDetails = { bob: 'hello there' }
    let actual

    beforeEach(() => {
      client.get = sinon.stub().returns({
        then: () => userDetails,
      })
      actual = oauthApi.currentUser(context, { username: 'joe' })
    })

    it('should return user details from endpoint', () => {
      expect(actual).to.equal(userDetails)
    })
    it('should call user endpoint', () => {
      expect(client.get).to.have.been.calledWith(context, 'api/user/me')
    })
  })

  describe('currentRoles', () => {
    const roles = { bob: 'hello there' }
    let actual

    beforeEach(() => {
      client.get = sinon.stub().returns({
        then: () => roles,
      })
      actual = oauthApi.currentRoles(context, { username: 'joe' })
    })

    it('should return roles from endpoint', () => {
      expect(actual).to.equal(roles)
    })
    it('should call user endpoint', () => {
      expect(client.get).to.have.been.calledWith(context, 'api/user/me/roles')
    })
  })
  describe('userSearch', () => {
    const userDetails = { bob: 'hello there' }
    let actual

    beforeEach(() => {
      client.get = sinon.stub().returns({
        then: () => userDetails,
      })
      actual = oauthApi.userSearch(context, { nameFilter: "joe'fred@bananas%.com" })
    })

    it('should return roles from endpoint', () => {
      expect(actual).to.equal(userDetails)
    })
    it('should call user endpoint', () => {
      expect(client.get).to.have.been.calledWith(context, "api/authuser?email=joe'fred%40bananas%25.com")
    })
  })
  describe('addUserRole', () => {
    const errorResponse = { field: 'hello' }
    let actual

    beforeEach(() => {
      client.put = sinon.stub().returns({
        then: () => errorResponse,
      })
      actual = oauthApi.addUserRole(context, { username: 'bob', role: 'maintain' })
    })

    it('should return any error from endpoint', () => {
      expect(actual).to.equal(errorResponse)
    })
    it('should call user endpoint', () => {
      expect(client.put).to.have.been.calledWith(context, 'api/authuser/bob/roles/maintain')
    })
  })
  describe('removeUserRole', () => {
    const errorResponse = { field: 'hello' }
    let actual

    beforeEach(() => {
      client.del = sinon.stub().returns({
        then: () => errorResponse,
      })
      actual = oauthApi.removeUserRole(context, { username: 'bob', role: 'maintain' })
    })

    it('should return any error from endpoint', () => {
      expect(actual).to.equal(errorResponse)
    })
    it('should call user endpoint', () => {
      expect(client.del).to.have.been.calledWith(context, 'api/authuser/bob/roles/maintain')
    })
  })

  describe('allRoles', () => {
    const roles = { bob: 'hello there' }
    let actual

    beforeEach(() => {
      client.get = sinon.stub().returns({
        then: () => roles,
      })
      actual = oauthApi.allRoles(context)
    })

    it('should return roles from endpoint', () => {
      expect(actual).to.equal(roles)
    })
    it('should call user endpoint', () => {
      expect(client.get).to.have.been.calledWith(context, 'api/authroles')
    })
  })

  describe('createUser', () => {
    const user = { user: { firstName: 'joe', lastName: 'smith' } }

    beforeEach(() => {
      client.put = sinon.stub().returns({
        then: () => {},
      })
      oauthApi.createUser(context, 'joe', user)
    })

    it('should call auth user endpoint', () => {
      expect(client.put).to.have.been.calledWith(context, 'api/authuser/joe', user)
    })
  })
})
