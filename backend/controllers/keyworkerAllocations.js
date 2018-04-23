const express = require('express');
const router = express.Router();
const keyworkerApi = require('../keyworkerApi');
const elite2Api = require('../elite2Api');
const common = require('./common');
const asyncMiddleware = require('../middleware/asyncHandler');
const log = require('../log');

router.get('/', asyncMiddleware(async (req, res) => {
  const viewModel = await keyworkerAllocations(req, res);
  res.json(viewModel);
}));

const keyworkerAllocations = async (req, res) => {
  const keyworkerResponse = await keyworkerApi.availableKeyworkers(req, res);
  log.debug({ data: keyworkerResponse.data }, 'Response from availableKeyworkers request');
  const allocatedResponse = await keyworkerApi.keyworkerAllocations(req, res);
  const tableData = allocatedResponse.data;
  log.debug({ data: tableData }, 'Response from keyworkerAllocations request');

  const allOffenders = tableData.map(row => row.offenderNo);
  if (allOffenders.length > 0) {
    req.data = allOffenders; //used by following 2 api calls
    const sentenceDetailListResponse = await elite2Api.sentenceDetailList(req, res);
    const allReleaseDates = sentenceDetailListResponse.data;
    log.debug({ data: allReleaseDates }, 'Response from sentenceDetailList request');

    const csraListResponse = await elite2Api.csraList(req, res);
    const allCsras = csraListResponse.data;
    log.debug({ data: allCsras }, 'Response from csraList request');

    for (const row of tableData) {
      common.addCrsaClassification(allCsras, row);
      common.addReleaseDate(allReleaseDates, row);
    }
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
