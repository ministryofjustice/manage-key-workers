const express = require('express');
const router = express.Router();
const keyworkerApi = require('../keyworkerApi');
const asyncMiddleware = require('../middleware/asyncHandler');
const logError = require('../logError').logError;
const axios = require('axios');
const applicationVersion = require('../application-version');

const packageData = applicationVersion.packageData;
const buildVersion = applicationVersion.buildNumber;

router.get('/', asyncMiddleware(async (req, res, next) => {
  try {
    const appInfo = {
      name: packageData.name,
      version: buildVersion,
      description: packageData.description,
      uptime: process.uptime()
    };
    try {
      const apiHealth = await axios.get(`${keyworkerApi.keyworkerApiUrl}health`, { timeout: 2000 });
      appInfo.api = apiHealth.data;
    } catch (error) {
      appInfo.api = error.message;
      res.status((error.response && error.response.status) || 500);
    }
    res.json(appInfo);
  } catch (error) {
    logError(req.originalUrl, error, 'Health call Error');
    const data = error && error.response && error.response.data;
    const errorStatusCode = (data && data.status || (error.response && error.response.status)) || 500;
    const message = (data && (data.message)) || (error && (error.message || (error.response && error.response.statusText)));

    res.status(errorStatusCode);

    if (message) {
      res.json(message);
    } else {
      res.end();
    }
  }
}));

module.exports = router;
