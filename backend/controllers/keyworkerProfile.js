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
    data: {
      staffId: 2,
      firstName: 'Amy',
      lastName: 'Ronson',
      status: "active",
      currentRole: "Key worker2"
    }
  };
}

module.exports = router;
