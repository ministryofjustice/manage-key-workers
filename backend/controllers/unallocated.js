const express = require('express');
const router = express.Router();
const elite2Api = require('../elite2Api');
const keyworkerApi = require('../keyworkerApi');
const common = require('./common');
const asyncMiddleware = require('../middleware/asyncHandler');
const log = require('../log');

router.get('/', asyncMiddleware(async (req, res) => {
  const response = await unallocated(req, res);
  res.json(response.data);
}));

const unallocated = async (req, res) => {
  const unallocatedResponse = await keyworkerApi.unallocated(req, res);
  const unallocatedData = unallocatedResponse.data;
  log.debug({ data: unallocatedData }, 'Response from unallocated offenders request');

  const allOffenders = unallocatedData.map(row => row.offenderNo);
  req.data = allOffenders;
  if (allOffenders.length > 0) {
    const sentenceDetailListResponse = await elite2Api.sentenceDetailList(req, res);
    const allReleaseDates = sentenceDetailListResponse.data;
    log.debug({ data: allReleaseDates }, 'Response from sentenceDetailList request');

    const csraListResponse = await elite2Api.csraList(req, res);
    const allCsras = csraListResponse.data;
    log.debug({ data: allCsras }, 'Response from csraList request');

    for (const row of unallocatedData) {
      common.addCrsaClassification(allCsras, row);
      common.addReleaseDate(allReleaseDates, row);
    }
  }
  return unallocatedResponse;
};

module.exports = {
  router,
  unallocated
};
