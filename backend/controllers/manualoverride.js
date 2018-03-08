/* eslint-disable no-unused-vars */
const express = require('express');
const router = express.Router();
const keyworkerApi = require('../keyworkerApi');
const asyncMiddleware = require('../middleware/asyncHandler');
// const moment = require('moment');
const log = require('../log');
// const isoDateTimeFormat = require('../constants').isoDateTimeFormat;

/* function getToday () {
  return moment().format(isoDateTimeFormat);
} */

router.post('/', asyncMiddleware(async (req, res) => {
  const allocateList = req.body.allocatedKeyworkers;
  log.debug({ allocateList }, 'Manual override contents');
  for (let element of allocateList) {
    if (element && element.staffId) {
      /* req.data = {
        active: true,
        agencyId: req.query.agencyId,
        allocationReason: "MANUAL",
        allocationType: "M",
        assigned: getToday(),
        offenderNo: element.offenderNo,
        staffId: element.staffId
      }; */
      req.data = {
        bookingId: element.bookingId,
        staffId: element.staffId,
        type: 'M',
        reason: 'override'
      };
      const response = await elite2Api.allocate(req);
      log.debug({ response }, 'Response from allocate request');
    }
  }
  res.json({});
}))
;

module.exports = router;
