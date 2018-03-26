const express = require('express');
const router = express.Router();
const elite2Api = require('../elite2Api');
const keyworkerApi = require('../keyworkerApi');
const common = require('./common');
const asyncMiddleware = require('../middleware/asyncHandler');
const log = require('../log');
const telemetry = require('../azure-appinsights');

router.get('/', asyncMiddleware(async (req, res) => {
  const viewModel = await allocated(req, res);
  res.json(viewModel);
}));

const allocated = async (req, res) => {
  await keyworkerApi.autoAllocate(req, res);

  const keyworkerResponse = await keyworkerApi.availableKeyworkers(req, res);
  const keyworkerData = keyworkerResponse.data;
  log.debug({ availableKeyworkers: keyworkerData }, 'Response from available keyworker request');

  const allocatedResponse = await keyworkerApi.autoallocated(req, res);
  const allocatedData = allocatedResponse.data;
  log.debug({ availableKeyworkers: allocatedData }, 'Response from allocated offenders request');
  if (telemetry) {
    telemetry.trackEvent({ name: "Auto allocation" });
  } // Example of app insight custom event

  const allOffenders = allocatedData.map(row => row.offenderNo);
  const sentenceDetailListResponse = await elite2Api.sentenceDetailList(req, res, allOffenders, common.offenderNoParamsSerializer);
  const allReleaseDates = sentenceDetailListResponse.data;
  log.debug({ data: allReleaseDates }, 'Response from sentenceDetailList request');

  const csraListResponse = await elite2Api.csraList(req, res, allOffenders, common.offenderNoParamsSerializer);
  const allCsras = csraListResponse.data;
  log.debug({ data: allCsras }, 'Response from csraList request');

  for (const row of allocatedData) {
    const kw = keyworkerData.find(i => i.staffId === row.staffId);
    if (kw) {
      row.keyworkerDisplay = `${kw.lastName}, ${kw.firstName}`;
      row.numberAllocated = kw.numberAllocated;
    } else {
      await common.addMissingKeyworkerDetails(req, res, row);
    }
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
  allocated
};
