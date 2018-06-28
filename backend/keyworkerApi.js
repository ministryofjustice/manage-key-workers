const gateway = require('./gateway-api');

const keyworkerApiUrl = process.env.KEYWORKER_API_URL || 'http://localhost:8081/';

const unallocated = (req, res) => gateway.getRequest({
  req,
  res,
  method: 'get',
  url: `${keyworkerApiUrl}key-worker/${req.query.agencyId}/offenders/unallocated`,
  service: 'keyworker'
});

const allocated = (req, res) => gateway.getRequest({
  req,
  res,
  method: 'get',
  url: `${keyworkerApiUrl}key-worker/${req.query.agencyId}/allocations`
});

const autoallocated = (req, res) => gateway.getRequest({
  req,
  res,
  method: 'get',
  url: `${keyworkerApiUrl}key-worker/${req.query.agencyId}/allocations?allocationType=P`
});

const availableKeyworkers = (req, res) => gateway.getRequest({
  req,
  res,
  method: 'get',
  url: `${keyworkerApiUrl}key-worker/${req.query.agencyId}/available`
});

const offenderKeyworkerList = (req, res) => gateway.postRequest({
  req,
  res,
  method: 'post',
  url: `${keyworkerApiUrl}key-worker/${req.query.agencyId}/offenders`
});

const keyworker = (req, res) => gateway.getRequest({
  req,
  res,
  method: 'get',
  url: `${keyworkerApiUrl}key-worker/${req.query.staffId}/prison/${req.query.agencyId}`
});

const keyworkerSearch = (req, { agencyId, searchText, statusFilter }, res) => gateway.getRequest({
  req,
  res,
  params: {
    nameFilter: encodeQueryString(searchText),
    statusFilter
  },
  method: 'get',
  url: `${keyworkerApiUrl}key-worker/${agencyId}/members`
});

const allocate = (req, res) => gateway.postRequest({
  req,
  res,
  method: 'post',
  url: `${keyworkerApiUrl}key-worker/allocate`
});

const deallocate = (req, res) => gateway.putRequest({
  req,
  res,
  method: 'put',
  url: `${keyworkerApiUrl}key-worker/deallocate/${req.data.offenderNo}`
});

const allocationHistory = (req, res) => gateway.getRequest({
  req,
  res,
  method: 'get',
  url: `${keyworkerApiUrl}key-worker/allocation-history/${req.query.offenderNo}`
});

const keyworkerUpdate = (req, res) => gateway.postRequest({
  req,
  res,
  method: 'post',
  url: `${keyworkerApiUrl}key-worker/${req.query.staffId}/prison/${req.query.agencyId}`
});

const autoAllocate = (req, res) => gateway.postRequest({
  req,
  res,
  method: 'post',
  url: `${keyworkerApiUrl}key-worker/${req.query.agencyId}/allocate/start`
});

const autoAllocateConfirm = (req, res) => gateway.postRequest({
  req,
  res,
  method: 'post',
  url: `${keyworkerApiUrl}key-worker/${req.query.agencyId}/allocate/confirm`
});

const keyworkerAllocations = (req, res) => gateway.getRequest({
  req,
  res,
  method: 'get',
  url: `${keyworkerApiUrl}key-worker/${req.query.staffId}/prison/${req.query.agencyId}/offenders`
});

const service = {
  unallocated,
  allocated,
  offenderKeyworkerList,
  availableKeyworkers,
  keyworker,
  allocate,
  deallocate,
  allocationHistory,
  autoallocated,
  autoAllocate,
  autoAllocateConfirm,
  keyworkerAllocations,
  keyworkerSearch,
  keyworkerUpdate,
  keyworkerApiUrl
};

function encodeQueryString (input) {
  return encodeURIComponent(input);
}

module.exports = service;
