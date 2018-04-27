const gateway = require('./gateway-api');

const eliteApiUrl = process.env.API_ENDPOINT_URL || 'http://localhost:8080/';
const offenderSearchResultMax = process.env.OFFENDER_SEARCH_RESULT_MAX || 50;

const login = (req) => gateway.login(req);

const userLocations = (req, res) => gateway.getRequest({
  req,
  res,
  method: 'get',
  url: `${eliteApiUrl}api/users/me/locations`
});

const searchOffenders = (req, res) => gateway.getRequest({
  req,
  res,
  method: 'get',
  url: req.query.keywords ?
    `${eliteApiUrl}api/locations/description/${req.query.locationPrefix}/inmates?keywords=${encodeQueryString(req.query.keywords)}` :
    `${eliteApiUrl}api/locations/description/${req.query.locationPrefix}/inmates`,
  headers: { 'Page-Limit': (parseInt(offenderSearchResultMax, 10) + 1) }
  // NB response.headers['total-records']
});

const searchOffendersWithoutResultLimit = (req, res) => gateway.getRequest({
  req,
  res,
  method: 'get',
  url: req.query.keywords ?
    `${eliteApiUrl}api/locations/description/${req.query.locationPrefix}/inmates?keywords=${encodeQueryString(req.query.keywords)}` :
    `${eliteApiUrl}api/locations/description/${req.query.locationPrefix}/inmates`
});

const csraList = (req, res) => gateway.postRequest({
  req,
  res,
  method: 'post',
  url: `${eliteApiUrl}api/offender-assessments/CSR`
});

const sentenceDetailList = (req, res) => gateway.postRequest({
  req,
  res,
  method: 'post',
  url: `${eliteApiUrl}api/offender-sentences`
});

const currentUser = (req, res) => gateway.getRequest({
  req,
  res,
  method: 'get',
  url: `${eliteApiUrl}api/users/me`
});

const userCaseLoads = (req, res) => gateway.getRequest({
  req,
  res,
  method: 'get',
  url: `${eliteApiUrl}api/users/me/caseLoads`
});

const setActiveCaseLoad = (req, res) => gateway.putRequest({
  req,
  res,
  method: 'put',
  url: `${eliteApiUrl}api/users/me/activeCaseLoad`
});

const service = {
  login, currentUser, userCaseLoads, userLocations, searchOffenders, searchOffendersWithoutResultLimit, setActiveCaseLoad, sentenceDetailList, csraList, offenderSearchResultMax
};

function encodeQueryString (input) {
  return encodeURIComponent(input);
}

module.exports = service;
