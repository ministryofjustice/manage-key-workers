/* eslint-disable no-unused-expressions, prefer-promise-reject-errors */
const request = require('supertest')
const express = require('express')
const bodyParser = require('body-parser')
const cookieSession = require('cookie-session')
const passport = require('passport')
const flash = require('connect-flash')
const setCookie = require('set-cookie-parser')
const chai = require('chai')

const { expect } = chai
const sinon = require('sinon')
const sinonChai = require('sinon-chai')

chai.use(sinonChai)

const sessionManagementRoutes = require('../sessionManagementRoutes')
const auth = require('../auth')

const hmppsCookieName = 'testCookie'

const hasCookies = expectedNames => res => {
  const cookieNames = setCookie.parse(res).map(cookie => cookie.name)
  expect(cookieNames).to.have.members(expectedNames)
}

describe('Test the routes and middleware installed by sessionManagementRoutes', () => {
  const app = express()

  app.set('view engine', 'ejs')
  app.use(bodyParser.urlencoded({ extended: false }))

  app.use(
    cookieSession({
      name: hmppsCookieName,
      maxAge: 1 * 60 * 1000,
      secure: false,
      signed: false, // supertest can't cope with multiple cookies - https://github.com/visionmedia/supertest/issues/336
    })
  )

  app.use(passport.initialize())
  app.use(passport.session())
  app.use(flash())

  const oauthApi = {
    authenticate: () => Promise.resolve({ access_token: 'token' }),
    refresh: () => Promise.resolve({ access_token: 'newToken' }),
  }
  auth.init(oauthApi)

  /**
   * A Token refresher that does nothing.
   * @returns {Promise<void>}
   */
  const tokenRefresher = sinon.stub()

  sessionManagementRoutes.configureRoutes({
    app,
    tokenRefresher,
    mailTo: 'test@site.com',
  })

  // some content to send for '/'
  app.get('/', (req, res) => {
    res.send('static')
  })

  // Create an agent.  The agent handles and sends cookies. (It has state). The order of test below is important
  // because the outcome of each test depends upon the successful completion of the previous tests.
  const agent = request.agent(app)

  it('GET "/" with no cookie (not authenticated) redirects to /login', () => {
    tokenRefresher.resolves()

    return agent
      .get('/')
      .expect(302)
      .expect('location', '/login')
  })

  it('GET "/login" when not authenticated returns login page', () => agent.get('/login').expect(302))

  it('GET "/" with cookie serves content', () => agent.get('/').expect(302))

  it('GET "/heart-beat"', () =>
    agent
      .get('/heart-beat')
      .set('Accept', 'application/json')
      .expect(401))

  it('GET "/logout" clears the cookie', () => {
    tokenRefresher.resolves()

    return (
      agent
        .get('/auth/logout')
        .expect(302)
        .expect(
          'location',
          'http://localhost:9090/auth/logout?client_id=elite2apiclient&redirect_uri=http://localhost:3001'
        )
        // The server sends a set cookie header to clear the cookie.
        // The next test shows that the cookie was cleared because of the redirect to '/'
        .expect(hasCookies(['testCookie']))
    )
  })

  it('After logout get "/" should redirect to "/login"', () =>
    agent
      .get('/')
      .expect(302)
      .expect('location', '/login')
      .expect(hasCookies([])))
})
