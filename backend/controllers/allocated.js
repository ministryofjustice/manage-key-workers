const properCaseName = require('../../src/stringUtils').properCaseName;
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

function warning (error) {
  if (error.response && error.response.data) {
    const msg = error.response.data.userMessage;
    if (msg === 'No Key workers available for allocation.' ||
      msg === 'All available Key workers are at full capacity.') {
      return msg;
    }
  }
  return null;
}

const allocated = async (req, res) => {
  let insufficientKeyworkers = '';
  try {
    await keyworkerApi.autoAllocate(req, res);
  } catch (error) {
    const msg = warning(error);
    if (msg) {
      log.warn({ data: error.response }, 'Caught warning');
      insufficientKeyworkers = msg;
    } else {
      throw error;
    }
  }
  const keyworkerResponse = await keyworkerApi.availableKeyworkers(req, res);
  const keyworkerData = keyworkerResponse.data;
  log.debug({ availableKeyworkers: keyworkerData }, 'Response from available keyworker request');

  const allocatedResponse = await keyworkerApi.autoallocated(req, res);
  const allocatedData = allocatedResponse.data;
  log.debug({ offenders: allocatedData }, 'Response from allocated offenders request');
  if (telemetry) {
    telemetry.trackEvent({ name: "Auto allocation" });
  } // Example of app insight custom event

  const allOffenders = allocatedData.map(row => row.offenderNo);
  if (allOffenders.length > 0) {
    req.data = allOffenders;
    const sentenceDetailListResponse = await elite2Api.sentenceDetailList(req, res);
    const allReleaseDates = sentenceDetailListResponse.data;
    log.debug({ data: allReleaseDates }, 'Response from sentenceDetailList request');

    const csraListResponse = await elite2Api.csraList(req, res);
    const allCsras = csraListResponse.data;
    log.debug({ data: allCsras }, 'Response from csraList request');

    for (const row of allocatedData) {
      const kw = keyworkerData.find(i => i.staffId === row.staffId);
      if (kw) {
        row.keyworkerDisplay = `${properCaseName(kw.lastName)}, ${properCaseName(kw.firstName)}`;
        row.numberAllocated = kw.numberAllocated;
      } else {
        await common.addMissingKeyworkerDetails(req, res, row);
      }
      common.addCrsaClassification(allCsras, row);
      common.addReleaseDate(allReleaseDates, row);
    }
  }
  return {
    keyworkerResponse: keyworkerResponse.data,
    allocatedResponse: allocatedResponse.data,
    warning: insufficientKeyworkers
  };
};

module.exports = {
  router,
  allocated
};
