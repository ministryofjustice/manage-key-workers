const gateway = require('./gateway-api');
const isoDateFormat = require('./constants').isoDateFormat;
const moment = require('moment');

const login = (req) => gateway.login(req);

const unallocated = (req) => gateway.getRequest({
  req: req,
  method: 'get',
  url: `api/key-worker/${req.query.agencyId}/offenders/unallocated`,
  headers: { 'Page-Limit': 200 }
});

const allocated = (req) => gateway.getRequest({
  req: req,
  method: 'get',
  url: `api/key-worker/${req.query.agencyId}/allocations`,
  headers: { 'Page-Limit': 200 }
});

const autoallocated = (req) => gateway.getRequest({
  req: req,
  method: 'get',
  url: `api/key-worker/${req.query.agencyId}/allocations?allocationType=A&fromDate=${formatDate(req.query.fromDate)}&toDate=${formatDate(req.query.toDate)}`,
  headers: { 'Page-Limit': 200 }
});

const searchOffenders = (req) => gateway.getRequest({
  req: req,
  method: 'get',
  url: req.query.keywords ? `api/locations/description/${req.query.locationPrefix}/inmates?keywords=${req.query.keywords}` : `api/locations/description/${req.query.locationPrefix}/inmates`,
  headers: { 'Page-Limit': 1000 }
  // NB response.headers['total-records']
});

const availableKeyworkers = (req) => gateway.getRequest({
  req: req,
  method: 'get',
  url: `api/key-worker/${req.query.agencyId}/available`
});

const keyworker = (req) => gateway.getRequest({
  req: req,
  method: 'get',
  url: `api/key-worker/${req.query.staffId}`
});

const csraList = (req, params, paramsSerializer) => gateway.getRequest({
  req: req,
  method: 'get',
  url: 'api/offender-assessments/CSR',
  params,
  paramsSerializer
});

const sentenceDetailList = (req, params, paramsSerializer) => gateway.getRequest({
  req: req,
  method: 'get',
  url: 'api/offender-sentences',
  params,
  paramsSerializer
});

const currentUser = (req) => gateway.getRequest({
  req: req,
  method: 'get',
  url: 'api/users/me'
});

const userCaseLoads = (req) => gateway.getRequest({
  req: req,
  method: 'get',
  url: 'api/users/me/caseLoads'
});

/* const keyworkerSearchresults = (req) => gateway.getRequest({
  req: req,
  method: 'get',
  url: `api/key-worker/${req.query.agencyId}/search`
}); */

const setActiveCaseLoad = (req) => gateway.putRequest({
  req: req,
  method: 'put',
  url: 'api/users/me/activeCaseLoad'
});

const allocate = (req) => gateway.postRequest({
  req: req,
  method: 'post',
  url: `api/key-worker/allocate`
});

const autoAllocate = (req) => gateway.postRequest({
  req: req,
  method: 'post',
  url: `api/key-worker/${req.query.agencyId}/allocate/start`
});

const keyworkerAllocations = (req) => gateway.getRequest({
  req: req,
  method: 'get',
  url: `api/key-worker/${req.query.staffId}/offenders`
});

const service = {
  login, unallocated, allocated, searchOffenders, availableKeyworkers, currentUser, userCaseLoads,
  setActiveCaseLoad, sentenceDetailList, csraList, keyworker,
  allocate, autoallocated, autoAllocate, keyworkerAllocations
};

function formatDate (inputDate) {
  return moment(inputDate, 'DD/MM/YYYY').format(isoDateFormat);
}

module.exports = service;
