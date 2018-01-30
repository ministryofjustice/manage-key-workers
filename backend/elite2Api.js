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
  url: 'key-worker/offenders/allocated'
});

const updateReason = (req) => { return { data: "" };}; // Mocked out to return nothing for now

/*const updateReasonReal = (req) => gateway.putRequest({
  req: req,
  method: 'put',
  url: 'key-worker/update-reason'
});*/

const service = {
  login, unallocated, allocated, updateReason
};

module.exports = service;
