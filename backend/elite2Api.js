const gateway = require('./gateway-api');

const eliteApiUrl = process.env.API_ENDPOINT_URL || 'http://localhost:8080/';

const login = (req) => gateway.login(req);

const keyworkerAllocations = (req) => gateway.getRequest({
  req: req,
  method: 'get',
  url: `${eliteApiUrl}api/key-worker/${req.query.staffId}/offenders`
});

const searchOffenders = (req) => gateway.getRequest({
  req: req,
  method: 'get',
  url: req.query.keywords ? `api/locations/description/${req.query.locationPrefix}/inmates?keywords=${req.query.keywords}` : `api/locations/description/${req.query.locationPrefix}/inmates`,
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
  login, currentUser, userCaseLoads, searchOffenders, setActiveCaseLoad, sentenceDetailList, csraList, keyworkerAllocations, allocate
};


module.exports = service;
