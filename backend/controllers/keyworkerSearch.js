const express = require('express');
const router = express.Router();
const keyworkerApi = require('../keyworkerApi');
const asyncMiddleware = require('../middleware/asyncHandler');
const log = require('../log');

router.get('/', asyncMiddleware(async (req, res) => {
  const { agencyId, searchText, statusFilter } = req.query;
  const response = await keyworkerApi.keyworkerSearch(req,
    {
      agencyId,
      searchText,
      statusFilter
    },
    res);
  log.debug({ keyworkerSearch: response.data }, 'Response from keyworker search request');
  res.json(response.data);
}));

module.exports = router;
