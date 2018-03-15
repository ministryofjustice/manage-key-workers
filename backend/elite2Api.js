const gateway = require('./gateway-api');

const eliteApiUrl = process.env.API_ENDPOINT_URL || 'http://localhost:8080/';

const login = (req) => gateway.login(req);

const userLocations = (req) => gateway.getRequest({
  req: req,
  method: 'get',
  url: `${eliteApiUrl}api/users/me/locations`
});

const searchOffenders = (req) => gateway.getRequest({
  req: req,
  method: 'get',
  url: req.query.keywords ? `${eliteApiUrl}api/locations/description/${req.query.locationPrefix}/inmates?keywords=${req.query.keywords}` : `${eliteApiUrl}api/locations/description/${req.query.locationPrefix}/inmates`,
  headers: { 'Page-Limit': 1000 }
  // NB response.headers['total-records']
});

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

const allocate = (req) => gateway.postRequest({
  req: req,
  method: 'post',
  url: `${eliteApiUrl}api/key-worker/allocate`
});


const service = {
  // todo move keyworkerAllocation to keyworkerApi when endpoint moved in API service
  login, currentUser, userCaseLoads, userLocations, searchOffenders, setActiveCaseLoad, sentenceDetailList, csraList, allocate
};


module.exports = service;
