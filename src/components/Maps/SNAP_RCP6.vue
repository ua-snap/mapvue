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
      title: 'SNAP Data for a Changing Climate',
      abstract: '<h1>SNAP Data for a Changing Climate</h1><div class="abstractWrapper"><p>This map shows how data from the Scenarios Network for Alaska and Arctic Planning can show variation over time with two variables: <b>temperature</b> and <b>length of growing season</b>.</div>',
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
          'abstract': `<table class="rcp6-legend logs">
            <tr><td><div class="log-1"></div></td><td>0 - 120 days</td></tr>
            <tr><td><div class="log-2"></div></td><td>121 - 150 days</td></tr>
            <tr><td><div class="log-3"></div></td><td>151 - 180 days</td></tr>
            <tr><td><div class="log-4"></div></td><td>181 - 210 days</td></tr>
            <tr><td><div class="log-5"></div></td><td>211 - 240 days</td></tr>
            <tr><td><div class="log-6"></div></td><td>241 - 270 days</td></tr>
            <tr><td><div class="log-7"></div></td><td>271 - 300 days</td></tr>
            <tr><td><div class="log-8"></div></td><td>301 - 330 days</td></tr>
            <tr><td><div class="log-9"></div></td><td>331 - 365 days</td></tr>
          </table>
          This layer shows the decadal average length of growing season in the 2010s, which refers to the number of days between the days of thaw and freeze.\n\nEstimated days of freeze and thaw are calculated by assuming a linear change in temperature between consecutive months.  When consecutive monthly midpoints have opposite sign temperatures, the day of transition (freeze or thaw) is the day between them on which temperature crosses zero degrees C.\n\n<a href="http://ckan.snap.uaf.edu/dataset/projected-derived-dof-dot-logs-771m-cmip5-ar5" target="_blank">Read more about this dataset</a>, including the algorithms used to generate this data layer.`,
          'name': 'snap_rcp:logs_2010_rcp6',
          'title': '2010s Length of Growing Season, RCP 6.0',
          'legend': false
        },
        {
          'abstract': `
          <table class="rcp6-legend logs">
            <tr><td><div class="log-1"></div></td><td>0 - 120 days</td></tr>
            <tr><td><div class="log-2"></div></td><td>121 - 150 days</td></tr>
            <tr><td><div class="log-3"></div></td><td>151 - 180 days</td></tr>
            <tr><td><div class="log-4"></div></td><td>181 - 210 days</td></tr>
            <tr><td><div class="log-5"></div></td><td>211 - 240 days</td></tr>
            <tr><td><div class="log-6"></div></td><td>241 - 270 days</td></tr>
            <tr><td><div class="log-7"></div></td><td>271 - 300 days</td></tr>
            <tr><td><div class="log-8"></div></td><td>301 - 330 days</td></tr>
            <tr><td><div class="log-9"></div></td><td>331 - 365 days</td></tr>
          </table>
          This layer shows the decadal average length of growing season in the 2090s, which refers to the number of days between the days of thaw and freeze.\n\nEstimated days of freeze and thaw are calculated by assuming a linear change in temperature between consecutive months.  When consecutive monthly midpoints have opposite sign temperatures, the day of transition (freeze or thaw) is the day between them on which temperature crosses zero degrees C.\n\n<a href="http://ckan.snap.uaf.edu/dataset/projected-derived-dof-dot-logs-771m-cmip5-ar5" target="_blank">Read more about this dataset</a>, including the algorithms used to generate this data layer.`,
          'name': 'snap_rcp:logs_2090_rcp6',
          'title': '2090s Length of Growing Season, RCP 6.0',
          'legend': false
        },
        {
          'abstract': `<table class="rcp6-legend tas">
            <tr><td><div class="tas-1"></div></td><td>-8 ºC or colder</td></tr>
            <tr><td><div class="tas-2"></div></td><td>-7.9 to -7 ºC</td></tr>
            <tr><td><div class="tas-3"></div></td><td>-6.9 to -6 ºC</td></tr>
            <tr><td><div class="tas-4"></div></td><td>-5.9 to -5 ºC</td></tr>
            <tr><td><div class="tas-5"></div></td><td>-4.9 to -4 ºC</td></tr>
            <tr><td><div class="tas-6"></div></td><td>-3.9 to -3 ºC</td></tr>
            <tr><td><div class="tas-7"></div></td><td>-2.9 to -2 ºC</td></tr>
            <tr><td><div class="tas-8"></div></td><td>-1.9 to -1 ºC</td></tr>
            <tr><td><div class="tas-9"></div></td><td>-0.9 to 0 ºC</td></tr>
            <tr><td><div class="tas-10"></div></td><td>0.1 to 1 ºC</td></tr>
            <tr><td><div class="tas-11"></div></td><td>1.1 to 2 ºC</td></tr>
            <tr><td><div class="tas-12"></div></td><td>2.1 to 3 ºC</td></tr>
            <tr><td><div class="tas-13"></div></td><td>3.1 to 4 ºC</td></tr>
            <tr><td><div class="tas-14"></div></td><td>4.1 to 5 ºC</td></tr>
            <tr><td><div class="tas-15"></div></td><td>5.1 ºC and warmer</td></tr>
          </table>
          This layer shows projected, downscaled mean decadal temperature for 2010 using a five-model average.  The spatial resolution of this dataset is 771m.   The downscaling process for this layer utilizes PRISM climatological datasets from 1961-1990.\n\n<a href="http://ckan.snap.uaf.edu/dataset/projected-monthly-and-derived-temperature-products-771m-cmip5-ar5" target="_blank">Download data</a> for this layer, and other related products.`,
          'name': 'snap_rcp:tas_2010_rcp6',
          'title': '2010s Mean Annual Temperature, RCP 6.0',
          'legend': false
        },
        {
          'abstract': `<table class="rcp6-legend tas">
            <tr><td><div class="tas-1"></div></td><td>-8 ºC or colder</td></tr>
            <tr><td><div class="tas-2"></div></td><td>-7.9 to -7 ºC</td></tr>
            <tr><td><div class="tas-3"></div></td><td>-6.9 to -6 ºC</td></tr>
            <tr><td><div class="tas-4"></div></td><td>-5.9 to -5 ºC</td></tr>
            <tr><td><div class="tas-5"></div></td><td>-4.9 to -4 ºC</td></tr>
            <tr><td><div class="tas-6"></div></td><td>-3.9 to -3 ºC</td></tr>
            <tr><td><div class="tas-7"></div></td><td>-2.9 to -2 ºC</td></tr>
            <tr><td><div class="tas-8"></div></td><td>-1.9 to -1 ºC</td></tr>
            <tr><td><div class="tas-9"></div></td><td>-0.9 to 0 ºC</td></tr>
            <tr><td><div class="tas-10"></div></td><td>0.1 to 1 ºC</td></tr>
            <tr><td><div class="tas-11"></div></td><td>1.1 to 2 ºC</td></tr>
            <tr><td><div class="tas-12"></div></td><td>2.1 to 3 ºC</td></tr>
            <tr><td><div class="tas-13"></div></td><td>3.1 to 4 ºC</td></tr>
            <tr><td><div class="tas-14"></div></td><td>4.1 to 5 ºC</td></tr>
            <tr><td><div class="tas-15"></div></td><td>5.1 ºC and warmer</td></tr>
          </table>
          This layer shows projected, downscaled mean decadal temperature for 2090 using a five-model average. The spatial resolution of this dataset is 771m. The downscaling process for this layer utilizes PRISM climatological datasets from 1961-1990.\n\n<a href="http://ckan.snap.uaf.edu/dataset/projected-monthly-and-derived-temperature-products-771m-cmip5-ar5" target="_blank">Download data</a> for this layer, and other related products.`,
          'name': 'snap_rcp:tas_2090_rcp6',
          'title': '2090s Mean Annual Temperature, RCP 6.0',
          'legend': false
        }
      ]
    }
  },
  computed: {
    crs () {
      // We need to modify the default pan-Arctic
      // projection to avoid a bug.
      var proj = new this.$L.Proj.CRS('EPSG:3572',
        '+proj=laea +lat_0=90 +lon_0=-150 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
        {
          resolutions: [4096, 2048, 1024, 512, 256, 128, 64],
          origin: [-4889334.802954878, -4889334.802954878]
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
        title: 'Welcome to the Tour!',
        text: `
        <p>The tour for this map provides context to the datasets, highlighting their usefulness in making meaningful predictions. You will also learn where to get more data and see examples of how to apply what you learn to your own work.</p>
        <p>This tour has 11 stops.</p>`,
        classes: 'shepherd-theme-square-dark',
        when: {
          show: () => {
            this.$store.commit('hideDualMaps')
            this.$store.commit('disableSyncMaps')
            this.$store.commit('showOnlyLayers', {
              first: []
            })
            this.$ga.event({
              eventCategory: 'Tour Step: Welcome to the Tour!',
              eventAction: 'show',
              eventLabel: 'SNAP RCP 6.0'
            })
          }
        }
      })
      tour.addStep({
        title: 'General Circulation Models',
        text: `
        <p>Projecting into the future using <a href="https://www.gfdl.noaa.gov/climate-modeling/" target="_blank">General Circulation Model</a> (GCM) data will always include uncertainties. To address this, <a href="https://www.snap.uaf.edu/methods/models" target="_blank">SNAP provides five GCMs that perform best over the Arctic</a> as well as an average of those 5 models. This "5 Model Average" is generally more statistically accurate than any individual model; however, the average value does smooth out extreme values. If extreme values are of interest, it's best to use a series of individual GCMs.</p>`,
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
        <p><b>RCP 2.6:</b> Forcing peaks at ~3 W / m<sup>2</sup> mid-century and drops to 2.6 W / m<sup>2</sup> by 2100. Greenhouse gas emissions drop substantially over time. </p>
        <p><b>RCPs 4.5 and 6.0:</b> Forcing stabilizes soon after 2100 at 4.5 and 6.0 W / m<sup>2</sup>, respectively, due to efforts that curb emissions.</p>
        <p><b>RCP 8.5:</b> Forcing values reach 8.5 W / m<sup>2</sup> by 2100 and continue to rise into the next century. Very high greenhouse gas concentrations.</p>
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
        title: 'CO<sub>2</sub> atmospheric concentrations for RCP scenarios',
        text: `
        <p><img align='center' src='static/atmos_concent.png' width=700 height=500></img></p>
        <p style='margin-top: 15px; font-size: 14px;'><i>CO<sub>2</sub> equivalent atmospheric concentrations for RCP scenarios. RCP 8.5 represents "business-as-usual." Visit <a href='http://www.pik-potsdam.de/~mmalte/rcps/' target='_blank'>details and data</a> for additional information.</i></p>`,
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
        <p>A shift in climate patterns is illustrated by the length of the growing season, measured in days. Length of growing season approximates the ice-free season and is defined by the dates between when the mean temperature crosses 0°C in the spring and fall.</p>
        <p>Look at the right-hand map. By the 2090s, the growing season shows a strong warming trend with a longer ice-free season, as shown by darker shades of green. This trend is most notable in the southern area of the map, where the growing season increases by as much as 30 days.</p>
        <p>Map colors are explained in the next tour stop.</p>`,
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
        text: `<p>Use the <span>&#9432;</span> Info button by the name of each layer to see more details and a legend.</p>
        <p>Layer colors represent the length of the growing season. Dark brown means less than 120 days. At the other end of the scale, the darkest green represents a year round growing season.</p>`,
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
        text: `<p>Thanks for checking out this map! Tools like this help to visualize the impacts that a changing climate may have on all Alaska species — including ourselves — and forms an important starting point for discussions about how to respond and adapt to a new Alaska.</p>
        <p>If you have feedback, we’d love to hear from you — <a href="mailto:uaf-mapventure@alaska.edu">please contact us.</a></p>`,
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
#legend {
  display: block;
  padding-bottom: 1em;
}

.shepherd-theme-square-dark sub,sup {
  font-size: 75% !important;
}

.shepherd-theme-square-dark a {
  color: #0099ff;
}

table.rcp6-legend.logs {
  margin-bottom: 10px;
  td {
    font-size: 10pt;
    div {
      height: 2em;
      width: 2em;
      border: none;
      margin-right: 5px;
      margin-bottom: 5px;
      &.log-1 { background-color: #6E462D; }
      &.log-2 { background-color: #826139; }
      &.log-3 { background-color: #9C8448; }
      &.log-4 { background-color: #B3A556; }
      &.log-5 { background-color: #CCCC66; }
      &.log-6 { background-color: #9EB54C; }
      &.log-7 { background-color: #749E34; }
      &.log-8 { background-color: #4D8A1E; }
      &.log-9 { background-color: #267300; }
    }
  }
}

table.rcp6-legend.tas {
  margin-bottom: 10px;
  td {
    font-size: 10pt;
    div {
      height: 2em;
      width: 2em;
      border: none;
      margin-right: 5px;
      margin-bottom: 5px;
      &.tas-1 { background-color: #4575B5; }
      &.tas-2 { background-color: #6187B8; }
      &.tas-3 { background-color: #7B98BA; }
      &.tas-4 { background-color: #95ACBD; }
      &.tas-5 { background-color: #AEBDBC; }
      &.tas-6 { background-color: #CAD4BE; }
      &.tas-7 { background-color: #E3E8BE; }
      &.tas-8 { background-color: #FFFFBF; }
      &.tas-9 { background-color: #FFE3A6; }
      &.tas-10 { background-color: #FCC58D; }
      &.tas-11 { background-color: #F7A474; }
      &.tas-12 { background-color: #F2885E; }
      &.tas-13 { background-color: #EB6E4B; }
      &.tas-14 { background-color: #E05138; }
      &.tas-15 { background-color: #D62F27; }
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
