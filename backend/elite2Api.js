const gateway = require('./gateway-api');

const login = (req) => gateway.login(req);

const unallocated = (req) => gateway.getRequest({
  method: 'get',
  url: 'key-worker/offenders/unallocated',
  headers: {}
});

const service = { 
   login,unallocated
};

module.exports = service;