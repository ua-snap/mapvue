<template>
  <div>
  <h1 class="map-title">{{ title }}</h1>
  <layer-menu :buttons="buttons"></layer-menu>
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
      abstract: `<h1>SNAP Data for a Changing Climate</h1><div class="abstractWrapper"><p class="top">The tour for this map provides a basic explanation of terms used in climate modeling, such as General Circulation Models, downscaling, and Representative Concentration Pathways.</p>
      <p class="middle">It also gives context for two SNAP climate datasets - <b>temperature and length of growing season</b> - and highlights their usefulness in making meaningful projections of climate in Alaska.</p>
      <p class="bottom">Finally, you’ll learn where to find more details on tour topics, and where to go to download SNAP data for your own work.</p>`,
      mapOptions: {
        zoom: 1,
        minZoom: 0,
        maxZoom: 6,
        center: [64, -160]
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
      return new this.$L.Proj.CRS('EPSG:3338',
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
    },
    baseLayer () {
      return new this.$L.tileLayer.wms(
        process.env.GEOSERVER_WMS_URL,
        _.extend(this.baseLayerOptions, {
          layers: 'alaska_osm'
        })
      )
    },
    placeLayer () {
      return new this.$L.tileLayer.wms(
        process.env.GEOSERVER_WMS_URL,
        _.extend(this.baseLayerOptions, {
          zIndex: 101,
          layers: 'alaska_places_osm_3338'
        })
      )
    },
    buttons () {
      return [
        {
          text: 'Download our data',
          callback: this.openDownloadData
        },
        {
          text: 'View Community Charts',
          callback: this.openCommCharts
        },
        {
          text: 'Show other tools',
          callback: this.openOtherTools
        }
      ]
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
        title: 'What is a General Circulation Model (GCM)?',
        text: `
        <p>GCMs represent physical processes in the atmosphere, ocean, cryosphere, and land surface. They are the most advanced tools currently available for simulating the response of the global climate system to increasing greenhouse gas concentrations.</p>
        <p><b>SNAP uses GCMs strategically</b></p>
        <p>Projecting into the future using GCM data will always include uncertainties. To address this, SNAP provides 5 GCMs that perform best over the Arctic, as well as an average of those 5 models.</p>
        <p>This "5 Model Average" is generally more statistically robust than any individual model; however, the average value does smooth out extreme values. If extreme values are of interest, it's best to use a series of individual GCMs.</p>
        <p><a href="https://www.snap.uaf.edu/methods/models" target="_blank">Learn more about how we select our models</a></p>
        <p class="tour_step_number"><b>(1/9)</b></p>`,
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
              eventCategory: 'Tour Step: What is a General Circulation Model?',
              eventAction: 'show',
              eventLabel: 'SNAP RCP 6.0'
            })
          }
        }
      })
      tour.addStep({
        title: 'What makes SNAP data different from “regular” GCM data?',
        text: `
        <div><table class="downscaling"><tr><td>Original Data</td><td>Downscaled Data</td></tr></table><p class="downscaling_image"><img src='static/snap_downscaling.png'/></p></div>
        <p></p><p>SNAP downscales climate data from global models to generate locally relevant data at higher resolutions. The downscaling process connects global-scale projections with smaller-scale dynamics to create regionally specific projections.</p>
        <p>SNAP data adds value to GCM projections by making them more relevant and useful for making decisions about climate change.</p>
        <p><a href='https://www.snap.uaf.edu/methods/downscaling' target='_blank'>Learn more about our downscaling process</a></p>
        <p class="tour_step_number"><b>(2/9)</b></p>`,
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
              eventCategory: 'Tour Step: What makes SNAP data different from “regular” GCM data?',
              eventAction: 'show',
              eventLabel: 'SNAP RCP 6.0'
            })
          }
        }
      })
      tour.addStep({
        title: `<p>What are Representative Concentration</p>
         <p>Pathways and how are they useful?</p>`,
        text: `
        <p>Just as it’s good to use multiple GCMs, it’s also good to look at multiple scenarios when using climate data, in order to show the most complete picture of possible future climate trends.</p>
        <p>The Intergovernmental Panel on Climate Change describes 4 potential future scenarios known as Representative Concentration Pathways (RCPs).</p>
        <p>RCPs are used by those running GCMs to model what the climate might be like in the future, and to ensure that modelers start from the same place and agree on the same assumptions. RCPs provide a “common language” for comparing results and sharing findings.</p>
        <p class="tour_step_number"><b>(3/9)</b></p>`,
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
              eventCategory: 'Tour Step: What are Representative Concentration Pathways and how are they useful?',
              eventAction: 'show',
              eventLabel: 'SNAP RCP 6.0'
            })
          }
        }
      })
      tour.addStep({
        title: 'RCPs illustrate 3 major values',
        text: `
        <p><b>1) Radiative forcing</b> — how much energy is at the Earth’s surface, measured in watts per square meter, by the year 2100. This is the metric that the RCP numbers are based upon, i.e. RCP 2.6, 4.5, 6.0, and 8.5.</p>
        <p><b>2) Emission rates</b> — how fast we add greenhouse gases into the atmosphere
        <p><b>3) Emission concentrations</b> — measured in parts per million for CO<sub>2</sub>, methane, and other greenhouse gases
        <p class="tour_step_number"><b>(4/9)</b></p>`,
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
              eventCategory: 'Tour Step: RCPs illustrate',
              eventAction: 'show',
              eventLabel: 'SNAP RCP 6.0'
            })
          }
        }
      })
      tour.addStep({
        title: 'RCPs simulate results of climate-warming mitigation efforts',
        text: `
        <p><b>RCP 2.6: Strong mitigation efforts.</b> Forcing peaks at ~3 W / m<sup>2</sup> mid-century and drops to 2.6 W / m<sup>2</sup> by 2100. Greenhouse gas emissions drop substantially over time. </p>
        <p><b>RCPs 4.5 and 6.0: Moderate mitigation efforts.</b> Forcing stabilizes soon after 2100 at 4.5 and 6.0 W / m<sup>2</sup>, respectively, due to efforts that curb emissions.</p>
        <p><b>RCP 8.5: "Business as usual."</b> Forcing values reach 8.5 W / m<sup>2</sup> by 2100 and continue to rise into the next century. Very high greenhouse gas concentrations.</p>
        <div><p class="atmos_conc_image"><img src='static/atmos_concent.png' </img></p>
        <p class="annotation_text"><i>CO<sub>2</sub> equivalent atmospheric concentrations for RCP scenarios.</p><p class="annotation_text">Visit <a href='http://www.pik-potsdam.de/~mmalte/rcps/' target='_blank'>details and data</a> for additional information or <a href="http://sedac.ipcc-data.org/ddc/ar5_scenario_process/RCPs.html" target="_blank">learn more about RCPs</a></p></i></div>
        <p class="tour_step_number"><b>(5/9)</b></p>`,
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
              eventCategory: 'Tour Step: RCPs simulate results of climate-warming mitigation efforts',
              eventAction: 'show',
              eventLabel: 'SNAP RCP 6.0'
            })
          }
        }
      })
      tour.addStep({
        title: 'Side-by-side maps showing changes in temperature',
        text: `
        <p>Example of a decadal average of mean annual temperature for the 2010s and 2090s. Viewed side-by-side with the same color scale, it’s apparent that mean annual temperature is projected to increase. This is most notable in northern Alaska—where blue colors transition to lighter shades of blue or to red, denoting warmer temperatures.</p>
        <p class="tour_step_number"><b>(6/9)</b></p>`,
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
            this.primaryMapObject.setView([68.009, -153.554], 2)
            this.$ga.event({
              eventCategory: 'Tour Step: Side-by-side maps showing changes in temperature',
              eventAction: 'show',
              eventLabel: 'SNAP RCP 6.0'
            })
          }
        }
      })
      tour.addStep({
        title: 'Side-by-side maps showing changes in growing season length',
        text: `
        <p>A shift in climate patterns is illustrated by the length of the growing season, measured in days. Length of growing season approximates the ice-free season and is defined by the dates between when the mean temperature crosses 0°C in the spring and fall.</p>
        <p>Look at the right-hand map. By the 2090s, the growing season shows a strong warming trend with a longer ice-free season, as shown by darker shades of green. This trend is most notable in the southern area of the map, where the growing season increases by as much as 30 days.</p>
        <p>Map colors are explained in the next tour stop.</p>
        <p class="tour_step_number"><b>(7/9)</b></p>`,
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
            this.primaryMapObject.setView([60.994, -148.69], 2)
            this.$ga.event({
              eventCategory: 'Tour Step: Side-by-side maps showing changes in growing season length',
              eventAction: 'show',
              eventLabel: 'SNAP RCP 6.0'
            })
          }
        }
      })
      tour.addStep({
        title: 'What do the colors mean?',
        text: `
        <p>Use the <span>&#9432;</span> Info button by the name of each layer to see more details and a legend.</p>
        <p>Layer colors represent the length of the growing season. Dark brown means less than 120 days. At the other end of the scale, the darkest green represents a year round growing season.</p>
        <p class="tour_step_number"><b>(8/9)</b></p>`,
        when: {
          show: () => {
            this.$store.commit('showDualMaps')
            this.$store.commit('enableSyncMaps')
            this.$store.commit('hideLayerMenu')
            this.$store.commit('showOnlyLayers', {
              first: ['snap_rcp:logs_2010_rcp6'],
              second: ['snap_rcp:logs_2090_rcp6']
            })
            this.primaryMapObject.setView([60.994, -148.69], 2)
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
        title: 'End of tour - thanks for your time!',
        text: `
        <p>We hope this tour has shown how SNAP data fits into the larger contexts of climate modeling. Data visualizations such as this interactive map help show the impacts that a changing climate may have on all Alaska species — including ourselves — and form an important starting point for discussions about how to respond and adapt to a new Alaska.</p>
        <p><b>Download our data</b></p>
        <ul><li>Download our data <a href="https://www.snap.uaf.edu/tools/data-downloads" target="_blank">here</a></li>
        <li>Need data for a specific community? Try our <a href="https://www.snap.uaf.edu/sites/all/modules/snap_community_charts/charts.php" target="_blank">Community Charts Tool</a>.</li>
        <li>Need a spatial subset of data for your area of interest? <a href="https://github.com/ua-snap/data-recipes/tree/master/extract_by_polygon" target="_blank">This R script</a> can be adapted to subset a timeseries of this dataset for a region specified by a shapefile, producing CSV output that can the be graphed or visualized in other ways.</li></ul>
        <p>If you have feedback, we’d love to hear from you — <a href="mailto:uaf-mapventure@alaska.edu">please contact us.</a></p>
        <p class="tour_step_number"><b>(9/9)</b></p>`,
        when: {
          show: () => {
            this.primaryMapObject.setView([64, -160], 1)
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
  },
  methods: {
    openCommCharts () {
      window.open('https://www.snap.uaf.edu/sites/all/modules/snap_community_charts/charts.php', '_blank')
    },
    openDownloadData () {
      window.open('https://www.snap.uaf.edu/tools/data-downloads', '_blank')
    },
    openOtherTools () {
      window.open('https://snap.uaf.edu/tools-and-data/all-analysis-tools', '_blank')
    }
  }
}
</script>
<style lang="scss">
#legend {
  display: block;
  padding-bottom: 1em;
}

.tour_step_number {
  font-size: 12px;
  text-align: right;
}

.annotation_text {
  font-size: 12px !important;
  margin-bottom: 0px !important;
}

.downscaling_image {
  width: 556px;
  height: 253px;
}

.atmos_conc_image {
  text-align: center;
  img {
    max-width: 500px;
  }
}

.shepherd-theme-square-dark sub,sup {
  font-size: 75% !important;
}

.shepherd-theme-square-dark a {
  color: #0099ff;
}

.shepherd-theme-square-dark li {
  line-height: 1.35em !important;
}

.shepherd-title {
  font-size: 16px !important;
}

.shepherd-text {
  font-size: 14px !important;
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

table.downscaling {
  width: 556px;

  td {
    text-align: center;
    width: 278px;
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
    font-size: 30pt;
    padding: 1ex;
    color: #000;
  }
  color: #222;
  a {
    color: #438bca;
  }
  p.top {
    padding: 1em 1em 0.25em 1em;
    font-size: 20px;
  }
  p.middle {
    padding: 0.25em 1em 0.25em 1em;
    font-size: 20px;
  }
  p.bottom {
    padding: 0.25em 1em 1em 1em;
    font-size: 20px;
  }
  ul {
    li {
    }
    margin-bottom: 1em;
  }

  .abstractWrapper {
    @media screen and (max-width: 768px) {
      width: 75%;
      border-radius: 0;
      margin: 0;
      font-size: 10pt;
      ul {
        margin-right: 1em;
      }
    }
    @media screen and (min-width: 769px) {
      max-width: 75%;
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
