module.exports = {
  NODE_ENV: '"production"',
  GEOSERVER_WMS_URL: '"http://54.202.138.90:8080/geoserver/wms"',
  FIRE_FEATURES_URL: '"http://aicc-fire-api.openshift.snap.uaf.edu/"',
  FIRE_TIME_SERIES_URL: '"http://aicc-fire-api.openshift.snap.uaf.edu/fire-time-series"',
  LIGHTNING_FEATURES_URL: '"http://aicc-fire-api.openshift.snap.uaf.edu/lightning-data"',
  VIIRS_URL: '"http://aicc-fire-api.openshift.snap.uaf.edu/viirs"',
  MV_GOOGLE_ANALYTICS_TOKEN: "'" + process.env.GOOGLE_ANALYTICS_TOKEN + "'"
}
