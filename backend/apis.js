const config = require('./config')
const clientFactory = require('./api/oauthEnabledClient')
const { elite2ApiFactory } = require('./api/elite2Api')
const { prisonerSearchApiFactory } = require('./api/prisonerSearchApi')
const { oauthApiFactory } = require('./api/oauthApi')
const { keyworkerApiFactory } = require('./api/keyworkerApi')
const { tokenVerificationApiFactory } = require('./api/tokenVerificationApi')
const { complexityOfNeedApiFactory } = require('./api/complexityOfNeedApi')
const { hmppsManageUsersApiFactory } = require('./api/hmppsManageUsersApi')
const { frontendComponentApiFactory } = require('./api/frontendComponentApi')

const elite2Api = elite2ApiFactory(
  clientFactory({
    baseUrl: config.apis.elite2.url,
    timeout: config.apis.elite2.timeoutSeconds * 1000,
  })
)

const prisonerSearchApi = prisonerSearchApiFactory(
  clientFactory({
    baseUrl: config.apis.prisonerSearch.url,
    timeout: config.apis.prisonerSearch.timeoutSeconds * 1000,
  })
)

const oauthApi = oauthApiFactory(
  clientFactory({
    baseUrl: config.apis.oauth2.url,
    timeout: config.apis.oauth2.timeoutSeconds * 1000,
  }),
  { ...config.apis.oauth2 }
)

const hmppsManageUsersApi = hmppsManageUsersApiFactory(
  clientFactory({
    baseUrl: config.apis.hmppsManageUsers.url,
    timeout: config.apis.hmppsManageUsers.timeoutSeconds * 1000,
  })
)

const keyworkerApi = keyworkerApiFactory(
  clientFactory({
    baseUrl: config.apis.keyworker.url,
    timeout: 1000 * config.apis.keyworker.timeoutSeconds,
  })
)

const complexityOfNeedApi = complexityOfNeedApiFactory(
  clientFactory({
    baseUrl: config.apis.complexity.url,
    timeout: 1000 * config.apis.complexity.timeoutSeconds,
  })
)

const tokenVerificationApi = tokenVerificationApiFactory(
  clientFactory({
    baseUrl: config.apis.tokenverification.url,
    timeout: config.apis.tokenverification.timeoutSeconds * 1000,
  })
)

const frontendComponentApi = frontendComponentApiFactory(
  clientFactory({
    baseUrl: config.apis.frontendComponent.url,
    timeout: config.apis.frontendComponent.timeoutSeconds * 1000,
  })
)

module.exports = {
  elite2Api,
  prisonerSearchApi,
  oauthApi,
  hmppsManageUsersApi,
  keyworkerApi,
  tokenVerificationApi,
  complexityOfNeedApi,
  frontendComponentApi,
}
