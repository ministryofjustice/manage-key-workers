const log = require('../log');
const keyworkerApi = require('../keyworkerApi');
const logError = require('../logError').logError;
const properCaseName = require('../../src/stringUtils').properCaseName;

const addMissingKeyworkerDetails = async function (req, res, row) {
  try {
    req.query.staffId = row.staffId;
    const keyworkerResponse = await keyworkerApi.keyworker(req, res);
    const keyworkerData = keyworkerResponse.data;
    if (keyworkerData) {
      row.keyworkerDisplay = `${properCaseName(keyworkerData.lastName)}, ${properCaseName(keyworkerData.firstName)}`;
      row.numberAllocated = keyworkerData.numberAllocated;
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      log.info(`No keyworker found for staffId Id ${row.staffId} on offenderNo ${row.offenderNo}`);
      row.keyworkerDisplay = '--';
      row.numberAllocated = 'n/a';
    } else {
      logError(req.originalUrl, error, 'Error in addMissingKeyworkerDetails');
      throw error;
    }
  }
};

const addCrsaClassification = function (allCsras, row) {
  const details = allCsras.filter(details => details.offenderNo === row.offenderNo);
  if (details.length < 1) {
    return;
  }
  const detail = details[0];
  row.crsaClassification = detail && detail.classification;
};

const addReleaseDate = function (allReleaseDates, row) {
  const details = allReleaseDates.filter(details => details.offenderNo === row.offenderNo);
  if (details.length < 1) {
    return;
  }
  const detail = details[0];
  row.confirmedReleaseDate = detail && detail.sentenceDetail && detail.sentenceDetail.releaseDate;
};

const addKWCaseNoteDate = function (kwDates, row) {
  const details = kwDates.filter(details => details.offenderNo === row.offenderNo);
  if (details.length < 1) {
    return;
  }
  row.lastKeyWorkerSessionDate = details.reduce((m, v, i) => (v.latestCaseNote > m.latestCaseNote) && i ? v : m).latestCaseNote;
};

const offenderNoParamsSerializer = params => {
  s = '';
  for (const offenderNo of params) {
    s += 'offenderNo=' + offenderNo + '&';
  }
  return s;
};

module.exports = {
  addMissingKeyworkerDetails,
  addCrsaClassification,
  addReleaseDate,
  addKWCaseNoteDate,
  offenderNoParamsSerializer
};


