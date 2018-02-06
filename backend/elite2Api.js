const gateway = require('./gateway-api');

const login = (req) => gateway.login(req);

const unallocated = (req) => gateway.getRequest({
  req: req,
  method: 'get',
  url: `key-worker/${req.query.agencyId}/offenders/unallocated`,
  headers: { 'Page-Limit': 200 }
});

const allocated = (req) => gateway.getRequest({
  req: req,
  method: 'get',
  url: `key-worker/${req.query.agencyId}/allocations`,
  headers: { 'Page-Limit': 200 }
});

const availableKeyworkers = (req) => gateway.getRequest({
  req: req,
  method: 'get',
  url: `key-worker/${req.query.agencyId}/available`
});

const keyworker = (req) => gateway.getRequest({
  req: req,
  method: 'get',
  url: `key-worker/${req.query.staffId}`
});

const assessment = (req) => gateway.getRequest({
  req: req,
  method: 'get',
  url: `bookings/${req.query.bookingId}/assessment/CSR`
});

const sentenceDetail = (req) => gateway.getRequest({
  req: req,
  method: 'get',
  url: `bookings/${req.query.bookingId}/sentenceDetail`
});

const currentUser = (req) => gateway.getRequest({
  req: req,
  method: 'get',
  url: 'users/me'
});

const service = {
  login, unallocated, allocated, availableKeyworkers, currentUser, sentenceDetail, assessment, keyworker
};

module.exports = service;
