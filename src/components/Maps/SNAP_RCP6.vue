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
  <sidebar :mapObj="map"></sidebar>
  <tour :tour="tour"></tour>
  <mv-footer></mv-footer>
</div>
</template>

<script>
/* eslint new-cap: "off" */
import _ from 'lodash'
import MapInstance from '@/components/MapInstance'
import Tour from '../Tour'

var rcps = {
  'rcp45': 'RCP 4.5',
  'rcp60': 'RCP 6.0',
  'rcp85': 'RCP 8.5'
}

export default {
  name: 'SNAP_RCP6',
  extends: MapInstance,
  components: {
    'tour': Tour
  },
  data () {
    return {
      title: 'SNAP Data for a Changing Climate',
      abstract: `<h1>SNAP Data for a Changing Climate</h1><div class="abstractWrapper">
      <h2>Take our short (less than 10 minute) tour and learn:</h1>
      <li class="top">Basic terms used in climate modeling, including Global Climate Models, downscaling, Representative and Extended Concentration Pathways</li>
      <li class="middle">Example SNAP climate data visualizations for temperature and length of growing season, and how they are useful for making meaningful projections of climate in Alaska</li>
      <li class="middle">Links to more information</li>
      <li class="bottom">How to download SNAP data for your own work</li>`,
      mapOptions: {
        zoom: 0,
        minZoom: 0,
        maxZoom: 5,
        center: [62, -135]
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
          'id': 'snap_rcp:logs_2010_rcp6',
          wmsLayerName (params) {
            return {
              name: `logs_5modelAvg_${params.scenario}`,
              time: `${params.decade}-01-01T00:00:00Z`,
              title: `${params.decade}s Length of Growing Season, ${rcps[params.scenario]}`
            }
          },
          'defaults': {
            decade: 2010,
            scenario: 'rcp60'
          },
          'title': '2010s Length of Growing Season, RCP 6.0',
          'legend': false,
          'controls': true
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
          'id': 'snap_rcp:logs_2090_rcp6',
          wmsLayerName (params) {
            return {
              name: `logs_5modelAvg_${params.scenario}`,
              time: `${params.decade}-01-01T00:00:00Z`,
              title: `${params.decade}s Length of Growing Season, ${rcps[params.scenario]}`
            }
          },
          'defaults': {
            decade: 2090,
            scenario: 'rcp60'
          },
          'title': '2090s Length of Growing Season, RCP 6.0',
          'legend': false,
          'controls': true
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
          'id': 'snap_rcp:tas_2010_rcp6',
          wmsLayerName (params) {
            return {
              name: `snap_rcp:tas_decadal_mean_annual_mean_5modelAvg_${params.scenario}`,
              time: `${params.decade}-01-01T00:00:00Z`,
              title: `${params.decade}s Mean Annual Temperature, ${rcps[params.scenario]}`
            }
          },
          'defaults': {
            decade: 2010,
            scenario: 'rcp60'
          },
          'title': '2010s Mean Annual Temperature, RCP 6.0',
          'legend': false,
          'controls': true
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
          'id': 'snap_rcp:tas_2090_rcp6',
          wmsLayerName (params) {
            return {
              name: `snap_rcp:tas_decadal_mean_annual_mean_5modelAvg_${params.scenario}`,
              time: `${params.decade}-01-01T00:00:00Z`,
              title: `${params.decade}s Mean Annual Temperature, ${rcps[params.scenario]}`
            }
          },
          'defaults': {
            decade: 2090,
            scenario: 'rcp60'
          },
          'title': '2090s Mean Annual Temperature, RCP 6.0',
          'legend': false,
          'controls': true
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

      // This value needs to be set for tile requests at the north pole to
      // work properly.
      proj.projection._proj.oProj.phi0 = 1.5708
      return proj
    },
    baseLayer () {
      return new this.$L.tileLayer.wms(
        process.env.GEOSERVER_WMS_URL,
        _.extend(this.baseLayerOptions, {
          layers: 'arctic_osm_3572'
        })
      )
    },
    placeLayer () {
      return new this.$L.tileLayer.wms(
        process.env.GEOSERVER_WMS_URL,
        _.extend(this.baseLayerOptions, {
          zIndex: 101,
          layers: 'arctic_places_osm_3572'
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
        title: 'Climate Modeling Basics: GCMs, Downscaling, and RCPs',
        text: `
        <p><b>A Global Climate Model (GCM)</b> is a type of General Circulation Model that focuses on projections of climate change by simulating how Earth’s physical processes respond to increasing greenhouse gas concentrations. SNAP projections use 5 GCMs that perform best in the Arctic, as well as a 5-model average.</p>
        <p>SNAP <b>downscales</b> GCM climate data to “zoom in” and generate regionally relevant data at higher resolutions. Here, notice how the large-scale GCM data (L) have been converted to a scale that makes more sense for Alaska (R).</p>
        <p><b>Representative and Extended Concentration Pathways (RCPs and ECPs)</b> describe possible future climates based on atmospheric greenhouse gas concentrations. RCPs (projections to 2100) and ECPs (projections beyond 2100) provide a basis for comparison and a “common language” for modelers to share their work.</p>
        <p>This tool uses an RCP value of 6.0, which assumes that greenhouse gas emissions peak in 2080 and then decline.</p>
        <h2>Learn more</h2>
        <ul>
  <li>
    <a href="https://www.snap.uaf.edu/methods/models">SNAP&rsquo;s model selection process </a>
  </li>
  <li>
    <a href="https://www.snap.uaf.edu/methods/downscaling">SNAP&rsquo;s downscaling process</a>
  </li>
  <li>
    <a href="https://www.cicero.oslo.no/en/posts/news/a-guide-to-representative-concentration-pathways">RCPs, explained</a>
  </li>
  <li>
    <a href="http://www.pik-potsdam.de/~mmalte/rcps/">How RCP concentrations are calculated</a>
  </li>
</ul>`,
        classes: 'shepherd-theme-square-dark',
        buttons: [{
          text: 'Next',
          action: tour.next
        }],
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
        title: 'Climate Data Example 1: Changes in temperature for the 2010s (L) and 2090s (R)',
        text: `<p>This is a decadal average of mean annual temperature for the 2010s and 2090s. Viewed side-by-side with the same color scale, it’s apparent that mean annual temperature is projected to increase.  </p>
<p><b>The shift is most notable in northern Alaska</b>:  See how the colors transition to lighter shades of blue or to red, denoting warmer temperatures. </p>
<p><b>What do the colors mean?</b> Use the ⓘ Info button by the name of each layer to see more details and a legend. </p>`,
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
        title: 'Climate Data Example 2: Changes in growing season length (days) for the 2010s (L) and 2090s (R)',
        text: `
        <p>These maps use the length of the growing season to illustrate a shift in climate patterns. Length of growing season approximates the ice-free season. It&rsquo;s defined by the dates between when the mean temperature crosses 0°C in the spring and fall.</p>
        <p><b>Look at the right-hand map. </b>By the 2090s, the growing season shows a strong warming trend with a longer ice-free season, as shown by darker shades of green. This trend is most notable in the southern area of the map, where the growing season increases by as much as 30 days.</p>
        <p><b>What do the colors mean? </b>&nbsp;Use the ⓘ Info button by the name of each layer to see a legend and details.
        </p>`,
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
            this.map.setView([68.009, -153.554], 2)
            this.$ga.event({
              eventCategory: 'Tour Step: Side-by-side maps showing changes in temperature',
              eventAction: 'show',
              eventLabel: 'SNAP RCP 6.0'
            })
          }
        }
      })
      tour.addStep({
        title: 'Use our Community Charts tool to see temperature and precipitation projections for hundreds of communities across Alaska and Canada.',
        text: `
        <p>Browse and download all SNAP data <a href="https://www.snap.uaf.edu/tools/data-downloads">here</a></p>

<p>Need a spatial subset of data? <a href="https://github.com/ua-snap/data-recipes/tree/master/extract_by_polygon">This R script</a> can be adapted to subset a time series of this dataset for a region specified by a shapefile, producing CSV output that can then be graphed or visualized in other ways.</p>
<p>Thanks for your time! SNAP uses data visualizations like these to help show the impacts that a changing climate may have on Alaska—and foster discussions about how to respond and adapt. <a href="mailto:nlfresco@alaska.edu">Please contact us</a> with questions or feedback.</p>`,
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
            this.map.setView([60.994, -148.69], 2)
            this.$ga.event({
              eventCategory: 'Tour Step: Side-by-side maps showing changes in growing season length',
              eventAction: 'show',
              eventLabel: 'SNAP RCP 6.0'
            })
          }
        }
      })
      return tour
    }
  },
  methods: {
    openCommCharts () {
      window.open('https://www.snap.uaf.edu/tools/community-charts', '_blank')
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
  text-align: center;
}

.downscaling_image {
  width: 556px;
  height: 253px;
  text-align: center;
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

.downscaling-wrapper {
  width: 556px;
  margin: auto;
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
