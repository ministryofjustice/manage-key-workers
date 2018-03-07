const express = require('express');
const router = express.Router();
const elite2Api = require('../elite2Api');
const common = require('./common');
const asyncMiddleware = require('../middleware/asyncHandler');
const log = require('../log');

router.get('/', asyncMiddleware(async (req, res) => {
  const viewModel = await keyworkerAllocations(req);
  res.json(viewModel);
}));

const keyworkerAllocations = async (req) => {
  const keyworkerResponse = await elite2Api.availableKeyworkers(req);
  log.debug({ data: keyworkerResponse.data }, 'Response from availableKeyworkers request');
  const allocatedResponse = await elite2Api.keyworkerAllocations(req);
  const tableData = allocatedResponse.data;
  log.debug({ data: tableData }, 'Response from keyworkerAllocations request');

  const alloffenders = tableData.map(row => row.offenderNo);
  const sentenceDetailListResponse = await elite2Api.sentenceDetailList(req, alloffenders, common.offenderNoParamsSerializer);
  const allReleaseDates = sentenceDetailListResponse.data;
  log.debug({ data: allReleaseDates }, 'Response from sentenceDetailList request');

  const allBookings = tableData.map(row => row.bookingId);
  const csraListResponse = await elite2Api.csraList(req, allBookings, common.bookingIdParamsSerializer);
  const allCsras = csraListResponse.data;
  log.debug({ data: allCsras }, 'Response from csraList request');

  for (const row of tableData) {
    common.addCrsaClassification(allCsras, row);
    common.addReleaseDate(allReleaseDates, row);
  }

  return {
    keyworkerResponse: keyworkerResponse.data,
    allocatedResponse: allocatedResponse.data
  };
};

module.exports = {
  router,
  keyworkerAllocations
};
