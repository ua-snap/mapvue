var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  MV_GOOGLE_ANALYTICS_TOKEN: '"a0b0c0d0"',
  GEOSERVER_WMS_URL: '"http://54.190.34.177:8080/geoserver/wms"',
  FIRE_FEATURES_URL: '"http://mv-aicc-fire-shim-production.us-west-2.elasticbeanstalk.com/fires.geojson"',
  VIIRS_URL: '"http://mv-aicc-fire-shim-production.us-west-2.elasticbeanstalk.com/viirs.geojson"',
})
