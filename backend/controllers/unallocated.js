/* eslint-disable no-unused-vars */
const express = require('express');
const router = express.Router();
const elite2Api = require('../elite2Api');
const asyncMiddleware = require('../middleware/asyncHandler');

router.get('/', asyncMiddleware(async (req, res) => {
  const response = await elite2Api.unallocated(req);
  res.status(200);
  res.end();
}));


module.exports = router;
