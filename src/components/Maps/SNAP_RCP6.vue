<template></template>
<script>
/* eslint new-cap: "off" */
import _ from 'lodash'
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
      return new this.$L.tileLayer.wms(
        process.env.GEOSERVER_WMS_URL,
        _.extend(this.baseLayerOptions, {
          layers: ['arctic_osm_3572']
        })
      )
    },
    placeLayer () {
      return new this.$L.tileLayer.wms(
        process.env.GEOSERVER_WMS_URL,
        _.extend(this.baseLayerOptions, {
          layers: ['arctic_places_osm_3572'],
          zIndex: 1000
        })
      )
    },
    tour () {
      let tour = new this.$shepherd.Tour({
        defaults: {
          classes: 'shepherd-theme-square-dark'
        }
      })
      tour.addStep('rcp-overview', {
        title: 'What&rsquo;s an RCP?',
        text: `
<p>The Intergovernmental Panel on Climate Change&rsquo;s (IPCC) 5th Assessment Report (AR5) describes four different potential future scenarios using <strong>Representative Concentration Pathways</strong> (RCPs).</p>

<p>RCPs are the latest set of international climate scenarios used to model potential future climates. RCP data are used to ensure that modelers start from the same place, using values everyone is familiar with. RCPs reduce duplication, save money, and provide a &ldquo;common language&rdquo; for comparing results and sharing findings.</p>

<p>Each RCP sets levels for the concentration of greenhouse gases and how much the planet has heated up for the year 2100. These become &ldquo;pathways&rdquo; to the end of the 21st century.</p>
`,
        buttons: [
          {
            text: 'Next',
            action: tour.next
          }
        ]
      })
      tour.addStep('rcp-describe', {
        title: 'What do RCPs describe?',
        classes: 'shepherd-theme-square-dark tour-wide',
        text: `
<p>RCPs illustrate three major values:</p>
<ul>
  <li><strong>Radiative forcing</strong>&mdash;how much sunlight is trapped in Earth’s atmosphere vs. being reflected back into space</li>
  <li><strong>Emission rates</strong>&mdash;how fast we add greenhouse gases into the atmosphere</li>
  <li><strong>Emission concentrations</strong>&mdash;measured in parts per million for CO2, methane, and other greenhouse gases</li>
</ul>
<p>RCP2.6, RCP4.5, RCP6, and RCP8.5 are the four major pathways. The numbers refer to levels of radiative forcings, measured in watts per square meter (W/m^2), by the year 2100.</p>
<ul>
  <li><strong>RCP 2.6</strong>: Forcing peaks at ~3 W/m&sup2; mid-century and drops to 2.6 W/m&sup2; by 2100. Greenhouse gas emissions drop substantially over time.</li>
  <li><strong>RCPs 4.5 and 6.0</strong>: Forcing stabilizes soon after 2100 at 4.5 and 6.0 W/m&sup2;, respectively, due to efforts that curb emissions.</li>
  <li><strong>RCP 8.5</strong>: Very high greenhouse gas concentrations. Radiative forcing values reach 8.5 W/m&sup2; by 2100 and continue to rise into the next century. Very high greenhouse gas concentrations.</li>
</ul>
<figure class="text-center"><img src="../../assets/rcp-variation.png"/>
  <figcaption>Atmospheric concentrations of carbon dioxide, methane, and nitrous oxide for each RCP through 2100.</figcaption>
</figure>
`
      })
      return tour
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
      baseLayerOptions: {
        transparent: true,
        srs: 'EPSG:3572',
        format: 'image/png',
        version: '1.3',
        continuousWorld: true // needed for non-3857 projs
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
