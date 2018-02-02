const axios = require('axios');

const get = (url, config) => axios.get(url, config);
const post = (url, data, config) => axios.post(url, data, config);
const put = (url, data, config) => axios.put(url, data, config);

const service = {
  get, post, put
};

module.exports = service;
