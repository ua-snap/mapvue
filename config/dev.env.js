var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  MV_GOOGLE_ANALYTICS_TOKEN: '"a0b0c0d0"',
  GEOSERVER_WMS_URL: '"http://18.237.70.116:8080/geoserver/wms"'
})
