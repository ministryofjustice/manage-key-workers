const express = require('express');
const router = express.Router();
const keyworkerApi = require('../keyworkerApi');
const asyncMiddleware = require('../middleware/asyncHandler');
const log = require('../log');

router.get('/', asyncMiddleware(async (req, res) => {
  const response = await keyworkerApi.keyworkerSearch(req, res);
  log.debug({ keyworkerSearch: response.data }, 'Response from keyworker search request');
  res.json(response.data);
}));

module.exports = router;
