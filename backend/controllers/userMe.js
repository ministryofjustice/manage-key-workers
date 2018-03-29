const express = require('express');
const router = express.Router();
const elite2Api = require('../elite2Api');
const asyncMiddleware = require('../middleware/asyncHandler');
const config = require('../config');

router.get('/', asyncMiddleware(async (req, res) => {
  const response = await elite2Api.currentUser(req, res);
  response.data.notmEndpointUrl = config.app.notmEndpointUrl;
  res.json(response.data);
}));

module.exports = router;
