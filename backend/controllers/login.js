const express = require('express');
const router = express.Router();
const elite2Api = require('../elite2Api');
const session = require('../session');
const asyncMiddleware = require('../middleware/asyncHandler');

router.post('/', asyncMiddleware(async (req, res) => {
  const response = await elite2Api.login(req);
  const jwtToken = session.newJWT(response.data);
  req.headers.jwt = jwtToken;
  const currentUserResponse = await elite2Api.currentUser(req);
  res.setHeader('jwt', jwtToken);
  console.log('-----');
  console.log('-----');
  console.log(jwtToken);
  console.log('-----');
  res.json(currentUserResponse.data);
}));


module.exports = router;
