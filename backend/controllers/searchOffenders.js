const express = require('express');
const router = express.Router();
const elite2Api = require('../elite2Api');
const asyncMiddleware = require('../middleware/asyncHandler');
const log = require('../log');

router.get('/', asyncMiddleware(async (req, res) => {
  const viewModel = await searchOffenders(req);
  res.json(viewModel);
}));

const searchOffenders = async (req) => {
  const response = await elite2Api.searchOffenders(req);

  log.debug({ searchOffenders: response }, 'Response from searchOffenders request');

  const data = response.data;
  //const allBookings = data && data.length && data.map(row => row.bookingId);
  // TODO temp until we have an allocationStatus service
  return data;

  /*const allocationStatusList = await elite2Api.allocationStatus(req, allBookings, common.bookingIdParamsSerializer);

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
