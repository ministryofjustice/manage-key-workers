// eslint-disable-next-line func-names
module.exports = function (config) {
  config.testMatch.push('<rootDir>/backend/tests/**/?(*.)(spec|test).{js,jsx,mjs}')
  config.collectCoverageFrom.push('src/**/*.js')
  config.collectCoverageFrom.push('backend/**/*.js')
  // eslint-disable-next-line no-param-reassign
  config.transformIgnorePatterns[0] = '/\\\\]node_modules[/\\\\](?!/).+\\.(js|jsx|mjs)$'

  return config
}
