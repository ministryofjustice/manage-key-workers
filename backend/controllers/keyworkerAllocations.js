const express = require('express');
const router = express.Router();
// const elite2Api = require('../elite2Api');
const asyncMiddleware = require('../middleware/asyncHandler');

router.get('/', asyncMiddleware(async (req, res) => {
  // const response = await elite2Api.keyworkerSearch(req);
  res.json(createTestDataResponse().data);
}));

function createTestDataResponse () {
  return {
    data: [
      {
        bookingId: -1,
        offenderNo: "A1234AA",
        firstName: "ARTHUR",
        lastName: "ANDERSON",
        agencyId: "LEI",
        internalLocationDesc: "A-1-1"
      },
      {
        bookingId: -2,
        offenderNo: "A1234AB",
        firstName: "GILLIAN",
        lastName: "ANDERSON",
        agencyId: "LEI",
        internalLocationDesc: "H-1-5"
      }
    ]
  };
}

module.exports = router;
