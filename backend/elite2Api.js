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

const service = {
  login, unallocated, allocated
};

module.exports = service;
