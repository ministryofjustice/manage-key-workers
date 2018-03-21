const express = require('express');
const router = express.Router();
const keyworkerApi = require('../keyworkerApi');
const asyncMiddleware = require('../middleware/asyncHandler');
const log = require('../log');

router.post('/', asyncMiddleware(async (req, res) => {
  const keyworker = req.body.keyworker;
  log.debug({ keyworker }, 'Key worker update contents');
  req.data = keyworker;
  const response = await keyworkerApi.keyworkerUpdate(req, res);
  log.debug({ response }, 'Response from keyworker update request');
  res.json({});
}));

module.exports = router;
