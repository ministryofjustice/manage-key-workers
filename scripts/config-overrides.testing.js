

module.exports = function(config){
    config.testMatch.push('<rootDir>/backend/tests/**/?(*.)(spec|test).{js,jsx,mjs}');
    return config;
}