module.exports = {
  NODE_ENV: '"production"',
  GEOSERVER_WMS_URL: '"http://52.24.100.6:8080/geoserver/wms"',
  FIRE_FEATURES_URL: '"http://mv-aicc-fire-shim-production.us-west-2.elasticbeanstalk.com/fires.geojson"',
  VIIRS_URL: '"http://mv-aicc-fire-shim-production.us-west-2.elasticbeanstalk.com/viirs.geojson"',
  MV_GOOGLE_ANALYTICS_TOKEN: "'" + process.env.MV_GOOGLE_ANALYTICS_TOKEN + "'"
}
