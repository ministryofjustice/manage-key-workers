const gateway = require('./gateway-api');

const login = (req) => gateway.httpRequest({
    method: 'post',
    url: '/users/login',
    data: req.body,
}); 

const service = { 
   login,
};

module.exports = service;