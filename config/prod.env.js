module.exports = {
  NODE_ENV: '"production"',
  GEOSERVER_WMS_URL: '"http://54.70.10.93:8080/geoserver/wms/"',
  FIRE_FEATURES_URL: '"http://mv-aicc-fire-shim-production.us-west-2.elasticbeanstalk.com/fires.geojson"',
  FIRE_TIME_SERIES_URL: '"http://mv-aicc-fire-shim-production.us-west-2.elasticbeanstalk.com/tally.json"',
  LIGHTNING_FEATURES_URL: '"http://mv-aicc-fire-shim-production.us-west-2.elasticbeanstalk.com/lightning-data"', 
  VIIRS_URL: '"http://mv-aicc-fire-shim-production.us-west-2.elasticbeanstalk.com/viirs.geojson"',
  MV_GOOGLE_ANALYTICS_TOKEN: "'" + process.env.MV_GOOGLE_ANALYTICS_TOKEN + "'"
}
