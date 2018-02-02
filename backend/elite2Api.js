const gateway = require('./gateway-api');

const login = (req) => gateway.login(req);

const unallocated = (req) => gateway.getRequest({
  req: req,
  method: 'get',
  url: `key-worker/${req.query.agencyId}/offenders/unallocated`
});

const allocated = (req) => gateway.getRequest({
  req: req,
  method: 'get',
  url: `key-worker/${req.query.agencyId}/allocations`
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


const updateReason = (req) => { return { data: "" };}; // Mocked out to return nothing for now

/*const updateReasonReal = (req) => gateway.putRequest({
  req: req,
  method: 'put',
  url: 'key-worker/update-reason'
});*/

const service = {
  login, unallocated, allocated, updateReason, availableKeyworkers, currentUser, sentenceDetail, assessment, keyworker
};

module.exports = service;
