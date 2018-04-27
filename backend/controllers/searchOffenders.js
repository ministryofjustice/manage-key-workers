const express = require('express');
const router = express.Router();
const elite2Api = require('../elite2Api');
const keyworkerApi = require('../keyworkerApi');
const common = require('./common');
const asyncMiddleware = require('../middleware/asyncHandler');
const log = require('../log');
const properCaseName = require('../../src/stringUtils').properCaseName;

router.get('/', asyncMiddleware(async (req, res) => {
  const viewModel = await searchOffenders(req, res);
  res.json(viewModel);
}));

const searchOffenders = async (req, res) => {
  const allocationStatus = req.query.allocationStatus;
  let partialResults;

  const keyworkerResponse = await keyworkerApi.availableKeyworkers(req, res);
  const keyworkerData = keyworkerResponse.data;
  log.debug({ availableKeyworkers: keyworkerData }, 'Response from available keyworker request');

  const response = allocationStatus === 'all' ? await elite2Api.searchOffenders(req, res) : await elite2Api.searchOffendersWithoutResultLimit(req, res);
  let offenderResults = response.data;
  log.debug('Response from searchOffenders request', { searchOffenders: offenderResults });

  if (allocationStatus === 'all') {
    // we retrieve max + 1 results to indicate a partial result and remove one
    partialResults = (offenderResults && offenderResults.length) > elite2Api.offenderSearchResultMax;
    if (partialResults) {
      offenderResults.pop();
    }
  }

  if (offenderResults && offenderResults.length > 0) {
    req.data = getOffenderNoArray(offenderResults);
    const offenderKeyworkerResponse = await keyworkerApi.offenderKeyworkerList(req, res);
    const offenderKeyworkers = offenderKeyworkerResponse.data;
    log.debug({ data: offenderKeyworkers }, 'Response from getOffenders request');

    offenderResults = applyAllocationStatusFilter(allocationStatus, offenderResults, offenderKeyworkers); //adjust results if filtering by unallocated

    if (offenderResults.length > 0) {
      req.data = getOffenderNoArray(offenderResults);
      const sentenceDetailListResponse = await elite2Api.sentenceDetailList(req, res);
      const allReleaseDates = sentenceDetailListResponse.data;
      log.debug({ data: allReleaseDates }, 'Response from sentenceDetailList request');

      const csraListResponse = await elite2Api.csraList(req, res);
      const allCsras = csraListResponse.data;
      log.debug({ data: allCsras }, 'Response from csraList request');

      for (const row of offenderResults) {
        const details = offenderKeyworkers.filter(d => d.offenderNo === row.offenderNo);
        if (details.length >= 1) {
          const detail = details[0];
          row.staffId = detail && detail.staffId;
        }

        if (row.staffId) {
          const kw = keyworkerData.find(i => i.staffId === row.staffId);
          if (kw) { // eslint-disable-line max-depth
            row.keyworkerDisplay = `${properCaseName(kw.lastName)}, ${properCaseName(kw.firstName)}`;
            row.numberAllocated = kw.numberAllocated;
          } else {
            await common.addMissingKeyworkerDetails(req, res, row);
          }
        }

        common.addCrsaClassification(allCsras, row);
        common.addReleaseDate(allReleaseDates, row);
      }
    }
  }
  return {
    keyworkerResponse: keyworkerData,
    offenderResponse: offenderResults,
    partialResults: partialResults
  };
};


const applyAllocationStatusFilter = function (allocationStatus, currentOffenderResults, offenderKeyworkers) {
  let offenderResults = currentOffenderResults;
  if (allocationStatus === "unallocated") {
    offenderResults = offenderResults.filter(offender => !offenderKeyworkers.find(keyWorker => keyWorker.offenderNo === offender.offenderNo));
  } else if (allocationStatus === "allocated") {
    offenderResults = offenderResults.filter(offender => offenderKeyworkers.find(keyWorker => keyWorker.offenderNo === offender.offenderNo));
  }
  log.debug(`After allocation status filter of ${allocationStatus} - new offender list is:`, { searchOffenders: offenderResults });
  return offenderResults;
};

const getOffenderNoArray = function (offenderResults) {
  return offenderResults && offenderResults.length && offenderResults.map(row => row.offenderNo);
};

module.exports = {
  router,
  searchOffenders
};
