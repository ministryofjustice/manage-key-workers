
module.exports = function (config) {
  config.testMatch.push('<rootDir>/backend/tests/**/?(*.)(spec|test).{js,jsx,mjs}');
  config.collectCoverageFrom.push('src/**/*.js');
  config.collectCoverageFrom.push('backend/**/*.js');

  return config;
};
