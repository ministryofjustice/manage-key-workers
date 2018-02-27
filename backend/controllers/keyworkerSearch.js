const express = require('express');
const router = express.Router();
// const elite2Api = require('../elite2Api');
const asyncMiddleware = require('../middleware/asyncHandler');

router.get('/', asyncMiddleware(async (req, res) => {
  // const response = await elite2Api.keyworkerSearch(req);
  res.json(createTestDataResponse(req.query.searchText).data);
}));

function createTestDataResponse (type) {
  if (type === 'noresults') {
    return {
      data: []
    };
  }
  return {
    data: [
      {
        staffId: 2,
        firstName: 'Brent',
        lastName: 'Daggart',
        numberAllocated: 3,
        status: "active",
        currentRole: "Key worker2"
      },
      {
        staffId: 1,
        firstName: 'Amy',
        lastName: 'Hanson',
        numberAllocated: 4,
        status: "active",
        currentRole: "Key worker"
      },
      {
        staffId: 3,
        firstName: 'Florence',
        lastName: 'Welch',
        numberAllocated: 1,
        status: "active",
        currentRole: "Key worker3"
      }
    ]
  };
}

module.exports = router;
