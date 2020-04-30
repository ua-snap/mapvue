var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  MV_GOOGLE_ANALYTICS_TOKEN: '"a0b0c0d0"',
  GEOSERVER_WMS_URL: '"http://52.24.100.6:8080/geoserver/wms"',
  FIRE_FEATURES_URL: '"http://localhost:3000/fires.geojson"',
  VIIRS_URL: '"http://localhost:3000/viirs.geojson"',
})
