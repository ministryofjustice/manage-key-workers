const express = require('express');
const router = express.Router();
const elite2Api = require('../elite2Api');
const common = require('./common');
const asyncMiddleware = require('../middleware/asyncHandler');
const log = require('../log');

router.get('/', asyncMiddleware(async (req, res) => {
  const response = await unallocated(req);
  res.json(response.data);
}));

const unallocated = async (req) => {
  const unallocatedResponse = await elite2Api.unallocated(req);
  log.debug({ data: unallocatedResponse.data }, 'Response from unallocated offenders request');

  const unallocatedData = unallocatedResponse.data;
  for (const row of unallocatedData) {
    req.query.bookingId = row.bookingId;

    await common.addCrsaClassification(req, row);
    await common.addReleaseDate(req, row);
  }
  return unallocatedResponse;
};

module.exports = {
  router,
  unallocated
};
