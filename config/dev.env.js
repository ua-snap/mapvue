var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  GEOSERVER_WMS_URL: '"http://54.70.10.93:8080/geoserver/wms"',
  FIRE_FEATURES_URL: '"http://aicc-fire-api.openshift.snap.uaf.edu/"',
  MV_GOOGLE_ANALYTICS_TOKEN: '"a0b0c0d0"'
})
