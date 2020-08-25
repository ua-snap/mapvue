<template>
  <div>
    <mv-header></mv-header>
    <section class="section">
      <div class="container">
        <h1 class="title">SNAP Data for a Changing Climate</h1>
        <div class="content">
        </div>
      </div>
    </section>
    <section class="section map--section" style="position: relative;">
      <div class="date--display">
        <p class="date--display--date">{{ displayDate }}</p>
        <vue-slider v-model="selectedDate" :height="15" :tooltip-formatter="dateFormatter" :max="2388" :hide-label="true" />
      </div>
      <mv-map ref="map" :baseLayerOptions="baseLayerOptions" :baseLayer="baseLayer" :placeLayer="placeLayer" :crs="crs" :mapOptions="mapOptions"></mv-map>
    </section>
    <sidebar :mapObj="map"></sidebar>
    <section style="padding: 2rem 0;">
      <div class="container">
        <Plotly :data="plotlyData" :layout="plotlyLayout" :display-mode-bar="false"></Plotly>
        <div class="content">
          <h2 class="title is-4">All about this data!</h2>
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
import querystring from 'querystring'

// Convert an integer (0 - end of data series)
// into two strings: one for display,
// and the other for the WMS request.
var getDateFromInteger = function(num) {
  var dateObj = moment({ day: 1, month: num % 12, year: 1901 + (Math.floor(num / 12)) })
  return {
    display: dateObj.format('MMMM, YYYY'),
    wms: '"' + dateObj.format('YYYY-MM-DDT00:00:00.000[Z]') + '"'
  }
}

// count by months since 1900
var xrange = []
for(let x = 1901; x <= 4289; x++) {
  xrange.push(x)
}

export default {
  name: 'SNAP_RCP_V2',
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
      mapOptions: {
        zoom: 0,
        minZoom: 0,
        maxZoom: 5,
        center: [64, -155],
        scrollWheelZoom: false
      },
      baseLayerOptions: {
        transparent: true,
        srs: 'EPSG:3338',
        format: 'image/png',
        version: '1.3.0',
        continuousWorld: true // needed for non-3857 projs
      },
      selectedDate: 0,
      displayDate: "",
      plotlyData: [],
      plotlyLayout: {
        title: 'Projected future temperature, 2km CMIP5/AR5, 5 Model Average, RCP6.0',
      }
    }
  },
  computed: {
    crs() {
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
    baseLayer() {
      return new this.$L.tileLayer.wms(
        process.env.GEOSERVER_WMS_URL,
        _.extend(this.baseLayerOptions, {
          layers: ['alaska_osm']
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
          layers: ['tas'],
          styles: 'delta',
          version: '1.3.0',
          // time: dates.wms,
          zIndex: 10,
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
      var coords = proj4('EPSG:4326', 'EPSG:3338', [event.latlng.lng, event.latlng.lat])
      console.log(coords)
      // var query = "http://apollo.snap.uaf.edu:8080/rasdaman/ows?&SERVICE=WCS&VERSION=2.0.1&REQUEST=GetCoverage&COVERAGEID=tas&SUBSET=X(" + coords[0] + ")&SUBSET=Y(" + coords[1] + ")&FORMAT=application/json"

      var queryBase = "http://apollo.snap.uaf.edu:8080/rasdaman/ows?&SERVICE=WCS&VERSION=2.0.1&REQUEST=ProcessCoverages&" + querystring.stringify({query:`for $c in (tas) return encode(
  coverage k
  over $y y(0:18)
  values avg($c[X(${coords[0]}),Y(${coords[1]}),ansi(
    ($y * 120):($y * 120) + 120)])
, "json")`})

      // GetCoverage&COVERAGEID=tas&SUBSET=X(" + coords[0] + ")&SUBSET=Y(" + coords[1] + ")&FORMAT=application/json"

      return new Promise((resolve) => {
        this.$axios.get(queryBase, { timeout: 120000 }).then(res => {
          if (res) {
            console.log(res)
            // Make a plot for each month!
            var plots = [
            {
              x: [...Array(18).keys()].map(x => moment({year: (x*10) + 1900}).format('YYYY') + "'s"),
              y: res.data.map(y => y.toFixed(2)),
              type: 'scatter',
              mode: 'markers+lines',
              line: { shape: 'spline' }
            }]
            /*
            var plots = []
            for (let month = 0; month <= 11; month++) {
              plots.push({
                x: xrange,
                y: res.data.filter( (value, index) => {
                  return index % 12 === month
                }),
                type: 'scatter',
                mode: 'markers',
                line: {shape: 'spline'},
                name: moment({month: month}).format('MMMM')
              })
            }
            */
            this.plotlyData = plots
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
