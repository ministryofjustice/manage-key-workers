
module.exports = function (config) {
  config.testMatch.push('<rootDir>/backend/tests/**/?(*.)(spec|test).{js,jsx,mjs}');
  config.collectCoverageFrom.push('src/**/*.js');
  config.collectCoverageFrom.push('backend/**/*.js');
  config.transformIgnorePatterns[0] = "/\\\\]node_modules[/\\\\](?!(new-nomis-shared-components)/).+\\.(js|jsx|mjs)$";

  return config;
};
