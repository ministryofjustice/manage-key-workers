const express = require('express');
const router = express.Router();
const keyworkerApi = require('../keyworkerApi');
const asyncMiddleware = require('../middleware/asyncHandler');
const log = require('../log');

router.get('/', asyncMiddleware(async (req, res) => {
  const response = await profile(req, res);
  res.json(response.data);
}));

const profile = async (req, res) => {
  const response = await keyworkerApi.keyworker(req, res);
  log.debug({ data: response.data }, 'Response from keyworker request');
  response.data.statusDescription = statusDescriptionLookup(response.data.status);
  return response;
};


function statusDescriptionLookup (status) {
  switch (status) {
    case "ACTIVE":
      return "Active";
    case "INACTIVE":
      return "Inactive";
    case "UNAVAILABLE_ANNUAL_LEAVE":
      return "Unavailable - annual leave";
    case "UNAVAILABLE_LONG_TERM_ABSENCE":
      return "Unavailable - long term absence";
    case "UNAVAILABLE_NO_PRISONER_CONTACT":
      return "Unavailable - no prisoner contact";
    case "UNAVAILABLE_SUSPENDED":
      return "Unavailable - suspended";
    default:
      return "";
  }
}

module.exports = {
  router,
  profile
};
