const request = require('supertest')
const express = require('express')
const bodyParser = require('body-parser')
const routes = require('../routes')

const { elite2ApiFactory } = require('../api/elite2Api')
const { keyworkerApiFactory } = require('../api/keyworkerApi')
const { oauthApiFactory } = require('../api/oauthApi')

const errorResponse = {
  response: {
    data: {
      status: 500,
      userMessage: 'Test error',
    },
  },
}

describe('Routes', () => {
  let client = {}
  let oauthApi = {}
  let elite2Api = {}
  let keyworkerApi = {}
  let app = {}

  beforeEach(() => {
    client = {
      get: () => Promise.reject(errorResponse),
      post: () => Promise.reject(errorResponse),
      put: () => Promise.reject(errorResponse),
      del: () => Promise.reject(errorResponse),
    }

    oauthApi = oauthApiFactory(client, {})
    elite2Api = elite2ApiFactory(client, {})
    keyworkerApi = keyworkerApiFactory(client, {})

    app = express()
    app.use(bodyParser.json())
    app.use(routes({ oauthApi, elite2Api, keyworkerApi }))
  })

  it('GET /api/me should go through error handler', () =>
    request(app)
      .get('/api/me')
      .set('Accept', 'application/json')
      .expect(500)
      .expect('"Test error"'))

  it('GET api/usercaseloads should go through error handler', () =>
    request(app)
      .get('/api/usercaseloads')
      .set('Accept', 'application/json')
      .expect(500)
      .expect('"Test error"'))

  it('PUT api/setactivecaseload should go through error handler', () =>
    request(app)
      .put('/api/setactivecaseload')
      .set('Accept', 'application/json')
      .expect(500)
      .expect('"Test error"'))

  it('GET api/unallocated should go through error handler', () =>
    request(app)
      .put('/api/unallocated')
      .set('Accept', 'application/json')
      .expect(500)
      .expect('"Test error"'))

  it('GET api/allocated should go through error handler', () =>
    request(app)
      .put('/api/allocated')
      .set('Accept', 'application/json')
      .expect(500)
      .expect('"Test error"'))

  it('GET api/keyworkerAllocations should go through error handler', () =>
    request(app)
      .put('/api/keyworkerAllocations')
      .set('Accept', 'application/json')
      .expect(500)
      .expect('"Test error"'))

  it('GET api/searchOffenders should go through error handler', () =>
    request(app)
      .put('/api/searchOffenders')
      .set('Accept', 'application/json')
      .expect(500)
      .expect('"Test error"'))

  it('GET api/userLocations should go through error handler', () =>
    request(app)
      .put('/api/userLocations')
      .set('Accept', 'application/json')
      .expect(500)
      .expect('"Test error"'))

  it('GET api/allocationHistory should go through error handler', () =>
    request(app)
      .put('/api/allocationHistory')
      .set('Accept', 'application/json')
      .expect(500)
      .expect('"Test error"'))

  it('GET api/keyworker should go through error handler', () =>
    request(app)
      .put('/api/keyworker')
      .set('Accept', 'application/json')
      .expect(500)
      .expect('"Test error"'))

  it('POST api/manualoverride should go through error handler', () =>
    request(app)
      .post('/api/manualoverride')
      .set('Accept', 'application/json')
      .expect(500))

  it('GET api/keyworkerSearch should go through error handler', () =>
    request(app)
      .get('/api/keyworkerSearch')
      .set('Accept', 'application/json')
      .expect(500)
      .expect('"Test error"'))

  it('GET api/autoAllocateConfirmWithOverride should go through error handler', () =>
    request(app)
      .get('/api/autoAllocateConfirmWithOverride')
      .set('Accept', 'application/json')
      .expect(500)
      .expect('"Test error"'))

  it('GET api/keyworkerUpdate should go through error handler', () =>
    request(app)
      .get('/api/keyworkerUpdate')
      .set('Accept', 'application/json')
      .expect(500)
      .expect('"Test error"'))

  it('GET api/enableNewNomis should go through error handler', () =>
    request(app)
      .get('/api/enableNewNomis')
      .set('Accept', 'application/json')
      .expect(500)
      .expect('"Test error"'))

  it('GET api/autoAllocateMigrate should go through error handler', () =>
    request(app)
      .get('/api/autoAllocateMigrate')
      .set('Accept', 'application/json')
      .expect(500)
      .expect('"Test error"'))

  it('GET api/manualAllocateMigrate should go through error handler', () =>
    request(app)
      .get('/api/manualAllocateMigrate')
      .set('Accept', 'application/json')
      .expect(500)
      .expect('"Test error"'))

  it('GET api/keyworkerSettings should go through error handler', () =>
    request(app)
      .get('/api/keyworkerSettings')
      .set('Accept', 'application/json')
      .expect(500)
      .expect('"Test error"'))

  it('GET api/userSearch should go through error handler', () =>
    request(app)
      .get('/api/userSearch')
      .set('Accept', 'application/json')
      .expect(500)
      .expect('"Test error"'))

  it('GET api/auth-user-get should go through error handler', () =>
    request(app)
      .get('/api/auth-user-get')
      .set('Accept', 'application/json')
      .expect(500)
      .expect('"Test error"'))

  it('POST api/auth-user-create should go through error handler', () =>
    request(app)
      .post('/api/auth-user-create')
      .set('Accept', 'application/json')
      .expect(500)
      .expect('"Test error"'))

  it('GET api/auth-user-search should go through error handler', () =>
    request(app)
      .get('/api/auth-user-search')
      .query({ nameFilter: 'john doe' })
      .set('Accept', 'application/json')
      .expect(500)
      .expect('"Test error"'))

  it('GET api/auth-user-roles should go through error handler', () =>
    request(app)
      .get('/api/auth-user-roles')
      .query({ username: 'john doe' })
      .set('Accept', 'application/json')
      .expect(500)
      .expect('"Test error"'))

  it('POST api/auth-user-roles-add should go through error handler', () =>
    request(app)
      .post('/api/auth-user-roles-add')
      .query({ role: 'admin' })
      .set('Accept', 'application/json')
      .expect(500)
      .expect('"Test error"'))

  it('GET api/auth-user-roles-remove should go through error handler', () =>
    request(app)
      .get('/api/auth-user-roles-remove')
      .query({ role: 'admin' })
      .set('Accept', 'application/json')
      .expect(500)
      .expect('"Test error"'))

  it('GET api/auth-roles should go through error handler', () =>
    request(app)
      .get('/api/auth-roles')
      .set('Accept', 'application/json')
      .expect(500)
      .expect('"Test error"'))

  it('GET api/getRoles should go through error handler', () =>
    request(app)
      .get('/api/getRoles')
      .set('Accept', 'application/json')
      .expect(500)
      .expect('"Test error"'))

  it('GET api/getUser should go through error handler', () =>
    request(app)
      .get('/api/getUser')
      .set('Accept', 'application/json')
      .expect(500)
      .expect('"Test error"'))

  it('DEL api/removeRole should go through error handler', () =>
    request(app)
      .del('/api/removeRole')
      .set('Accept', 'application/json')
      .expect(500)
      .expect('"Test error"'))

  it('GET api/addRole should go through error handler', () =>
    request(app)
      .get('/api/addRole')
      .set('Accept', 'application/json')
      .expect(500)
      .expect('"Test error"'))

  it('GET api/contextUserRoles should go through error handler', () =>
    request(app)
      .get('/api/contextUserRoles')
      .set('Accept', 'application/json')
      .expect(500)
      .expect('"Test error"'))

  it('GET api/keyworker-profile-stats should go through error handler', () =>
    request(app)
      .get('/api/keyworker-profile-stats')
      .set('Accept', 'application/json')
      .expect(500)
      .expect('"Test error"'))

  it('GET api/keyworker-prison-stats should go through error handler', () =>
    request(app)
      .get('/api/keyworker-prison-stats')
      .set('Accept', 'application/json')
      .expect(500)
      .expect('"Test error"'))
})
