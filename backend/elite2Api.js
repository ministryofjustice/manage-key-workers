const gateway = require('./gateway-api');

const eliteApiUrl = process.env.API_ENDPOINT_URL || 'http://localhost:8080';

const login = (req) => gateway.login(req);

const csraList = (req, params, paramsSerializer) => gateway.getRequest({
  req: req,
  method: 'get',
  url: `${eliteApiUrl}api/offender-assessments/CSR`,
  params,
  paramsSerializer
});

const sentenceDetailList = (req, params, paramsSerializer) => gateway.getRequest({
  req: req,
  method: 'get',
  url: `${eliteApiUrl}api/offender-sentences`,
  params,
  paramsSerializer
});

const currentUser = (req) => gateway.getRequest({
  req: req,
  method: 'get',
  url: `${eliteApiUrl}api/users/me`
});

const userCaseLoads = (req) => gateway.getRequest({
  req: req,
  method: 'get',
  url: `${eliteApiUrl}api/users/me/caseLoads`
});

const setActiveCaseLoad = (req) => gateway.putRequest({
  req: req,
  method: 'put',
  url: `${eliteApiUrl}api/users/me/activeCaseLoad`
});


const service = {
  login, currentUser, userCaseLoads, setActiveCaseLoad, sentenceDetailList, csraList
};


module.exports = service;
