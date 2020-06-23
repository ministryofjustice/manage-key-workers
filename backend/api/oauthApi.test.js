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
          expect(response.access_token).toEqual('newAccessToken')
        }))

      it('should save refresh token', () =>
        refreshResponse.then(response => {
          expect(response.refresh_token).toEqual('newRefreshToken')
        }))
    })

    it('should have set correct request configuration', () =>
      refreshResponse.then(() => {
        expect(requestConfig.method).toEqual('post')
        expect(requestConfig.baseURL).toEqual(url)
        expect(requestConfig.url).toEqual('http://localhost/oauth/token')
        expect(requestConfig.data).toEqual('refresh_token=refreshToken&grant_type=refresh_token')
        expect(requestConfig.headers.authorization).toEqual(`Basic ${encodeClientCredentials()}`)
        expect(requestConfig.headers['Content-Type']).toEqual('application/x-www-form-urlencoded')
      }))
  })

  describe('currentUser', () => {
    const userDetails = { bob: 'hello there' }
    let actual

    beforeEach(() => {
      client.get = jest.fn().mockReturnValue({
        then: () => userDetails,
      })
      actual = oauthApi.currentUser(context, { username: 'joe' })
    })

    it('should return user details from endpoint', () => {
      expect(actual).toEqual(userDetails)
    })
    it('should call user endpoint', () => {
      expect(client.get).toBeCalledWith(context, 'api/user/me')
    })
  })

  describe('currentRoles', () => {
    const roles = { bob: 'hello there' }
    let actual

    beforeEach(() => {
      client.get = jest.fn().mockReturnValue({
        then: () => roles,
      })
      actual = oauthApi.currentRoles(context, { username: 'joe' })
    })

    it('should return roles from endpoint', () => {
      expect(actual).toEqual(roles)
    })
    it('should call user endpoint', () => {
      expect(client.get).toBeCalledWith(context, 'api/user/me/roles')
    })
  })
})
