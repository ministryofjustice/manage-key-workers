const gateway = require('./gateway-api');

const login = (req) => gateway.login(req);

const unallocated = (req) => gateway.getRequest({
  req: req,
  method: 'get',
  url: 'key-worker/offenders/unallocated'
});

const allocated = (req) => gateway.getRequest({
  req: req,
  method: 'get',
  url: `key-worker/offenders/allocated?agencyId=${req.query.agencyId}`
});

const availableKeyworkers = (req) => gateway.getRequest({
  req: req,
  method: 'get',
  url: `key-worker/${req.query.agencyId}/available`
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
  login, unallocated, allocated, updateReason, availableKeyworkers, currentUser
};

module.exports = service;
