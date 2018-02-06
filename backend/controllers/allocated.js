/* eslint-disable no-unused-vars */
const express = require('express');
const router = express.Router();
const elite2Api = require('../elite2Api');
const asyncMiddleware = require('../middleware/asyncHandler');
const log = require('../log');


router.get('/', asyncMiddleware(async (req, res) => {
  const viewModel = await allocated(req);
  res.json(viewModel);
}));

const allocated = async (req) => {
  const keyworkerResponse = await elite2Api.availableKeyworkers(req);
  log.debug({ availableKeyworkers: keyworkerResponse.data }, 'Response from available keyworker request');

  const allocatedResponse = await elite2Api.autoallocated(req);
  log.debug({ availableKeyworkers: allocatedResponse.data }, 'Response from allocated offenders request');

  let allocatedData = allocatedResponse.data;
  const keyworkerData = keyworkerResponse.data;
  for (let row of allocatedData) {
    let kw = keyworkerData.find(i => i.staffId === row.staffId);
    if (kw) {
      row.keyworkerDisplay = `${kw.lastName}, ${kw.firstName}`;
      row.numberAllocated = kw.numberAllocated;
    } else {
      // TODO wire up
      row.keyworkerDisplay = '--';
      row.numberAllocated = '999';
    }
    req.query.bookingId = row.bookingId;

    await addCrsaClassification(req, row);
    await addReleaseDate(req, row);
  }
  return {
    keyworkerResponse: keyworkerResponse.data,
    allocatedResponse: allocatedResponse.data
  };
};

async function addCrsaClassification (req, row) {
  try {
    const assessmentResponse = await elite2Api.assessment(req);
    log.debug(`Assessment for booking ${row.bookingId} = ${assessmentResponse.data.classification}`);
    row.crsaClassification = assessmentResponse.data.classification ? assessmentResponse.data.classification : '--';
  } catch (error) {
    if (error.response.status === 404) {
      log.info(`No assessment found for booking Id ${row.bookingId}`);
      row.crsaClassification = '--';
    } else {
      throw error;
    }
  }
}

async function addReleaseDate (req, row) {
  try {
    const sentenceResponse = await elite2Api.sentenceDetail(req);
    row.confirmedReleaseDate = sentenceResponse.data.confirmedReleaseDate ? sentenceResponse.data.confirmedReleaseDate : '--';
    log.debug(`release date for offender ${row.offenderNo} = ${row.confirmedReleaseDate}`);
  } catch (error) {
    if (error.response.status === 404) {
      log.error(`No sentence detail found for booking Id ${row.bookingId}`);
      row.confirmedReleaseDate = '--';
    } else {
      throw error;
    }
  }
}

async function addUnavailableKeyworker (req, row) {
  try {
    const keyworkerResponse = await elite2Api.keyworker(req);
    row.keyworkerDisplay = `${keyworkerResponse.data.lastName}, ${keyworkerResponse.data.firstName}`;
    log.debug(`keyworker for booking ${row.bookingId} = ${row.keyworkerDisplay}`);
  } catch (error) {
    if (error.response.status === 404) {
      log.info(`No keyworker found for booking Id ${row.bookingId}`);
      row.keyworkerDisplay = '--';
    } else {
      throw error;
    }
  }
}

module.exports = {
  router,
  allocated
};


