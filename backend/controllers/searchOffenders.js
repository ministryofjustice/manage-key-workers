const express = require('express');
const router = express.Router();
const elite2Api = require('../elite2Api');
const asyncMiddleware = require('../middleware/asyncHandler');
// const log = require('../log');
// const logError = require('../logError').logError;

router.get('/', asyncMiddleware(async (req, res) => {
  const viewModel = await searchOffenders(req);
  res.json(viewModel);
}));

const searchOffenders = async (req) => {
  const response = await elite2Api.searchOffenders(req).data;

  //const allBookings = response && response.length && response.map(row => row.bookingId);
  // TODO temp until we have an allocationStatus service
  return response;

  /*const allocationStatusList = await elite2Api.allocationStatus(req, allBookings, common.bookingIdParamsSerializer);

    log.debug({ searchOffenders: response }, 'Response from searchOffenders request');
    if (req.query.status) {
      return response.filter(t => {
        const details = allocationStatusList.filter(details => details.bookingId === row.bookingId);
        if (details.length < 1) {
          return false;
        }
        return t.allocationStatus === req.query.status;
      });
    }
    return response;*/
};

module.exports = {
  router,
  searchOffenders
};
