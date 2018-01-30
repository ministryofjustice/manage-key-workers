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

const availableKeyworkers = (req) => new Promise(callback => {
  callback({ data: [{
    staffId: 123,
    firstName: 'Amy',
    lastName: 'Hanson',
    numberAllocated: 4
  },
  {
    staffId: -1,
    firstName: 'James',
    lastName: 'Nesbit',
    numberAllocated: 1
  },
  {
    staffId: -2,
    firstName: 'Clem',
    lastName: 'Fandango',
    numberAllocated: 7
  }
  ] });
});


const updateReason = (req) => { return { data: "" };}; // Mocked out to return nothing for now

/*const updateReasonReal = (req) => gateway.putRequest({
  req: req,
  method: 'put',
  url: 'key-worker/update-reason'
});*/

const service = {
  login, unallocated, allocated, updateReason, availableKeyworkers
};

module.exports = service;
