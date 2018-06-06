const express = require('express');
const router = express.Router();
const keyworkerApi = require('../keyworkerApi');
const asyncMiddleware = require('../middleware/asyncHandler');
const log = require('../log');

router.get('/', asyncMiddleware(async (req, res) => {
  const response = await allocationHistory(req, res);
  res.json(response);
}));

const allocationHistory = async (req, res) => {
  const allocationHistoryResponse = await keyworkerApi.allocationHistory(req, res);
  const allocationHistoryData = allocationHistoryResponse.data;
  log.debug({ data: allocationHistoryData }, 'Response from allocation history request');
  return allocationHistoryData;
};

module.exports = {
  router,
  allocationHistory
};
