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
      abstract: `
<h1>SNAP Data for a Changing Climate</h1>
<div class="abstractWrapper">
  <p>This map showcases some popular climate projection data from the Scenarios Network for Alaska + Arctic Planning group at the University of Alaska, Fairbanks.  A short tour of the map introduces basic terms used in climate modeling, including Global Climate Models, downscaling, and Representative/Extended Concentration Pathways.  The interactive map lets you explore temperature and length of growing season data from three different climate scenarios for 2010&mdash;2090.</p>
`,
      mapOptions: {
        zoom: 0,
        minZoom: 0,
        maxZoom: 5,
        center: [62.94840214681834, -149.7961770609005]
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
          id: 'community-charts-button',
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
        <p><b>A Global Climate Model (GCM)</b> is a type of General Circulation Model that focuses on projections of climate change by simulating how Earth’s physical processes respond to increasing greenhouse gas concentrations. <a href="https://www.snap.uaf.edu/methods/models" target="_blank">SNAP projections use 5 GCMs that perform best in the Arctic</a>, as well as a 5-model average.</p>
        <img class="downscaling" src="static/downscale-background_optim.jpg"/>
        <p>SNAP <a href="https://www.snap.uaf.edu/methods/downscaling" target="_blank"><b>downscales</b></a> GCM climate data to “zoom in” and generate regionally relevant data at higher resolutions. Here, notice how the coarser, global-scale GCM data (L) have been converted to a more detailed scale that makes better sense for Alaska (R).</p>
        <p><a target="_blank" href="https://www.cicero.oslo.no/en/posts/news/a-guide-to-representative-concentration-pathways"><b>Representative and Extended Concentration Pathways (RCPs and ECPs)</b></a> describe possible future climates based on atmospheric greenhouse gas concentrations. RCPs (projections to 2100) and ECPs (projections beyond 2100) provide a <a href="http://www.pik-potsdam.de/~mmalte/rcps/" target="_blank">basis for comparison and a “common language”</a> for modelers to share their work.</p>`,
        classes: 'downscaling-image',
        buttons: [{
          text: 'Next',
          action: tour.next
        }],
        when: {
          show: () => {
            this.$store.commit('hideDualMaps')
            this.$store.commit('disableSyncMaps')
            this.$store.commit('hideLayerMenu')
            this.$store.commit('showOnlyLayers', {
              first: []
            })
          }
        }
      })
      tour.addStep({
        title: 'Changes in temperature',
        text: `
<p>These layers show a decadal average of mean annual temperature for the 2010s (left) and 2090s (right). Viewed side-by-side with the same color scale, it&rsquo;s apparent that mean annual temperature is projected to increase.</p>
<p><b>The shift is most notable in northern Alaska</b>:  See how the colors transition to lighter shades of blue or to red, denoting warmer temperatures.</p>
`,
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
          }
        }
      })

      tour.addStep({
        title: 'What do the colors mean?',
        attachTo: 'a.info bottom',
        buttons: buttons,
        text: '<p>Use the ⓘ Info button by the name of each layer to see more details and a legend.</p>',
        highlightClass: 'tour-highlighted',
        when: {
          show: () => {
            this.$store.commit('showLayerMenu')
          },
          hide: () => {
            this.$store.commit('hideLayerMenu')
          }
        }
      })

      tour.addStep({
        title: 'Changes in growing season length',
        text: `
        <p>These layers use the length of the growing season to illustrate a shift in climate patterns. Length of growing season approximates the ice-free season. It&rsquo;s defined by the dates between when the mean temperature crosses 0°C in the spring and fall.</p>
        <p><b>Look at the right-hand map. </b>By the 2090s, the growing season shows a strong warming trend with a longer ice-free season, as shown by darker shades of green. This trend is most notable in the southern area of the map, where the growing season increases by as much as 30 days.</p>`,
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
          }
        }
      })

      tour.addStep({
        title: 'Community Charts',
        text: `Use our Community Charts tool (left) to see temperature and precipitation projections for communities across Alaska and Canada.`,
        attachTo: '#community-charts-button>button right',
        highlightClass: 'tour-highlighted',
        buttons: buttons,
        when: {
          show: () => {
            this.$store.commit('showLayerMenu')
          },
          hide: () => {
            this.$store.commit('hideLayerMenu')
          }
        }
      })

      tour.addStep({
        title: 'Accessing SNAP data',
        text: `
<p>Access all SNAP data <a href="https://www.snap.uaf.edu/tools/data-downloads" target="_blank">here</a>.</p>
<p><b>Need a spatial subset of data?</b> <a href="https://github.com/ua-snap/data-recipes/tree/master/extract_by_polygon" target="_blank">This R script</a> can be adapted to subset a time series of this dataset for a region specified by a shapefile, producing CSV output that can then be graphed or visualized in other ways.</p>
<p><b>Thanks for your time!</b> <a href="mailto:nlfresco@alaska.edu">Please contact us</a> with questions or feedback.</p>`,
        buttons: buttons
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

.shepherd-element.downscaling-image {
  width: 200%;
  position: relative;
  left: -50%;
}

.downscaling {
  display: block;
  margin: 1em auto;
  width: 500px;
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
    background: rgba(255, 255, 255, .8);
    border-radius: 1ex;
    margin: 1em;
    padding: .25rem 1rem;

    @media screen and (min-width: 769px) {
      max-width: 75%;
    }

    @media screen and (max-width: 768px) {
      width: 75%;
      border-radius: 0;
      margin: 0;
      font-size: 10pt;
      ul {
        margin-right: 1em;
      }
    }
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
