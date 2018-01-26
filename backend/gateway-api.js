const axios = require('axios');
const session = require('./session');
const useApiAuth = (process.env.USE_API_GATEWAY_AUTH || 'no') === 'yes';
const jwt = require('jsonwebtoken');

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
  onTokenRefresh: (token) => { req.headers.jwt = token },
});

const postRequest =  ({ req, url, headers }) => service.callApi({
  method: 'post',
  url,
  headers: headers || {},
  reqHeaders: req.headers,
  data: req.data,
  onTokenRefresh: (token) => { req.headers.jwt = token },
});

const callApi = ({ method, url, headers, reqHeaders, onTokenRefresh, responseType, data }) => {
  const { token, refreshToken } = session.getSessionData(reqHeaders);

  return axios({
    url,
    method,
    responseType,
    data,
    headers: getHeaders({ headers, reqHeaders, token }),
  }).catch(error => {
    if (error.response.status === 401) {
      return service.refreshTokenRequest({ token: refreshToken, headers, reqHeaders }).then(response => {
        onTokenRefresh(session.newJWT(response.data));
        return service.retryRequest({
          url,
          method,
          responseType,
          headers: getHeaders({ headers, reqHeaders, token: response.data.token }),
        });
      })
    }
    throw error;
  });
};

const refreshTokenRequest = ({ headers, reqHeaders, token }) => axios({
  method: 'post',
  url: '/users/token',
  headers: getHeaders({ headers, reqHeaders, token }),
});

const getHeaders = ({ headers, reqHeaders, token }) => Object.assign({}, headers, {
  authorization: token,
  'access-control-allow-origin': reqHeaders.host,
});


function gatewayToken() {
    const nomsToken = process.env.NOMS_TOKEN;
    const milliseconds = Math.round((new Date()).getTime() / 1000);
    const payload = {
      iat: milliseconds,
      token: nomsToken,
    };
    const privateKey = process.env.NOMS_PRIVATE_KEY || '';
    const cert = new Buffer(privateKey);
    return jwt.sign(payload, cert, { algorithm: 'ES256' });
  }

const service = {
  callApi,
  getRequest,
  postRequest,
  refreshTokenRequest,
  retryRequest: (options) => axios(options),
  login: (req) => axios({
    method: 'post',
    url: '/users/login',
    data: req.body,
  })
};

module.exports = service;