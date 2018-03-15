const gateway = require('./gateway-api');

const eliteApiUrl = process.env.API_ENDPOINT_URL || 'http://localhost:8080/';

const login = (req) => gateway.login(req);

const userLocations = (req, res) => gateway.getRequest({
  req,
  res,
  method: 'get',
  url: `${eliteApiUrl}api/users/me/locations`
});

const searchOffenders = (req, res) => gateway.getRequest({
  req,
  res,
  method: 'get',
  url: req.query.keywords ? `${eliteApiUrl}api/locations/description/${req.query.locationPrefix}/inmates?keywords=${req.query.keywords}` : `${eliteApiUrl}api/locations/description/${req.query.locationPrefix}/inmates`,
  headers: { 'Page-Limit': 1000 }
  // NB response.headers['total-records']
});

const csraList = (req, res, params, paramsSerializer) => gateway.getRequest({
  req,
  res,
  method: 'get',
  url: `${eliteApiUrl}api/offender-assessments/CSR`,
  params,
  paramsSerializer
});

const sentenceDetailList = (req, res, params, paramsSerializer) => gateway.getRequest({
  req,
  res,
  method: 'get',
  url: `${eliteApiUrl}api/offender-sentences`,
  params,
  paramsSerializer
});

const currentUser = (req, res) => gateway.getRequest({
  req,
  res,
  method: 'get',
  url: `${eliteApiUrl}api/users/me`
});

const userCaseLoads = (req, res) => gateway.getRequest({
  req,
  res,
  method: 'get',
  url: `${eliteApiUrl}api/users/me/caseLoads`
});

const setActiveCaseLoad = (req, res) => gateway.putRequest({
  req,
  res,
  method: 'put',
  url: `${eliteApiUrl}api/users/me/activeCaseLoad`
});

const service = {
  // todo move keyworkerAllocation to keyworkerApi when endpoint moved in API service
  login, currentUser, userCaseLoads, userLocations, searchOffenders, setActiveCaseLoad, sentenceDetailList, csraList
};


module.exports = service;
