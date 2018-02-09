const log = require('../log');
const elite2Api = require('../elite2Api');

const addMissingKeyworkerDetails = async function (req, row) {
  try {
    req.query.staffId = row.staffId;
    const keyworkerResponse = await elite2Api.keyworker(req);
    const keyworkerData = keyworkerResponse.data;
    log.debug(`keyworker for booking ${row.bookingId} = ${keyworkerResponse.data}`);
    row.keyworkerDisplay = `${keyworkerData.lastName}, ${keyworkerData.firstName}`;
    row.numberAllocated = keyworkerData.numberAllocated;
  } catch (error) {
    if (error.response.status === 404) {
      log.info(`No keyworker found for staffId Id ${row.staffId} on booking ${row.bookingId}`);
      row.keyworkerDisplay = '--';
      row.numberAllocated = 'n/a';
    } else {
      log.error('Error in addMissingKeyworkerDetails' + error);
      throw error;
    }
  }
};

const addCrsaClassification = async function (req, row) {
  try {
    const assessmentResponse = await elite2Api.assessment(req);
    log.debug(`Assessment for booking ${row.bookingId} = ${assessmentResponse.data.classification}`);
    row.crsaClassification = assessmentResponse.data.classification ? assessmentResponse.data.classification : '--';
  } catch (error) {
    if (error.response.status === 404) {
      log.debug(`No assessment found for booking Id ${row.bookingId}`);
      row.crsaClassification = '--';
    } else {
      log.error('Error in addCrsaClassification' + error);
      throw error;
    }
  }
};

const addReleaseDate = async function (req, row) {
  try {
    const sentenceResponse = await elite2Api.sentenceDetail(req);
    row.confirmedReleaseDate = sentenceResponse.data.confirmedReleaseDate ? sentenceResponse.data.confirmedReleaseDate : '--';
    log.debug(`release date for offender ${row.offenderNo} = ${row.confirmedReleaseDate}`);
  } catch (error) {
    if (error.response.status === 404) {
      log.debug(`No sentence detail found for booking Id ${row.bookingId}`);
      row.confirmedReleaseDate = '--';
    } else {
      log.error('Error in addReleaseDate' + error);
      throw error;
    }
  }
};

module.exports = {
  addMissingKeyworkerDetails,
  addCrsaClassification,
  addReleaseDate
};


