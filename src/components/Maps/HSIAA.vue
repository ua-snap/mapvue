<template>
  <div>
    <mv-header logo="accap"></mv-header>
    <section class="section">
      <div class="container">
        <h1 class="title">Historical Sea Ice Atlas</h1>
        <h2 class="subtitle">Alaska &amp; Arctic sea ice, mid&ndash;1800s to the present.</h2>
        <div class="content">
          <p><strong>We can plan for the future by studying the past.</strong></p>
          <p>If you live in an Alaska coastal community, hunt or fish in a marine environment, work in shipping or oil and gas, serve with the US Coast Guard, research Arctic ecosystems or are otherwise interested in Arctic sea ice data and climate change, this atlas is for you.</p>
          <p>Now you can simultaneously view multiple sources of historical sea ice data from the seas off northern Alaska. Choose a region and time of interest and inspect a map of data collected between the mid-1800s and today, to discover how ice extent and concentration have changed over time.</p>
          <p>The Atlas shows “snapshots” in time, as well as historical trends in arctic sea ice cover and extent. It is not designed for forecasting or prediction, but can provide useful historical context for future planning efforts.</p>
        </div>
      </div>
    </section>
    <section class="section foldout">
      <div class="map--section--wrapper" >
        <div class="map--direct-wrapper" v-bind:class="{ sidelined: foldoutActive }" >
          <div class="map--wrapper">

            <div class="report--show-current-button button" v-on:click="foldoutActive = true" v-bind:class="{ hidden: !validMapPixel }">
              <span class="text">
                Show report for selected location
              </span>
              <span class="icon is-large">
                <i class="fas fa-arrow-right"></i>
              </span>
            </div>

            <!-- Disabling slider until I work on it in new PR
            <div class="date--display">
              <p class="date--display--date">{{ displayDate }}</p>
              <vue-slider v-model="selectedDate" :height="15" :tooltip-formatter="dateFormatter" :max="2016" :hide-label="true" />
            </div>
            -->

            <mv-map ref="map" :baseLayerOptions="baseLayerOptions" :baseLayer="baseLayer" :placeLayer="placeLayer" :crs="crs" :mapOptions="mapOptions"></mv-map>
          </div>
        </div>
        <div v-bind:class="{ sidelined: foldoutActive }" class="report--section">
          <!-- Go back to the map -->
          <div v-on:click="foldoutActive = false" class="button is-link back">
            <span class="icon is-large">
              <i class="fas fa-arrow-left"></i>
            </span>
            <span class="text">
              Back to the map
            </span>
          </div>

          <!-- Loading spinner! -->
          <div class="loading-spinner box" v-bind:class="{ hidden: reportIsLoaded }">
            <div class="loading-spinner--wrapper">
              <span class="icon is-large">
                <i class="fas fa-spin fa-2x fa-spinner"></i>
              </span>
              <span class="text">
                Loading data for this point, hang on&hellip;
              </span>
            </div>
          </div>

          <!-- Show this section once the data are loaded,
            we'll know then if it's valid or not.
          -->
          <div class="report--loaded" v-bind:class="{ hidden: !reportIsLoaded }">
          
            <!-- Notify user of invalid pixel, or hide if it's OK. -->
            <div class="report--invalid" v-bind:class="{ hidden: validMapPixel }">
              <p class="content is-size-5">
                Sorry, but the place you clicked on the map doesn&rsquo;t have any data!  This means it was either on land or otherwise outside of the dataset itself.  <a v-on:click.prevent.stop="foldoutActive = false" href="#">Go back and pick another place on the map</a>.
              </p>
            </div>

            <!-- Report wrapper; hide unless there's data. -->
            <div class="report--charts" v-bind:class="{ hidden: !validMapPixel }">
              
              <h3 class="title is-4">Sea ice, January, 1850&ndash;2018 at {{ latDeg }}&deg;N, {{ lngDeg }}&deg;E</h3>
              
              <Plotly :data="plotlyData" :layout="plotlyLayout" :display-mode-bar="false"></Plotly>

              <!-- Placeholder box for the other open/close chart -->
              <div style="margin: 2rem 0; width: 80%; height: 500px; background-color: #aaa">Placeholder box for the open/close chart to show how this works in the page flow.</div>

            </div>
          </div>

        </div>
      </div>
    </section>
    <section style="padding: 2rem 0;">
      <div class="container">
        
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
import '@fortawesome/fontawesome-free/css/all.css'

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
    this.map = this.$options.components['mv-map'].leaflet.map
    this.map.on('click', this.handleMapClick)
    // Necessary to see the markers.
    this.$L.Icon.Default.imagePath = 'static/'
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
      },
      
      // Lat, lng of current point in EPSG:3857
      latDeg: 0,
      lngDeg: 0,

      // Leaflet Marker object for active point on map.
      marker: undefined,

      // If true, the map slides to the left and a report for
      // a map click is shown.
      foldoutActive: false,

      // Once a data value is loaded, show the results.
      // Probably want to do something tricky in case the
      // user wants to to back to a selected point again.
      reportIsLoaded: false,

      // If true, the selected pixel on the map has data.
      validMapPixel: false
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

      // TODO, this is a pretty grim way of interacting with the
      // underlying Leaflet map... can this be fixed before merging this branch?
      this.$options.components['mv-map'].leaflet.map.addLayer(
        this.layer)
    },
    dateFormatter(dateVal) {
      return getDateFromInteger(dateVal).display
    },
    handleMapClick(event) {
      // If the foldout was active, then clicking on the exposed map
      // is the same as "go back" but won't fire a new load attempt.
      if ( this.foldoutActive === true ) {
        this.foldoutActive = false
        return
      }

      // If the foldout was hidden, then this is an attempt to load new data.  Activate the foldout and try and load new stuff.
      // Setting reportIsLoaded to false ensures the spinner is shown.
      this.foldoutActive = true
      this.reportIsLoaded = false

      // Set the current latlng in the app context
      this.latlng = event.latlng
      
      // If we've already got a point on the map, clear it out
      // until we know if this point is valid or not.
      if(this.marker) {
        this.$options.components['mv-map'].leaflet.map.removeLayer(this.marker)
        this.marker = undefined
      }

      // Set the current lat/lng (in EPSG:3857), for display.
      this.latDeg = Number.parseFloat(event.latlng.lat).toFixed(2)
      this.lngDeg = Number.parseFloat(event.latlng.lng).toFixed(2)

      // var latlng = event.latlng // preserve context for promise below

      // Define and perform Rasdaman query to get the data
      var coords = proj4('EPSG:4326', 'EPSG:3572', [event.latlng.lng, event.latlng.lat])
      var query = "http://apollo.snap.uaf.edu:8080/rasdaman/ows?&SERVICE=WCS&VERSION=2.0.1&REQUEST=GetCoverage&COVERAGEID=hsia_arctic&SUBSET=X(" + coords[0] + ")&SUBSET=Y(" + coords[1] + ")&FORMAT=application/json&RANGESUBSET=Gray"

      return new Promise((resolve) => {
        this.$axios.get(query, { timeout: 120000 }).then(res => {

          if (res) {
            // Set the report as loaded.
            // TODO, this will probably have some tricky
            // additional functions to handle to let the user show
            // the already-selected spot.
            this.reportIsLoaded = true

            // If returned data are all 0's, it's an invalid pixel
            // (or literally never sea ice).  Tell user, and don't
            // show the graphs.
            const reducer = (accumulator, currentValue) => accumulator + currentValue
            let sum = res.data.reduce(reducer)
            if (sum === 0) {
              this.validMapPixel = false
              resolve()
              return
            }

            // Put a marker / popup on the map to show the
            // sidebar again.
            this.marker = this.$L.marker(event.latlng)
            this.marker.addTo(this.$options.components['mv-map'].leaflet.map)

            // Show the reports.
            this.validMapPixel = true

            // Set the report title.

            // Draw a mini-map zoomed in around the point,
            // with a place marker.

            // Draw the sea ice concentration plot.
            this.plotlyData = [{
              x: xrange,
              y: res.data.filter( (value, index) => {
                return index % 12 === 0
              }),
              type: 'scatter'
            }]
            resolve()
          }

          // TODO Something failed, show an error note.

        })
      })
    }
  }
}

</script>
<style lang="scss" scoped>
section.foldout {
  padding: 3rem 0;
  position: relative;
}

.map--section--wrapper {
  
  display: grid;
  
  grid-template-columns: 100vw 85vw;
  grid-gap: 1.5rem;

  width: 200vw;

  .map--direct-wrapper {
    position: relative;
    height: 100vh;
    opacity: 1;
    transition: transform .5s ease;

    &.sidelined {
      opacity: 0.3;
      transform: translateX(-95vw);
      -webkit-transform: translateX(-95vw);

      // Move the zoom control so it's hidden
      // when the foldout is active
      /deep/ .leaflet-right .leaflet-control.leaflet-control-zoom {
        margin-right: 5vw;
      }
    }

    .map--wrapper {
      height: 100vh;
      position: relative;

      .report--show-current-button {
        position: absolute;
        top: 1.5rem;
        left: 1.5rem;
        z-index: 10000;
        box-shadow: 0 0 1rem rgba(0, 0, 0, 0.25);

        &.hidden {
          display: none;
        }
      }

      .date--display {
        /deep/ .vue-slider-rail {
          background-color: #fff !important;
          box-shadow: 0 2px 6px #888;
        }

        width: 80%;
        z-index: 5000;
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
  }

  .report--section {
    position: relative;

    // When the report is not shown (no `sideline` class)
    // we need to clip it.
    overflow-y: hidden;
    height: 100vh;
    padding-left: 1.5rem;

    &.sidelined {
      height: auto;
      transition: transform .5s ease;
      transform: translateX(-95vw);
      -webkit-transform: translateX(-95vw);
    }

    .loading-spinner {
      margin: 2rem 0;

      &.hidden {
        display: none;
      }

      .loading-spinner--wrapper {
        position: relative;
        span.icon {
          position: relative;
          top: .4rem;
        }
      }

    }

    .report--loaded {
      margin: 2rem 0;
      &.hidden, .hidden {
        display: none;
      }

      .report--charts {
      }

      .report--invalid {
        margin: 3rem 0;
      }

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
