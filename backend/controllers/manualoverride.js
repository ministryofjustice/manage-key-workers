/* eslint-disable no-unused-vars */
const express = require('express');
const router = express.Router();
const keyworkerApi = require('../keyworkerApi');
const asyncMiddleware = require('../middleware/asyncHandler');
const moment = require('moment');
const log = require('../log');

function getToday () {
  return moment().format(isoDateFormat);
}

router.post('/', asyncMiddleware(async (req, res) => {
  const allocateList = req.body.allocatedKeyworkers;
  log.debug({ allocateList }, 'Manual override contents');
  for (let element of allocateList) {
    if (element && element.staffId) {
      req.data = {
        active: true,
        agencyId: req.query.agencyId,
        allocationReason: "override",
        allocationType: "M",
        assigned: getToday(),
        offenderNo: element.offenderNo,
        staffId: element.staffId
      };
      const response = await keyworkerApi.allocate(req);
      log.debug({ response }, 'Response from allocate request');
    }
  }
  res.json({});
}))
;

module.exports = router;
