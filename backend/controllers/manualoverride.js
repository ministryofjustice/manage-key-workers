const express = require('express');
const router = express.Router();
const keyworkerApi = require('../keyworkerApi');
const asyncMiddleware = require('../middleware/asyncHandler');
const log = require('../log');

router.post('/', asyncMiddleware(async (req, res) => {
  const allocateList = req.body.allocatedKeyworkers;
  log.debug({ allocateList }, 'Manual override contents');
  for (const element of allocateList) {
    if (element && element.staffId) {
      if (element.deallocate) {
        req.data = {
          offenderNo: element.offenderNo,
          staffId: element.staffId,
          prisonId: req.query.agencyId,
          deallocationReason: 'MANUAL'
        };
        const response = await keyworkerApi.deallocate(req, res);
        log.debug({ response }, 'Response from deallocate request');
      } else {
        req.data = {
          offenderNo: element.offenderNo,
          staffId: element.staffId,
          prisonId: req.query.agencyId,
          allocationType: 'M',
          allocationReason: 'MANUAL',
          deallocationReason: 'OVERRIDE'
        };
        const response = await keyworkerApi.allocate(req, res);
        log.debug({ response }, 'Response from allocate request');
      }
    }
  }
  res.json({});
}));

module.exports = router;
