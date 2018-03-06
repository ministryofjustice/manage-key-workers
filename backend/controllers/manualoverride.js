/* eslint-disable no-unused-vars */
const express = require('express');
const router = express.Router();
const keyworkerApi = require('../keyworkerApi');
const asyncMiddleware = require('../middleware/asyncHandler');
const log = require('../log');


router.post('/', asyncMiddleware(async (req, res) => {
  const allocateList = req.body.allocatedKeyworkers;
  log.debug({ allocateList }, 'Manual override contents');
  for (let element of allocateList) {
    if (element && element.staffId) {
      req.data = {
        bookingId: element.bookingId,
        staffId: element.staffId,
        type: 'M',
        reason: 'override'
      };
      const response = await keyworkerApi.allocate(req);
      log.debug({ response }, 'Response from allocate request');
    }
  }
  res.json({});
}))
;

module.exports = router;
