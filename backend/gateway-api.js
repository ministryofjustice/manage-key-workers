const axios = require('axios');
const session = require('./session');
const useApiAuth = (process.env.USE_API_GATEWAY_AUTH || 'no') === 'yes';
const log = require('./log');
const logError = require('./logError').logError;
const querystring = require('querystring');

axios.defaults.baseURL = process.env.API_ENDPOINT_URL || 'http://localhost:8080/api';
axios.interceptors.request.use((config) => {
  if (useApiAuth) {
    const backendToken = config.headers.authorization;
    if (backendToken) {
      config.headers['elite-authorization'] = backendToken; // eslint-disable-line no-param-reassign
    }
    config.headers.authorization = `Bearer ${gatewayToken()}`; // eslint-disable-line no-param-reassign
  }
  return config;
}, (error) => Promise.reject(error));

const getRequest = ({ req, url, headers }) => service.callApi({
  method: 'get',
  url,
  headers: headers || {},
  reqHeaders: req.headers,
  onTokenRefresh: (token) => {
    req.headers.jwt = token;
  }
});

const postRequest = ({ req, url, headers }) => service.callApi({
  method: 'post',
  url,
  headers: headers || { 'content-type': 'application/json' },
  reqHeaders: req.headers,
  data: req.data,
  onTokenRefresh: (token) => {
    req.headers.jwt = token;
  }
});

const putRequest = ({ req, url, headers }) => service.callApi({
  method: 'put',
  url,
  headers: headers || { 'content-type': 'application/json' },
  reqHeaders: req.headers,
  data: req.body,
  onTokenRefresh: (token) => {
    req.headers.jwt = token;
  }
});

const getHeaders = ({ headers, reqHeaders, token }) => {
  return Object.assign({}, headers, {
    "authorization": 'Bearer ' + token,
    'access-control-allow-origin': reqHeaders.host
  });
};

const callApi = ({ method, url, headers, reqHeaders, onTokenRefresh, responseType, data }) => {
  const sessionData = session.getSessionData(reqHeaders);
  if (sessionData == null) {
    const message = "Null session or missing jwt";
    log.error(message);
    throw new Error(message);
  }
  log.debug({ url, data }, 'Calling API');
  return axios({
    url,
    method,
    responseType,
    data,
    headers: getHeaders({ headers, reqHeaders, token: sessionData.access_token })
  }).catch(error => {
    if (error.response) {
      if (error.response.status === 401) {
        return service.refreshTokenRequest({ token: sessionData.refreshToken, headers, reqHeaders }).then(response => {
          onTokenRefresh(session.newJWT(response.data));
          return service.retryRequest({
            url,
            method,
            responseType,
            headers: getHeaders({ headers, reqHeaders, token: response.data.token })
          });
        });
      } else if (error.response.status === 404) {
        throw error;
      }
    }
    logError(url, error, 'Unexpected error caught in callApi');
    throw error;
  });
};

const refreshTokenRequest = ({ headers, reqHeaders, token }) => axios({
  method: 'post',
  url: 'oauth/token',
  headers: getClientHeaders({ headers, reqHeaders }),
  params: {
    grant_type: 'refresh_token',
    refresh_token: token
  }
});

const apiClientId = process.env.API_CLIENT_ID || 'elite2apiclient';
const apiClientSecret = process.env.API_CLIENT_SECRET || 'clientsecret';
const encodeClientCredentials = () => new Buffer(`${querystring.escape(apiClientId)}:${querystring.escape(apiClientSecret)}`).toString('base64');

const getClientHeaders = ({ headers, reqHeaders }) => Object.assign({}, headers, {
  "authorization": `Basic ${encodeClientCredentials()}`,
  'Content-Type': 'application/x-www-form-urlencoded',
  'access-control-allow-origin': reqHeaders.host
});

const service = {
  callApi,
  getRequest,
  postRequest,
  putRequest,
  refreshTokenRequest,
  retryRequest: (options) => axios(options),
  login: (req) => {
    const params = { ...req.query,
      grant_type: "password",
      scope: "write",
      client_id: apiClientId
    };
    return axios({
      method: 'post',
      url: '/oauth/token',
      headers: {
        ...req.headers,
        "authorization": `Basic ${encodeClientCredentials()}`,
        "Content-Type": 'application/x-www-form-urlencoded'
      },
      params: params,
      data: params
    });
  }
};

module.exports = service;
