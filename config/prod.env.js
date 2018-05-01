module.exports = {
  NODE_ENV: '"production"',
  GEOSERVER_WMS_URL: '"http://54.70.10.93:8080/geoserver/wms"',
  FIRE_FEATURES_URL: '"http://aicc-fire-api.openshift.snap.uaf.edu/"',
  FIRE_TIME_SERIES_URL: '"http://aicc-fire-api.openshift.snap.uaf.edu/fire-time-series"',
  VIIRS_URL: '"http://aicc-fire-api.openshift.snap.uaf.edu/viirs"',
  MV_GOOGLE_ANALYTICS_TOKEN: "'" + process.env.GOOGLE_ANALYTICS_TOKEN + "'"
}
