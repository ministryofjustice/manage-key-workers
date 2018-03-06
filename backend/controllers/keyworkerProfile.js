const express = require('express');
const router = express.Router();
const keyworkerApi = require('../keyworkerApi');
const asyncMiddleware = require('../middleware/asyncHandler');

router.get('/', asyncMiddleware(async (req, res) => {
  const response = await keyworkerApi.keyworker(req);
  res.json(response.data);
}));

module.exports = router;
