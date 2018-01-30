/* eslint-disable no-unused-vars */
const express = require('express');
const router = express.Router();
const elite2Api = require('../elite2Api');
const asyncMiddleware = require('../middleware/asyncHandler');

router.get('/', asyncMiddleware(async (req, res) => {
  const viewModel = await allocated(req);
  res.json(viewModel);
}));

const allocated = async (req) => {
  const keyworkerResponse = await elite2Api.availableKeyworkers(req);
  const allocatedResponse = await elite2Api.allocated(req);

  let allocatedData = allocatedResponse.data;
  const keyworkerData = keyworkerResponse.data;
  for (let element of allocatedData) {
    let kw = keyworkerData.find(i => i.staffId === element.staffId);
    if (kw) {
      element.keyworkerFirstName = kw.firstName;
      element.keyworkerLastName = kw.lastName;
      element.numberAllocated = kw.numberAllocated;
    } else {
      element.keyworkerFirstName = '';
      element.keyworkerLastName = 'not available';
      element.numberAllocated = 999;
    }
  }
  return {
    keyworkerResponse: keyworkerResponse.data,
    allocatedResponse: allocatedResponse.data
  };
};

module.exports = {
  router,
  allocated
};


