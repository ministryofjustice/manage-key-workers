const express = require('express');
const router = express.Router();
const elite2Api = require('../elite2Api');
const common = require('./common');
const asyncMiddleware = require('../middleware/asyncHandler');
const log = require('../log');
const telemetry = require('../azure-appinsights');

router.get('/', asyncMiddleware(async (req, res) => {
  const viewModel = await allocated(req);
  res.json(viewModel);
}));

const allocated = async (req) => {
  await elite2Api.autoAllocate(req);

  const keyworkerResponse = await elite2Api.availableKeyworkers(req);
  log.debug({ availableKeyworkers: keyworkerResponse.data }, 'Response from available keyworker request');

  const allocatedResponse = await elite2Api.autoallocated(req);
  log.debug({ availableKeyworkers: allocatedResponse.data }, 'Response from allocated offenders request');
  if (telemetry) {
    telemetry.trackEvent({ name: "Auto allocation" });
  } // Example of app insight custom event

  let allocatedData = allocatedResponse.data;
  const keyworkerData = keyworkerResponse.data;
  for (let row of allocatedData) {
    let kw = keyworkerData.find(i => i.staffId === row.staffId);
    if (kw) {
      row.keyworkerDisplay = `${kw.lastName}, ${kw.firstName}`;
      row.numberAllocated = kw.numberAllocated;
    } else {
      await common.addMissingKeyworkerDetails(req, row);
    }
    req.query.bookingId = row.bookingId;

    await Promise.all([common.addCrsaClassification(req, row), common.addReleaseDate(req, row)]);
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


