const path = require('path');

module.exports = function(config) {
  // Add the SASS loader second-to-last
  // (last one must remain as the "file-loader")
  let loaderList = config.module.rules[1].oneOf;
  loaderList.splice(loaderList.length - 1, 0, {
    test: /\.scss$/,
    use: [
        {
          loader:"style-loader"
        },
        {
          loader:"css-loader"
        }, 
        {
        loader:  "sass-loader",
        options: {
          includePaths: [
            'node_modules/govuk_frontend_toolkit/stylesheets', 
            'node_modules/govuk-elements-sass/public/sass',    
          ],
        }
      }
    ]
  });
}