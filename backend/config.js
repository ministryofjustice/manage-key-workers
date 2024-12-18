const production = process.env.NODE_ENV === 'production'

function get(name, fallback, options = { requireInProduction: false }) {
  const envVar = process.env[name]
  if (envVar) {
    return envVar
  }
  if (fallback !== undefined && (!production || !options.requireInProduction)) {
    return fallback
  }
  throw new Error(`Missing env var ${name}`)
}

const requiredInProduction = { requireInProduction: true }

const app = {
  port: process.env.PORT || 3001,
  production: process.env.NODE_ENV === 'production',
  disableWebpack: process.env.DISABLE_WEBPACK === 'true',
  notmEndpointUrl: process.env.NN_ENDPOINT_URL || 'http://localhost:3000/',
  prisonStaffHubUrl: process.env.PRISON_STAFF_HUB_UI_URL || 'http://localhost:3002/',
  mailTo: process.env.MAIL_TO || 'feedback@digital.justice.gov.uk',
  tokenRefreshThresholdSeconds: process.env.TOKEN_REFRESH_THRESHOLD_SECONDS || 60,
  offenderSearchResultMax: process.env.OFFENDER_SEARCH_RESULT_MAX || 200,
  applicationCaseload: process.env.APPLICATION_CASELOAD || 'NWEB',
  keyworkerProfileStatsEnabled: process.env.KEYWORKER_PROFILE_STATS_ENABLED || 'false',
  keyworkerDashboardStatsEnabled: process.env.KEYWORKER_DASHBOARD_STATS_ENABLED === 'true',
  url: process.env.MANAGE_KEY_WORKERS_URL || `http://localhost:${process.env.PORT || 3001}/`,
  supportUrl: process.env.SUPPORT_URL || 'http://localhost:3000/',
  maintenanceModeFlag: process.env.MAINTENANCE_MODE || 'false',
}

const setTestDefaults = () => {
  // Setup different default values when running locally or integration tests
  // .env file still overrides.
  if (!process.env.OFFENDER_SEARCH_RESULT_MAX) {
    app.offenderSearchResultMax = 50
  }

  app.keyworkerProfileStatsEnabled = 'true'
}

const analytics = {
  googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID,
  googleTagManagerId: process.env.GOOGLE_TAG_MANAGER_ID,
}

const hmppsCookie = {
  name: process.env.HMPPS_COOKIE_NAME || 'hmpps-session-dev',
  domain: process.env.HMPPS_COOKIE_DOMAIN || 'localhost',
  expiryMinutes: process.env.WEB_SESSION_TIMEOUT_IN_MINUTES || 60,
  sessionSecret: process.env.SESSION_COOKIE_SECRET || 'notm-insecure-session',
}

const apis = {
  oauth2: {
    url: process.env.OAUTH_ENDPOINT_URL || 'http://localhost:9090/auth',
    ui_url: process.env.OAUTH_ENDPOINT_UI_URL || process.env.OAUTH_ENDPOINT_URL || 'http://localhost:9090/auth',
    timeoutSeconds: process.env.OAUTH_ENDPOINT_TIMEOUT_SECONDS || 10,
    clientId: process.env.API_CLIENT_ID || 'elite2apiclient',
    clientSecret: process.env.API_CLIENT_SECRET || 'clientsecret',
    systemClientId: process.env.API_SYSTEM_CLIENT_ID,
    systemClientSecret: process.env.API_SYSTEM_CLIENT_SECRET,
  },
  hmppsManageUsers: {
    url: process.env.HMPPS_MANAGE_USERS_API_URL || 'http://localhost:8080',
    timeoutSeconds: process.env.API_ENDPOINT_TIMEOUT_SECONDS || 30,
  },
  elite2: {
    url: process.env.API_ENDPOINT_URL || 'http://localhost:8080',
    timeoutSeconds: process.env.API_ENDPOINT_TIMEOUT_SECONDS || 30,
  },
  prisonerSearch: {
    url: process.env.PRISONER_SEARCH_API_ENDPOINT_URL || 'http://localhost:8082',
    timeoutSeconds: process.env.PRISONER_SEARCH_API_ENDPOINT_TIMEOUT_SECONDS || 30,
  },
  keyworker: {
    url: process.env.KEYWORKER_API_URL || 'http://localhost:8081',
    timeoutSeconds: process.env.KEYWORKER_API_TIMEOUT_SECONDS || 30,
    ui_url: process.env.MANAGE_KEY_WORKERS_URL,
  },
  complexity: {
    url: process.env.COMPLEXITY_OF_NEED_URI || 'http://localhost:18091',
    timeoutSeconds: process.env.API_ENDPOINT_TIMEOUT_SECONDS || 10,
    enabled_prisons: process.env.PRISONS_WITH_OFFENDERS_THAT_HAVE_COMPLEX_NEEDS,
  },
  tokenverification: {
    url: process.env.TOKENVERIFICATION_API_URL || 'http://localhost:8100',
    timeoutSeconds: process.env.TOKENVERIFICATION_API_TIMEOUT_SECONDS || 10,
    enabled: process.env.TOKENVERIFICATION_API_ENABLED === 'true',
  },
}

const sentry = {
  dsn: process.env.SENTRY_DSN,
  loaderScriptId: process.env.SENTRY_LOADER_SCRIPT_ID,
  environment: get('SENTRY_ENVIRONMENT', 'local', requiredInProduction),
  tracesSampleRate: Number(get('SENTRY_TRACES_SAMPLE_RATE', 0.05)),
  replaySampleRate: Number(get('SENTRY_REPLAY_SAMPLE_RATE', 0.0)),
  replayOnErrorSampleRate: Number(get('SENTRY_REPLAY_ON_ERROR_SAMPLE_RATE', 0.1)),
}

const redis = {
  enabled: process.env.REDIS_ENABLED === 'true',
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
}

module.exports = {
  app,
  analytics,
  hmppsCookie,
  apis,
  redis,
  setTestDefaults,
  phaseName: process.env.SYSTEM_PHASE,
  sentry,
}
