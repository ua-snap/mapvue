<template>
  <div>
    <mv-header logo="accap"></mv-header>
    <section class="section">
      <div class="container">
        <h1 class="title">Historical Sea Ice Atlas</h1>
        <h2 class="subtitle">Alaska & Arctic sea ice, mid&ndash;1800s to the present.</h2>
        <div class="content">
          <p><strong>We can plan for the future by studying the past.</strong></p>
          <p>If you live in an Alaska coastal community, hunt or fish in a marine environment, work in shipping or oil and gas, serve with the US Coast Guard, research Arctic ecosystems or are otherwise interested in Arctic sea ice data and climate change, this atlas is for you.</p>
          <p>Now you can simultaneously view multiple sources of historical sea ice data from the seas off northern Alaska. Choose a region and time of interest and inspect a map of data collected between the mid-1800s and today, to discover how ice extent and concentration have changed over time.</p>
          <p>The Atlas shows “snapshots” in time, as well as historical trends in arctic sea ice cover and extent. It is not designed for forecasting or prediction, but can provide useful historical context for future planning efforts.</p>
        </div>
      </div>
    </section>
    <section class="section map--section" style="position: relative;">
      <div class="date--display">
        <p class="date--display--date">{{ displayDate }}</p>
        <vue-slider v-model="selectedDate" :height="15" :tooltip-formatter="dateFormatter" :max="2016" :hide-label="true" />
      </div>
      <mv-map ref="map" :baseLayerOptions="baseLayerOptions" :baseLayer="baseLayer" :placeLayer="placeLayer" :crs="crs" :mapOptions="mapOptions"></mv-map>
    </section>
    <sidebar :mapObj="map"></sidebar>
    <section style="padding: 2rem 0;">
      <div class="container">
        <Plotly :data="plotlyData" :layout="plotlyLayout" :display-mode-bar="false"></Plotly>
        <div class="content">
          <h2 class="title is-4">Challenges of data collection and interpretation</h2>
          <p>Collecting sea ice data has always been difficult and dangerous work. Interpreting data is not dangerous, but remains difficult due to differences in historic interpretations of ice concentration from modern protocols as well as instrument calibrations and sensors (human observation, radar, satellites) over time.</p>
          <p>Challenges faced by the Atlas data team included questions such as, Which hard copy maps to digitize? How do we interpret this handwriting? How do we fill gaps in the data record? Which time scale is best to use?</p>
          <h2 class="title is-5">Data sources in this atlas</h2>
          <dl>
            <dt>Analog filling of spatial and temporal gaps</dt>
            <dd>Spatial and temporal gaps in a given grid filled with best analog representations of the given month.</dd>
            <dt>Arctic and Antarctic Research Institute (AARI) </dt>
            <dd>Located in St. Petersburg, Russia, AARI produces sea ice charts for safety of navigation in the Eurasian Arctic and other operational and scientific purposes. Chart coverage focuses on the Northern Sea Route, although later charts extend into the central Arctic. Charts contain several categories of ice concentration.</dd>
          </dl>
          <p><a class="button">Show more...</a></p>
        </div>
      </div>
    </section>
    <mv-footer></mv-footer>
  </div>
</template>
<script>
/* eslint new-cap: "off" */
/* global process */
/* eslint-disable */
import _ from 'lodash'
import MapInstance from '@/components/MapInstance'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'
import moment from 'moment'
import proj4 from 'proj4'
import { Plotly } from 'vue-plotly'

// Convert an integer (0 - end of data series)
// into two strings: one for display,
// and the other for the WMS request.
var getDateFromInteger = function(num) {
  var dateObj = moment({ day: 1, month: num % 12, year: 1850 + (Math.floor(num / 12)) })
  return {
    display: dateObj.format('MMMM, YYYY'),
    wms: '"' + dateObj.format('YYYY-MM-DDT00:00:00.000[Z]') + '"'
  }
}

var xrange = []
for(let x = 1850; x <= 2018; x++) {
  xrange.push(x)
}

export default {
  name: 'HSIAA',
  extends: MapInstance,
  components: {
    VueSlider,
    Plotly
  },
  created() {
    this.debouncedUpdateAtlas = _.debounce(this.updateAtlas, 500)
  },
  mounted() {
    this.updateAtlas()
    this.$options.components['mv-map'].leaflet.map.on('click', this.handleMapClick)
  },
  data() {
    return {
      title: 'Historical Sea Ice Atlas of Alaska & the Arctic',
      abstract: `
<h1>Historical Sea Ice Atlas of Alaska & the Arctic</h1>
`,
      mapOptions: {
        zoom: 0,
        minZoom: 0,
        maxZoom: 5,
        center: [64, -155],
        scrollWheelZoom: false
      },
      baseLayerOptions: {
        transparent: true,
        srs: 'EPSG:3572',
        format: 'image/png',
        version: '1.3.0',
        continuousWorld: true // needed for non-3857 projs
      },
      selectedDate: 0,
      displayDate: "",
      plotlyData: [],
      plotlyLayout: {
        title: 'Sea Ice Concentration, January',
      }
    }
  },
  computed: {
    crs() {
      // We need to modify the default pan-Arctic
      // projection to avoid a bug.
      var proj = new this.$L.Proj.CRS('EPSG:3572',
        '+proj=laea +lat_0=90 +lon_0=-150 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs', {
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
    baseLayer() {
      return new this.$L.tileLayer.wms(
        process.env.GEOSERVER_WMS_URL,
        _.extend(this.baseLayerOptions, {
          layers: ['arctic_osm_3572']
        })
      )
    },
    placeLayer() {
      // Not needed for this map since it's ocean.
      return
    }
  },
  watch: {
    selectedDate: function(prev, selected) {
      this.debouncedUpdateAtlas()
    }
  },
  methods: {
    updateAtlas() {
      var dates = getDateFromInteger(this.selectedDate)
      this.displayDate = dates.display
      if (this.layer) {
        this.$options.components['mv-map'].leaflet.map.removeLayer(this.layer)
      }
      this.layer = this.$L.tileLayer.wms(
        'http://apollo.snap.uaf.edu:8080/rasdaman/ows?',
        _.extend(this.baseLayerOptions, {
          layers: ['hsia_arctic'],
          styles: 'hsia',
          version: '1.3.0',
          time: dates.wms // need the
        })
      )
      this.$options.components['mv-map'].leaflet.map.addLayer(
        this.layer)
    },
    dateFormatter(dateVal) {
      return getDateFromInteger(dateVal).display
    },
    handleMapClick(event) {
      console.log(event)
      var coords = proj4('EPSG:4326', 'EPSG:3572', [event.latlng.lng, event.latlng.lat])
      console.log(coords)
      var query = "http://apollo.snap.uaf.edu:8080/rasdaman/ows?&SERVICE=WCS&VERSION=2.0.1&REQUEST=GetCoverage&COVERAGEID=hsia_arctic&SUBSET=X(" + coords[0] + ")&SUBSET=Y(" + coords[1] + ")&FORMAT=application/json&RANGESUBSET=Gray"

      return new Promise((resolve) => {
        this.$axios.get(query, { timeout: 120000 }).then(res => {
          if (res) {
            console.log(res)
            this.plotlyData = [{
              x: xrange,
              y: res.data.filter( (value, index) => {
                return index % 12 === 0
              }),
              type: 'scatter'
            }]
            resolve()
          }
        })
      })
    }
  }
}

</script>
<style lang="scss" scoped>
.map--section {
  height: 100vh;
  position: relative;

  .date--display {
    /deep/ .vue-slider-rail {
      background-color: #fff !important;
      box-shadow: 0 2px 6px #888;
    }

    width: 80%;
    z-index: 10000;
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 0 0 2rem 3rem;

    p.date--display--date {
      font-family: "Open Sans";
      font-size: 2rem;
      font-weight: 900;
    }
  }
}

.content {
  max-width: 50rem;
}

dt {
  font-weight: bold;
}

dd {
  padding-bottom: 1rem;
}

</style>
