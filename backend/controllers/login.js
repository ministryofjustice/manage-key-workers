const express = require('express');
const router = express.Router();
const elite2Api = require('../elite2Api');
const session = require('../session');
const asyncMiddleware = require('../middleware/asyncHandler');

router.post('/', asyncMiddleware(async (req,res) => {
    const response = await elite2Api.login(req);
    const jwtToken = session.newJWT(response.data);
    res.setHeader('jwt', jwtToken);

    res.status(200);
    res.end();
}));


module.exports = router;