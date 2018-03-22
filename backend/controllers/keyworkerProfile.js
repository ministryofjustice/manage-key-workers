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
  return response;
};

module.exports = {
  router,
  profile
};
