const express = require('express');
const router = express.Router();
const keyworkerApi = require('../keyworkerApi');
const asyncMiddleware = require('../middleware/asyncHandler');
const log = require('../log');

router.get('/', asyncMiddleware(async (req, res) => {
  const response = await profile(req);
  res.json(response.data);
}));

const profile = async (req) => {
  console.log('Here');
  const response = await keyworkerApi.keyworker(req);
  console.log('\n\n\nkeyworker response: ' + response.data);
  log.debug({ data: response.data }, 'Response from keyworker request');
  response.data.statusDescription = statusDescriptionLookup(response.data.status);
  return response;
};


function statusDescriptionLookup (status) {
  switch (status) {
    case "ACTIVE":
      return "Active";
    default:
      return "";
  }
}

module.exports = {
  router,
  profile
};
