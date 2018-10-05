const setTestDefaults = () => {
  // Setup different default values when running locally or integration tests
  // .env file still overrides.
  if (!process.env.OFFENDER_SEARCH_RESULT_MAX) {
    app.offenderSearchResultMax = 50;
  }
  if (!process.env.MAINTAIN_ROLES_ENABLED) {
    app.maintainRolesEnabled = "true";
  }
};

const app = {
  production: process.env.NODE_ENV === 'production',
  notmEndpointUrl: process.env.NN_ENDPOINT_URL || 'http://localhost:3000/',
  mailTo: process.env.MAIL_TO || 'feedback@digital.justice.gov.uk',
  tokenRefreshThresholdSeconds: process.env.TOKEN_REFRESH_THRESHOLD_SECONDS || 60,
  offenderSearchResultMax: process.env.OFFENDER_SEARCH_RESULT_MAX || 200,
  maintainRolesEnabled: process.env.MAINTAIN_ROLES_ENABLED || "false",
  applicationCaseload: process.env.APPLICATION_CASELOAD || "NWEB"
};

const analytics = {
  googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID
};

const hmppsCookie = {
  name: process.env.HMPPS_COOKIE_NAME || 'hmpps-session-dev',
  domain: process.env.HMPPS_COOKIE_DOMAIN || 'localhost',
  expiryMinutes: process.env.WEB_SESSION_TIMEOUT_IN_MINUTES || 20
};

const apis = {
  oauth2: {
    url: process.env.OAUTH_ENDPOINT_URL || process.env.API_ENDPOINT_URL || 'http://localhost:9090/auth',
    timeoutSeconds: process.env.OAUTH_ENDPOINT_TIMEOUT_SECONDS || 10,
    clientId: process.env.API_CLIENT_ID || 'elite2apiclient',
    clientSecret: process.env.API_CLIENT_SECRET || 'clientsecret'
  },
  elite2: {
    url: process.env.API_ENDPOINT_URL || 'http://localhost:8080/',
    timeoutSeconds: process.env.API_ENDPOINT_TIMEOUT_SECONDS || 30
  },
  keyworker: {
    url: process.env.KEYWORKER_API_URL || 'http://localhost:8081/',
    timeoutSeconds: process.env.KEYWORKER_API_TIMEOUT_SECONDS || 30,
    ui_url: process.env.OMIC_UI_URL
  }
};

module.exports = {
  app,
  analytics,
  hmppsCookie,
  apis,
  setTestDefaults
};
