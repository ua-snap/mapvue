<template></template>
<script>
/* eslint new-cap: "off" */
export default {
  name: 'SNAP_RCP6',
  computed: {
    crs () {
      // We need to modify the default pan-Arctic
      // projection to avoid a bug.
      var proj = new this.$L.Proj.CRS('EPSG:3572',
        '+proj=laea +lat_0=90 +lon_0=-150 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
        {
          resolutions: [4096, 2048, 1024, 512, 256, 128, 64],
          origin: [-4234288.146966308, -4234288.146966307]
        }
      )

      // trust me.
      // Without this (= pi/2), proj4js returns an undefined
      // value for tiles requested at the North Pole and
      // it causes a runtime exception.
      proj.projection._proj.oProj.phi0 = 1.5708
      return proj
    },
    baseLayer () {
      // Base layer configuration for pan-Arctic map.
      var baseConfiguration = {
        layers: ['arctic_osm_3572'],
        transparent: true,
        srs: 'EPSG:3572',
        format: 'image/png',
        version: '1.3',
        continuousWorld: true, // needed for non-3857 projs
        zIndex: 0
      }
      return new this.$L.tileLayer.wms(window.geoserverWmsUrl, baseConfiguration)
    },
    placeLayer () {
      // Place names layer configuration for pan-Arctic map.
      var placeConfiguration = {
        layers: ['arctic_places_osm_3572'],
        transparent: true,
        srs: 'EPSG:3572',
        format: 'image/png',
        version: '1.3',
        continuousWorld: true, // needed for non-3857 projs
        zIndex: 100
      }
      return new this.$L.tileLayer.wms(window.geoserverWmsUrl, placeConfiguration)
    }
  },
  data () {
    return {
      mapOptions: {
        zoom: 0,
        minZoom: 0,
        maxZoom: 5,
        center: [64, -165]
      },
      layers: [
        {
          'abstract': 'This layer shows the decadal average length of growing season in the 2090s, which refers to the number of days between the days of thaw and freeze.\n\nEstimated days of freeze and thaw are calculated by assuming a linear change in temperature between consecutive months.  When consecutive monthly midpoints have opposite sign temperatures, the day of transition (freeze or thaw) is the day between them on which temperature crosses zero degrees C.\n\n[Read more about this data set](http://ckan.snap.uaf.edu/dataset/projected-derived-dof-dot-logs-2km-cmip5-ar5), including the algorithms used to generate this data layer.',
          'name': 'geonode:logs_5modelavg_rcp60_2090_2099_3572',
          'title': '2090s Length of Growing Season, RCP 6.0'
        },
        {
          'abstract': 'This layer shows the decadal average length of growing season in the 2010s, which refers to the number of days between the days of thaw and freeze.\n\nEstimated days of freeze and thaw are calculated by assuming a linear change in temperature between consecutive months.  When consecutive monthly midpoints have opposite sign temperatures, the day of transition (freeze or thaw) is the day between them on which temperature crosses zero degrees C.\n\n[Read more about this data set](http://ckan.snap.uaf.edu/dataset/projected-derived-dof-dot-logs-2km-cmip5-ar5), including the algorithms used to generate this data layer.',
          'name': 'geonode:logs_5modelavg_rcp60_2010_2019_3857',
          'title': '2010s Length of Growing Season, RCP 6.0'
        },
        {
          'abstract': 'This layer shows projected, downscaled mean decadal temperature for 2090 using a five-model average. The spatial resolution of this dataset is 2x2km. The downscaling process for this layer utilizes PRISM climatological datasets from 1961-1990.\n\n[Download source data for this layer](http://ckan.snap.uaf.edu/dataset/projected-monthly-and-derived-temperature-products-2km-cmip5-ar5), and other related products.',
          'name': 'geonode:tas_2090s_fixed_3572',
          'title': '2090s Mean Annual Temperature, RCP 6.0'
        },
        {
          'abstract': 'This layer shows projected, downscaled mean decadal temperature for 2010 using a five-model average.  The spatial resolution of this dataset is 2x2km.   The downscaling process for this layer utilizes PRISM climatological datasets from 1961-1990.\n\n[Download source data](http://ckan.snap.uaf.edu/dataset/projected-monthly-and-derived-temperature-products-2km-cmip5-ar5) for this layer, and other related products.',
          'name': 'geonode:tas_decadal_mean_annual_mean_c_5modelavg_rcp60_2010_2019',
          'title': '2010s Mean Annual Temperature, RCP 6.0'
        },
        {
          'abstract': 'This layer provides a generalized view of the physical cover on land at a spatial resolution of 250 meters.  Land cover classifications are used by scientists to determine what is growing on the landscape. These are made by looking at satellite imagery and categorizing the images into land cover types. \n\nThe dominant land cover varies across the landscape and influences how flammable a region is. When wildfires burn, they often alter the dominant land cover. Many fires have occurred since this layer was created in 2010.  _What landcover burns the most?_\n\nTo access and learn more about this dataset, visit the [Commission for Environmental Cooperation](http://www.cec.org/tools-and-resources/map-files/land-cover-2010).\n',
          'name': 'geonode:alaska_landcover_2010',
          'title': 'Land cover, 2010'
        }
      ]
    }
  }
}
</script>
<style lang="scss" scoped></style>
