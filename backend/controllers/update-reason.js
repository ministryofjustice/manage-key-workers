/* eslint-disable no-unused-vars */
const express = require('express');
const router = express.Router();
const elite2Api = require('../elite2Api');
const asyncMiddleware = require('../middleware/asyncHandler');

router.put('/', asyncMiddleware(async (req, res) => {
  const response = await elite2Api.updateReason(req);
  res.json(response.data);
}));


module.exports = router;
