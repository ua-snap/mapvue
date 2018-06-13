<template>
  <div>
  <h1 class="map-title">{{ title }}</h1>
  <layer-menu></layer-menu>
  <splash-screen :abstract="abstract"></splash-screen>
  <mv-map
    ref="map"
    :baseLayerOptions="baseLayerOptions"
    :baseLayer="baseLayer"
    :placeLayer="placeLayer"
    :crs="crs"
    :mapOptions="mapOptions"
  ></mv-map>
  <sidebar :mapObj="primaryMapObject"></sidebar>
  <tour :tour="tour"></tour>
  <mv-footer></mv-footer>
</div>
</template>

<script>
/* eslint new-cap: "off" */
import _ from 'lodash'
import MapInstance from '@/components/MapInstance'
import Tour from '../Tour'

export default {
  name: 'SNAP_RCP6',
  extends: MapInstance,
  components: {
    'tour': Tour
  },
  data () {
    return {
      title: 'Variation over time with RCP 6.0 (Draft)',
      abstract: '<h1>Variation over time with RCP 6.0</h1><div class="abstractWrapper"><p>This map shows how data from the Scenarios Network for Alaska and Arctic Planning can show variation over time with two variables: <b>temperature</b> and <b>length of growing season</b>. The tour for this map explains the meaning of this data and how to explore it in this interface, as well as where to go for additional data and examples on how to apply this data in your own work.</p></div>',
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
          'abstract': `
          <table class="rcp6-legend alaska-landcover-2010">
            <tr><td><div class="l-1"></div></td><td>Temperate or sub-polar needleleaf forest</td></tr>
            <tr><td><div class="l-2"></div></td><td>Sub-polar taiga needleleaf forest</td></tr>
            <tr><td><div class="l-3"></div></td><td>Temperate or sub-polar broadleaf deciduous forest</td></tr>
            <tr><td><div class="l-4"></div></td><td>Mixed forest</td></tr>
            <tr><td><div class="l-5"></div></td><td>Temperate or sub-polar shrubland</td></tr>
            <tr><td><div class="l-6"></div></td><td>Temperate or sub-polar grassland</td></tr>
            <tr><td><div class="l-7"></div></td><td>Sub-polar or polar shrubland-lichen-moss</td></tr>
            <tr><td><div class="l-8"></div></td><td>Sub-polar or polar grassland-lichen-moss</td></tr>
            <tr><td><div class="l-9"></div></td><td>Sub-polar or polar barren-lichen-moss</td></tr>
            <tr><td><div class="l-10"></div></td><td>Wetland</td></tr>
            <tr><td><div class="l-11"></div></td><td>Cropland</td></tr>
            <tr><td><div class="l-12"></div></td><td>Barren land</td></tr>
            <tr><td><div class="l-13"></div></td><td>Urban and built-up</td></tr>
            <tr><td><div class="l-14"></div></td><td>Water</td></tr>
            <tr><td><div class="l-15"></div></td><td>Snow and ice</td></tr>
          </table>
          <p>This layer provides a generalized view of the physical cover on land at a spatial resolution of 250 meters.  Land cover classifications are used by scientists to determine what is growing on the landscape. These are made by looking at satellite imagery and categorizing the images into land cover types.</p><p>The dominant land cover varies across the landscape and influences how flammable a region is. When wildfires burn, they often alter the dominant land cover. Many fires have occurred since this layer was created in 2010. <i>What landcover burns the most?</i></p><p>To access and learn more about this dataset, visit the <a href="http://www.cec.org/tools-and-resources/map-files/land-cover-2010" target="_blank">Commission for Environmental Cooperation</a></p>.`,
          'name': 'alaska_wildfires:alaska_landcover_2010',
          'title': 'Land cover, 2010',
          'legend': false
        },
        {
          'abstract': 'This layer shows the decadal average length of growing season in the 2010s, which refers to the number of days between the days of thaw and freeze.\n\nEstimated days of freeze and thaw are calculated by assuming a linear change in temperature between consecutive months.  When consecutive monthly midpoints have opposite sign temperatures, the day of transition (freeze or thaw) is the day between them on which temperature crosses zero degrees C.\n\n[Read more about this data set](http://ckan.snap.uaf.edu/dataset/projected-derived-dof-dot-logs-771m-cmip5-ar5), including the algorithms used to generate this data layer.',
          'name': 'snap_rcp:logs_2010_rcp6',
          'title': '2010s Length of Growing Season, RCP 6.0'
        },
        {
          'abstract': 'This layer shows the decadal average length of growing season in the 2090s, which refers to the number of days between the days of thaw and freeze.\n\nEstimated days of freeze and thaw are calculated by assuming a linear change in temperature between consecutive months.  When consecutive monthly midpoints have opposite sign temperatures, the day of transition (freeze or thaw) is the day between them on which temperature crosses zero degrees C.\n\n[Read more about this data set](http://ckan.snap.uaf.edu/dataset/projected-derived-dof-dot-logs-771m-cmip5-ar5), including the algorithms used to generate this data layer.',
          'name': 'snap_rcp:logs_2090_rcp6',
          'title': '2090s Length of Growing Season, RCP 6.0'
        },
        {
          'abstract': 'This layer shows projected, downscaled mean decadal temperature for 2010 using a five-model average.  The spatial resolution of this dataset is 771m.   The downscaling process for this layer utilizes PRISM climatological datasets from 1961-1990.\n\n[Download source data](http://ckan.snap.uaf.edu/dataset/projected-monthly-and-derived-temperature-products-771m-cmip5-ar5) for this layer, and other related products.',
          'name': 'snap_rcp:tas_2010_rcp6',
          'title': '2010s Mean Annual Temperature, RCP 6.0'
        },
        {
          'abstract': 'This layer shows projected, downscaled mean decadal temperature for 2090 using a five-model average. The spatial resolution of this dataset is 771m. The downscaling process for this layer utilizes PRISM climatological datasets from 1961-1990.\n\n[Download source data for this layer](http://ckan.snap.uaf.edu/dataset/projected-monthly-and-derived-temperature-products-771m-cmip5-ar5), and other related products.',
          'name': 'snap_rcp:tas_2090_rcp6',
          'title': '2090s Mean Annual Temperature, RCP 6.0'
        }
      ]
    }
  },
  computed: {
    crs () {
      // We need to modify the default pan-Arctic
      // projection to avoid a bug.
      var proj = new this.$L.Proj.CRS('EPSG:3338',
      '+proj=aea +lat_1=55 +lat_2=65 +lat_0=50 +lon_0=-154 +x_0=0 +y_0=0 +ellps=GRS80 +datum=NAD83 +units=m +no_defs',
        {
          resolutions: [4096, 2048, 1024, 512, 256, 128, 64],

          // Origin should be lower-left coordinate
          // in projected space.  Use GeoServer to
          // find this:
          // TileSet > Gridset Bounds > compute from maximum extent of SRS
          origin: [-4648005.934316417, 444809.882955059]
        }
      )

      // trust me.
      // Without this (= pi/2), proj4js returns an undefined
      // value for tiles requested at the North Pole and
      // it causes a runtime exception.
      // proj.projection._proj.oProj.phi0 = 1.5708
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
    secondBaseLayer () {
      return new this.$L.tileLayer.wms(
        process.env.GEOSERVER_WMS_URL,
        _.extend(this.baseLayerOptions, {
          layers: ['arctic_osm_3572']
        })
      )
    },
    secondPlaceLayer () {
      return new this.$L.tileLayer.wms(
        process.env.GEOSERVER_WMS_URL,
        _.extend(this.baseLayerOptions, {
          layers: ['arctic_places_osm_3572'],
          zIndex: 1000
        })
      )
    },
    tour () {
      let tour
      tour = new this.$shepherd.Tour({
        defaults: {
          classes: 'shepherd-theme-square-dark',
          showCancelLink: true
        }
      })

      // Reuse for navigation
      let buttons = [
        {
          text: 'Back',
          action: tour.back
        },
        {
          text: 'Next',
          action: tour.next
        }
      ]

      tour.addStep({
        title: 'General Circulation Models',
        text: `
        <p>Projecting into the future using <a href="https://www.gfdl.noaa.gov/climate-modeling/" target="_blank">General Circulation Model</a> (GCM) data will always include uncertainties. To address this, <a href="https://www.snap.uaf.edu/methods/models" target="_blank">SNAP provides five GCMs that perform best over the Arctic</a> as well as an average of those 5 models. This "5 Model Average" is generally more statistically accurate than any individual model; however, the average value does smooth out extreme values. If extreme values are of interest, it's best to use a series of individual GCMs.</p>`,
        classes: 'shepherd-theme-square-dark',
        when: {
          show: () => {
            this.$store.commit('hideDualMaps')
            this.$store.commit('disableSyncMaps')
            this.$store.commit('showOnlyLayers', {
              first: []
            })
            this.$ga.event({
              eventCategory: 'Tour Step: General Circulation Models',
              eventAction: 'show',
              eventLabel: 'SNAP RCP 6.0'
            })
          }
        }
      })
      tour.addStep({
        title: 'What is an RCP?',
        text: `
        <p>Just as it’s good to use multiple GCMs, it’s also good to look at multiple scenarios when using climate data. This approach provides the most complete picture of possible future climate trends.</p>

        <p>The Intergovernmental Panel on Climate Change (IPCC) describes 4 potential future scenarios known as Representative Concentration Pathways (RCPs).</p>

        <p>RCPs are used by those running GCMs to model what the climate might be like in the future and to ensure that modelers start from the same place and agree on the same assumptions. RCPs provide a “common language” for comparing results and sharing findings.</p>`,
        classes: 'shepherd-theme-square-dark',
        buttons: buttons,
        when: {
          show: () => {
            this.$store.commit('hideDualMaps')
            this.$store.commit('disableSyncMaps')
            this.$store.commit('showOnlyLayers', {
              first: []
            })
            this.$ga.event({
              eventCategory: 'Tour Step: What is an RCP?',
              eventAction: 'show',
              eventLabel: 'SNAP RCP 6.0'
            })
          }
        }
      })
      tour.addStep({
        title: 'What do RCPs describe?',
        text: `
        <p>RCPs illustrate 3 major values:</p>
        <p style="margin-left: 5px;"><b>1) Radiative forcing</b> — how much energy is at the Earth’s surface, measured in watts per square meter, by the year 2100. This is the metric that the RCP numbers are based upon, i.e. RCP 2.6, 4.5, 6.0, and 8.5.</p>
        <p style="margin-left: 5px;"><b>2) Emission rates</b> — how fast we add greenhouse gases into the atmosphere
        <p style="margin-left: 5px;"><b>3) Emission concentrations</b> — measured in parts per million for CO2, methane, and other greenhouse gases
</p>`,
        classes: 'shepherd-theme-square-dark',
        buttons: buttons,
        when: {
          show: () => {
            this.$store.commit('hideDualMaps')
            this.$store.commit('disableSyncMaps')
            this.$store.commit('showOnlyLayers', {
              first: []
            })
            this.$ga.event({
              eventCategory: 'Tour Step: What do RCPs describe?',
              eventAction: 'show',
              eventLabel: 'SNAP RCP 6.0'
            })
          }
        }
      })
      tour.addStep({
        title: 'What do the RCPs represent?',
        text: `
        <p><b>RCP 2.6:</b> Forcing peaks at ~3 W / m<sup style='vertical-align: super; font-size: 10px;'>2</sup> mid-century and drops to 2.6 W / m<sup style='vertical-align: super; font-size: 10px;'>2</sup> by 2100. Greenhouse gas emissions drop substantially over time. </p>
        <p><b>RCPs 4.5 and 6.0:</b> Forcing stabilizes soon after 2100 at 4.5 and 6.0 W / m<sup style='vertical-align: super; font-size: 10px;'>2</sup>, respectively, due to efforts that curb emissions.</p>
        <p><b>RCP 8.5:</b> Forcing values reach 8.5 W / m<sup style='vertical-align: super; font-size: 10px;'>2</sup> by 2100 and continue to rise into the next century. Very high greenhouse gas concentrations.</p>
        <p><a href="http://sedac.ipcc-data.org/ddc/ar5_scenario_process/RCPs.html" target="_blank">Additional information about RCPs</a>`,
        classes: 'shepherd-theme-square-dark',
        buttons: buttons,
        when: {
          show: () => {
            this.$store.commit('hideDualMaps')
            this.$store.commit('disableSyncMaps')
            this.$store.commit('showOnlyLayers', {
              first: []
            })
            this.$ga.event({
              eventCategory: 'Tour Step: What do the RCPs represent?',
              eventAction: 'show',
              eventLabel: 'SNAP RCP 6.0'
            })
          }
        }
      })
      tour.addStep({
        title: 'CO<sup style="font-size=8px;">2</sup> atmospheric concentrations for RCP scenarios',
        text: `
        <p><img align='center' src='static/atmos_concent.png' width=700 height=500></img></p>
        <p style='margin-top: 15px; font-size: 14px;'><i>CO<sup style='font-size=12px;'>2</sup> equivalent atmospheric concentrations for RCP scenarios. RCP 8.5 represents ‘business-as-usual’. See <a href='http://www.pik-potsdam.de/~mmalte/rcps/' target='_blank'>http://www.pik-potsdam.de/~mmalte/rcps/</a> for further description and data.</i></p>`,
        classes: 'shepherd-theme-square-dark adjust-for-images',
        buttons: buttons,
        when: {
          show: () => {
            this.$store.commit('hideDualMaps')
            this.$store.commit('disableSyncMaps')
            this.$store.commit('showOnlyLayers', {
              first: []
            })
            this.$ga.event({
              eventCategory: 'Tour Step: CO2 atmospheric concentrations image',
              eventAction: 'show',
              eventLabel: 'SNAP RCP 6.0'
            })
          }
        }
      })
      tour.addStep({
        title: 'What makes SNAP data different from General Circulation Model data?',
        text: `
        <p style="margin-left: 25px;"><img src='static/snap_downscaling.png' width=500 height=300 /></p>
        <p style="margin-left: 25px; width: 500px;">SNAP <a href='https://www.snap.uaf.edu/methods/downscaling' target='_blank'>downscales climate data</a> from global models to generate locally relevant data at higher resolutions. The downscaling process connects global-scale projections with smaller-scale dynamics to create regionally specific projections. SNAP data adds value to GCM projections by making them more relevant and useful for making decisions about climate change.</p>`,
        classes: 'shepherd-theme-square-dark adjust-for-images',
        buttons: buttons,
        when: {
          show: () => {
            this.$store.commit('hideDualMaps')
            this.$store.commit('disableSyncMaps')
            this.$store.commit('showOnlyLayers', {
              first: []
            })
            this.$ga.event({
              eventCategory: 'Tour Step: What makes SNAP data different from General Circulation Model data?',
              eventAction: 'show',
              eventLabel: 'SNAP RCP 6.0'
            })
          }
        }
      })
      tour.addStep({
        title: 'Side-by-side maps showing changing temperature',
        text: `
        <p>Example of a decadal average of mean annual temperature for the 2010s and 2090s. Viewed side-by-side with the same color scale, it’s apparent that mean annual temperature is projected to increase. This is most notable in northern Alaska—where the darkest blue is almost entirely replaced with lighter shades, denoting warmer temperatures. </p>`,
        classes: 'shepherd-theme-square-dark',
        buttons: buttons,
        when: {
          show: () => {
            this.$store.commit('showDualMaps')
            this.$store.commit('enableSyncMaps')
            this.$store.commit('hideLayerMenu')
            this.$store.commit('showOnlyLayers', {
              first: ['snap_rcp:tas_2010_rcp6'],
              second: ['snap_rcp:tas_2090_rcp6']
            })
            this.primaryMapObject.setView([69.297, -144.159], 4)
            this.$ga.event({
              eventCategory: 'Tour Step: Side-by-side maps showing changing temperature',
              eventAction: 'show',
              eventLabel: 'SNAP RCP 6.0'
            })
          }
        }
      })
      tour.addStep({
        title: 'Side-by-side maps showing changing growing seasons',
        text: `
        <p>A shift in climate patterns is illustrated by the Length of Growing Season layer, which is measured in days. Length of growing season approximates the ice-free season; it’s defined by the dates between when the mean temperature crosses 0°C in the spring and fall.</p>
        <p>By the 2090’s (right map) the growing season shows a strong warming trend with a longer ice-free season. This is most notable in the south—where the growing season increases by as much as 30 days.</p>`,
        classes: 'shepherd-theme-square-dark',
        buttons: buttons,
        when: {
          show: () => {
            this.$store.commit('showDualMaps')
            this.$store.commit('enableSyncMaps')
            this.$store.commit('hideLayerMenu')
            this.$store.commit('showOnlyLayers', {
              first: ['snap_rcp:logs_2010_rcp6'],
              second: ['snap_rcp:logs_2090_rcp6']
            })
            this.primaryMapObject.setView([60.994, -148.69], 3)
            this.$ga.event({
              eventCategory: 'Tour Step: Side-by-side maps showing changing growing seasons',
              eventAction: 'show',
              eventLabel: 'SNAP RCP 6.0'
            })
          }
        }
      })
      tour.addStep({
        title: 'What do the colors mean?',
        text: `<p>Use the <span class="fire-tour-info">&#9432;</span> Info button by the name of each layer to see more details and a legend.</p>
        <p><p>The color of these layers represent the length of the growing season. Dark brown is less than 120 days with the darkest green being a year round growing season.</p>`,
        when: {
          show: () => {
            this.$store.commit('showDualMaps')
            this.$store.commit('enableSyncMaps')
            this.$store.commit('hideLayerMenu')
            this.$store.commit('showOnlyLayers', {
              first: ['snap_rcp:logs_2010_rcp6'],
              second: ['snap_rcp:logs_2090_rcp6']
            })
            this.primaryMapObject.setView([60.994, -148.69], 3)
            this.$store.commit('showSidebar', {
              layer: 'snap_rcp:logs_2090_rcp6'
            })
            this.$ga.event({
              eventCategory: 'Tour Step: What do the colors mean?',
              eventAction: 'show',
              eventLabel: 'SNAP RCP 6.0'
            })
          },
          hide: () => {
            this.$store.commit('hideSidebar')
          }
        },
        buttons: buttons
      })
      tour.addStep({
        title: 'Download our data!',
        text: `
        <p>You can <a href="https://www.snap.uaf.edu/tools/data-downloads" target="_blank">download this and related data sets</a> from our data distribution server.</p>
        <p>Need data for a specific community? Try our <a href="https://www.snap.uaf.edu/sites/all/modules/snap_community_charts/charts.php" target="_blank">Community Charts Tool</a>.</p>
        <p>Need a spatial subset of data for your area of interest? <a href="https://github.com/ua-snap/data-recipes/tree/master/extract_by_polygon" target="_blank">This R script</a> can be adapted to subset a timeseries of this data for a region specified by a shapefile, producing CSV output that can the be graphed or visualized in other ways.</p>`,
        classes: 'shepherd-theme-square-dark',
        buttons: buttons,
        when: {
          show: () => {
            this.primaryMapObject.setView([64, -165], 0)
            this.$store.commit('hideDualMaps')
            this.$store.commit('disableSyncMaps')
            this.$store.commit('hideLayerMenu')
            this.$store.commit('showOnlyLayers', {
              first: [''],
              second: ['']
            })
            this.$ga.event({
              eventCategory: 'Tour Step: Download our data!',
              eventAction: 'show',
              eventLabel: 'SNAP RCP 6.0'
            })
          }
        }
      })
      tour.addStep({
        title: 'End of tour!',
        text: `Thanks for checking out the RCP 6.0 map! Tools like this help to visualize the impact our development can have on a variety of species in Alaska, which represents an important talking point for decision makers and citizens alike.<p><p> If you have feedback, we’d love to hear from you at uaf-mapventure@alaska.edu!`,
        when: {
          show: () => {
            this.$store.commit('hideDualMaps')
            this.$store.commit('disableSyncMaps')
            this.$store.commit('showLayerMenu')
            this.$store.commit('showOnlyLayers', {
              first: [''],
              second: ['']
            })
            this.$ga.event({
              eventCategory: 'Tour Step: Finished the SNAP RCP 6.0 tour!',
              eventAction: 'show',
              eventLabel: 'SNAP RCP 6.0'
            })
          }
        },
        buttons: [
          {
            text: 'Back',
            action: tour.back
          },
          {
            text: 'Done',
            action: tour.complete
          }
        ]
      })
      return tour
    }
  }
}
</script>
<style lang="scss">
sup {
  vertical-align: super;
  font-size: 12px;
}
table.rcp6-legend.alaska-landcover-2010 {
  td {
    font-size: 10pt;
    div {
      height: 2em;
      width: 2em;
      border: none;
      margin-right: 5px;
      &.l-1 { background-color: #003d00; }
      &.l-2 { background-color: #949c70; }
      &.l-3 { background-color: #148c3d; }
      &.l-4 { background-color: #5c752b; }
      &.l-5 { background-color: #b38a33; }
      &.l-6 { background-color: #e1cf8a; }
      &.l-7 { background-color: #9c7554; }
      &.l-8 { background-color: #bad48f; }
      &.l-9 { background-color: #408a70; }
      &.l-10 { background-color: #6ba38a; }
      &.l-11 { background-color: #e6ae66; }
      &.l-12 { background-color: #a8abae; }
      &.l-13 { background-color: #DD40D6; }
      &.l-14 { background-color: #4c70a3; }
      &.l-15 { background-color: #eee9ee; }
    }
  }
}

.splash-screen .billboard {
  background: url("~@/assets/mountains.jpg") white top left / cover no-repeat;
  h1 {
    width: 75%;
    font-size: 20pt;
    padding: 1ex;
    color: #000;
  }
  color: #222;
  a {
    color: #438bca;
  }
  p {
    padding: 1em;
  }
  ul {
    li {
    }
    margin-bottom: 1em;
  }

  .abstractWrapper {
    @media screen and (max-width: 768px) {
      width: 100%;
      border-radius: 0;
      margin: 0;
      font-size: 10pt;
      ul {
        margin-right: 1em;
      }
    }
    @media screen and (min-width: 769px) {
      max-width: 100%;
    }
    background: rgba(255, 255, 255, .8);
    border-radius: 1ex;
    margin: 1em;
  }
  .buttons {
    margin: 1em;
    padding-bottom: 1em;
    font-weight: 700;
  }
  .logos {
    margin: -1em 0 1em 1em;
  }
}
</style>
