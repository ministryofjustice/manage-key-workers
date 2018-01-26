const gateway = require('./gateway-api');

const login = (req) => gateway.login(req);

const unallocated = (req) => gateway.getRequest({
  req: req,
  method: 'get',
  url: 'key-worker/offenders/unallocated'
});

const service = {
  login, unallocated
};

module.exports = service;
