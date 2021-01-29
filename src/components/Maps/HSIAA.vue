<template>
  <div>
    <div class="header-wrapper">
      <mv-header logo="accap" :buttons="navbuttons"></mv-header>
    </div>
    <section class="section lead">
      <div class="container">
        <div class="titles">
          <h1 class="title">Historical Sea Ice Atlas</h1>
          <h2 class="subtitle">
            Alaska &amp; Arctic sea ice, mid&ndash;1800s to the present.
          </h2>
        </div>
        <div class="content">
          <h2 class="title is-4">
            About the HSIA
          </h2>
          <p class="is-size-6">
            <strong>If you live in an Arctic or sub-Arctic coastal community,
            hunt or fish in a marine environment</strong>, work in shipping or
            oil and gas, serve with the Coast Guard, research Arctic
            ecosystems or are otherwise interested in Arctic sea ice data and
            climate change, <strong>this atlas is for you.</strong>
          </p>
          <p class="is-size-6">
            View historical sea ice data from the seas around the circumpolar
            north and discover how ice extent and concentration have changed
            over time. This atlas shows snapshots in time as well as long term
            patterns. It is not designed for forecasting or prediction, but can
            provide useful historical context for future planning efforts.
          </p>
        </div>
      </div>
    </section>
    <section class="section foldout">
      <div class="map--section--wrapper">
        <div
          class="map--direct-wrapper"
          v-bind:class="{ sidelined: foldoutActive }"
        >
          <div class="map--wrapper">
            <div
              class="report--show-current-button button"
              v-on:click="foldoutActive = true"
              v-bind:class="{ hidden: !validMapPixel }"
            >
              <span class="text">
                Show report for selected location
              </span>
              <span class="icon is-large">
                <i class="fas fa-arrow-right"></i>
              </span>
            </div>

            <!-- Slider wrapper! -->
            <div class="date--display">
              <p class="date--display--date">{{ displayDate }}</p>
              <vue-slider v-model="selectedDate" :height="20" :min="1850" :max="2018" :hide-label="true" />
              <span v-on:click="decrementMonth" class="button is-small">
                <i class="fas fa-arrow-alt-circle-left"> Past Month</i>
              </span>
              <span v-on:click="incrementMonth" class="button is-small">
                <i class="fas fa-arrow-alt-circle-right"> Next Month</i>
              </span>
            </div>

            <mv-map
              ref="map"
              :baseLayerOptions="baseLayerOptions"
              :baseLayer="baseLayer"
              :placeLayer="placeLayer"
              :crs="crs"
              :mapOptions="mapOptions"
            ></mv-map>
          </div>
        </div>
        <div
          v-bind:class="{ sidelined: foldoutActive }"
          class="report--section"
        >
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
          <div
            class="loading-spinner box"
            v-bind:class="{ hidden: reportIsLoaded }"
          >
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
          <div
            class="report--loaded"
            v-bind:class="{ hidden: !reportIsLoaded }"
          >
            <!-- Notify user of invalid pixel, or hide if it's OK. -->
            <div
              class="report--invalid"
              v-bind:class="{ hidden: validMapPixel }"
            >
              <p class="content is-size-5">
                Sorry, but the place you clicked on the map doesn&rsquo;t have
                any data! This means it was either on land or otherwise outside
                of the dataset itself.
                <a v-on:click.prevent.stop="foldoutActive = false" href="#"
                  >Go back and pick another place on the map</a
                >.
              </p>
            </div>

            <!-- Report wrapper; hide unless there's data. -->
            <div
              class="report--charts"
              v-bind:class="{ hidden: !validMapPixel }"
            >
              <h3 class="title is-4">
                Sea ice, 1850&ndash;2018 at {{ latDeg }}&deg;N,
                {{ lngDeg }}&deg;E
              </h3>

              <div class="form--controls">
                <form>
                  <div class="field">
                    <label class="label">Choose month or season</label>
                    <div class="control">
                      <div class="select is-multiple">
                        <select v-model="selectedMonthOrSeason" multiple>
                            <option value="0">January</option>
                            <option value="1">February</option>
                            <option value="2">March</option>
                            <option value="3">April</option>
                            <option value="4">May</option>
                            <option value="5">June</option>
                            <option value="6">July</option>
                            <option value="7">August</option>
                            <option value="8">September</option>
                            <option value="9">October</option>
                            <option value="10">November</option>
                            <option value="11">December</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              <Plotly
                :data="concentrationPlotData"
                :layout="concentrationPlotLayout"
                :options="modeBarButtonsToRemove"
                :display-mode-bar="true"
              ></Plotly>

              <Plotly
                :data="thresholdChartData"
                :layout="thresholdChartLayout"
                :display-mode-bar="false"
              ></Plotly>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section style="padding: 2rem 0;">
      <div class="container">
        <div class="content">
          <h2 class="title is-5">
            Data animation
          </h2>
          <p>
            View animations of sea ice extent below either across the entire
            dataset &lpar;Every month from January 1850 to December 2019&rpar; or for
            individual months.
          </p>
          <h2 class="title is-5">Data collection and interpretation</h2>
          <p>
            Collecting and interpreting sea ice data has always been difficult
            work. Challenges stem from differences in historic interpretations
            of ice concentration, different charting conventions, and especially
            changes in available observing tools &lpar;ships, airplanes starting in
            the early 1900s, satellites starting in the 1970s&rpar;
          </p>
          <p>
            Data included in this atlas begins with sea ice observations
            extrapolated from whaling ship log books in the Beaufort, Chukchi,
            and Bering seas starting in 1850.
          </p>
          <p>
            Data gaps from those logs are filled with analog-derived sea
            ice coverage &lpar;longer gaps&rpar; or interpolation &lpar;short gaps&rpar;.
            Other sea ice data sources are incorporated as they came into being
            beginning with information from the Danish Meteorological Institute
            sea ice charts dating back to 1893, through the satellite microwave
            sensor products that became routine in 1978. Find more details on
            the methodology involved in the synthesis of the various data
            sources in this
            <a href="https://www.tandfonline.com/doi/abs/10.1111/j.1931-0846.2016.12195.x" target="_blank">2017 paper in the Journal Arctic</a>.
          </p>
          <p>
            In addition to historical sea ice data covering the seas around the
            state of Alaska, the Atlas features the
            <a href="https://nsidc.org/the-drift/data-update/gridded-monthly-arctic-sea-ice-back-to-1850-for-analysis-or-browsing/" target="_blank">Pan-Arctic SIBT1850 Sea Ice Dataset</a>.
          </p>
          <img src="../../assets/SourcesChart.jpg" width="1000px" height="500px" />
          <p>
            <br/>
            <a href="https://nsidc.org/sites/nsidc.org/files/G10010_V002.0.pdf" target="_blank">See more information on the data sources comprising this atlas.</a>
          </p>
          <h2 class="title is-5">Download data</h2>
          <p>
            Your download will include the entire Historical Sea Ice dataset compiled from the sources listed here, not a subset of selected dates.
          </p>
          <p>
            <a href="http://ckan.snap.uaf.edu/dataset/historical-sea-ice-atlas-observed-estimates-of-sea-ice-concentration-in-alaska-waters" target="_blank">Download this dataset</a>.
          </p>
          <h2 class="title is-5">This Atlas calculates and illustrates these sea ice measurements</h2>
          <dl>
            <dt>Sea ice concentration</dt>
            <dd>
              Amount of sea ice covering an area. Written as the ratio of sea
              ice to water, either a fraction &lpar;8/10&rpar; or percentage &lpar;80&percnt;&rpar; of sea
              ice coverage. &lt;30&percnt; sea ice concentration &equals; navigable by ship. >90&percnt;
              is considered solid ice.

            </dd>
            <dt>Sea ice extent</dt>
            <dd>
              Total area covered by some amount of sea ice at a given time,
              including open water between floes. The Atlas considers sea ice
              &quot;present&quot; if sea ice concentration is &gt;15&percnt;.
              Thus, sea ice extent is the area of sea covered by at least
              15&percnt; ice for a specific date. The Atlas reports monthly averages,
              so the sea ice extent for a given month represents the measured
              or interpolated sea ice extent closest to the middle of that month.
            </dd>
          </dl>
          <p>
            For information about other measurements of sea ice not covered in this atlas see
            <a href="https://nsidc.org/cryosphere/glossary-terms/sea-ice" target="_blank">the National Snow and Ice Data Center’s glossary of terms</a>.
          </p>
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
import _ from "lodash";
import MapInstance from "@/components/MapInstance";
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/default.css";
import moment from "moment";
import proj4 from "proj4";
import { Plotly } from "vue-plotly";
import "@fortawesome/fontawesome-free/css/all.css";

// Convert an integer (0 - end of data series)
// into two strings: one for display,
// and the other for the WMS request.
var getDateFromInteger = function(year, month) {
  var dateObj = moment({ day: 1, month: month, year: year })
  return {
    display: dateObj.format("MMMM, YYYY"),
    wms: '"' + dateObj.format("YYYY-MM-DDT00:00:00.000[Z]") + '"',
  };
};

// Range of years
var xrange = [];
for (let x = 1850; x <= 2018; x++) {
  xrange.push(x);
}

var months = {
  0: "January",
  1: "February",
  2: "March",
  3: "April",
  4: "May",
  5: "June",
  6: "July",
  7: "August",
  8: "September",
  9: "October",
  10: "November",
  11: "December",
};

export default {
  name: "HSIAA",
  extends: MapInstance,
  components: {
    VueSlider,
    Plotly,
  },
  created() {
    this.debouncedUpdateAtlas = _.debounce(this.updateAtlas, 500);
  },
  mounted() {
    this.updateAtlas();
    this.map = this.$options.components["mv-map"].leaflet.map;
    this.map.on("click", this.handleMapClick);
    // Necessary to see the markers.
    this.$L.Icon.Default.imagePath = "static/";
  },
  data() {
    return {
      title: "Historical Sea Ice Atlas of Alaska & the Arctic",
      abstract: `
<h1>Historical Sea Ice Atlas of Alaska & the Arctic</h1>
`,
      mapOptions: {
        zoom: 0,
        minZoom: 0,
        maxZoom: 5,
        center: [64, -155],
        scrollWheelZoom: false,
      },
      baseLayerOptions: {
        transparent: true,
        srs: "EPSG:3572",
        format: "image/png",
        version: "1.3.0",
        continuousWorld: true, // needed for non-3857 projs
      },

      // What year?
      selectedDate: 1850,

      // Increments/decrements month.
      monthOffset: 0,

      // Date displayed on the map.
      displayDate: "",

      // Updated when we get a successful timeseries back.
      // Triggers repaint of Plotly charts.
      timeseriesData: undefined,

      // Actively selected month for concentration chart (0-11, ...)
      selectedMonthOrSeason: 0,

      // Plotly layout objects
      concentrationPlotData: [], // default empty
      concentrationPlotLayout: {
        title: "Sea Ice Concentration, 1850-2018, January",
        yaxis: {
          range: [0, 105],
          fixedrange: true,
        },
        modeBarButtonsToRemove: [
            "zoom2d",
            "pan2d",
            "select2d",
            "lasso2d",
            "zoomIn2d",
            "zoomOut2d",
            "autoScale2d",
            "resetScale2d",
            "hoverClosestCartesian",
            "hoverCompareCartesian",
            "hoverClosestPie",
            "hoverClosest3d",
            "hoverClosestGl2d",
            "hoverClosestGeo",
            "toggleHover",
            "toggleSpikelines",
        ],
        legend: { orientation: "h" },
      },
      modeBarButtonsToRemove: [
          "zoom2d",
          "pan2d",
          "select2d",
          "lasso2d",
          "zoomIn2d",
          "zoomOut2d",
          "autoScale2d",
          "resetScale2d",
          "hoverClosestCartesian",
          "hoverCompareCartesian",
          "hoverClosestPie",
          "hoverClosest3d",
          "hoverClosestGl2d",
          "hoverClosestGeo",
          "toggleHover",
          "toggleSpikelines",
      ],
      thresholdChartData: [],
      thresholdChartLayout: {
        title: "Sea Ice Concentration, 1850-2018",
        height: 1000,
        yaxis: {
          type: "category",
          fixedrange: true,
          range: xrange,
        },
        xaxis: {
          tickmode: "array",
          tickvals: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
          ticktext: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ],
        },
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
      validMapPixel: false,

      // Nav buttons at top of screen used in header component.
      navbuttons: [
        {
          title: "Download data",
          href:
            "http://ckan.snap.uaf.edu/dataset/historical-sea-ice-atlas-observed-estimates-of-sea-ice-concentration-in-alaska-waters",
          class: "is-default",
        },
      ],
    };
  },
  computed: {
    crs() {
      // We need to modify the default pan-Arctic
      // projection to avoid a bug.
      var proj = new this.$L.Proj.CRS(
        "EPSG:3572",
        "+proj=laea +lat_0=87 +lon_0=-155 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs",
        {
          resolutions: [4096, 2048, 1024, 512, 256, 128, 64],
          origin: [-4889334.802954878, -4889334.802954878],
        }
      );

      // trust me.
      // Without this (= pi/2), proj4js returns an undefined
      // value for tiles requested at the North Pole and
      // it causes a runtime exception.
      proj.projection._proj.oProj.phi0 = 1.5708;
      return proj;
    },
    baseLayer() {
      return new this.$L.tileLayer.wms(
        process.env.GEOSERVER_WMS_URL,
        _.extend(this.baseLayerOptions, {
          layers: ["arctic_osm_3572"],
        })
      );
    },
    placeLayer() {
      // Not needed for this map since it's ocean.
      return;
    },
  },
  watch: {
    selectedDate: function(prev, selected) {
      this.debouncedUpdateAtlas();
    },
    selectedMonthOrSeason(val) {
      this.updateConcentrationPlot();
    },
    timeseriesData(data) {
      this.updateConcentrationPlot();
      this.updateThresholdPlot();
    },
    monthOffset: function(prev, selected) {
      this.debouncedUpdateAtlas()
    },
  },
  methods: {
    decrementMonth() {
      this.monthOffset -= 1
      if (this.monthOffset < 0) {
        this.monthOffset = 11
        var newDate = this.selectedDate - 1
        if(newDate < 1850) { newDate = 1850; this.monthOffset = 0 }
        this.selectedDate = newDate
      }
    },
    incrementMonth() {
      this.monthOffset += 1
      if (this.monthOffset > 11) {
        this.monthOffset = 0
        var newDate = this.selectedDate + 1
        if(newDate > 2018) { newDate = 2018; this.monthOffset = 11 }
        this.selectedDate = newDate
      }
    },
    updateConcentrationPlot() {
      if (this.timeseriesData) {
        let traces = [];
        let monthFragment = "";
        // Month was selected
        if (!isNaN(Number(this.selectedMonthOrSeason))) {
          let y = this.timeseriesData.filter((value, index) => {
            return index % 12 === Number(this.selectedMonthOrSeason);
          });
          // Draw the sea ice concentration plot.
          traces = [
            {
              x: xrange,
              y: y,
              type: "scatter",
            },
          ];
          monthFragment = months[this.selectedMonthOrSeason];
        } else {
          // Add a series of traces for the season
          traces = this.selectedMonthOrSeason.map((month) => {
            monthFragment = monthFragment + months[month] + ", "
            let y = this.timeseriesData.filter((value, index) => {
              return index % 12 === Number(month);
            });
            return {
              x: xrange,
              y: y,
              type: "scatter",
              name: months[month],
            };
          });
          // Removes additional space and comma from title of month's chosen
          monthFragment = monthFragment.substring(0, monthFragment.length - 2)
        }
        this.concentrationPlotLayout = {
          title: `Sea Ice Concentration at ${this.latDeg}ºN, ${this.lngDeg}ºE, ${monthFragment}, 1850-2018`,
          yaxis: {
            range: [0, 105],
            fixedrange: true,
          },
          legend: { orientation: "h" },
        };
        this.concentrationPlotData = traces;
      }
    },
    updateThresholdPlot() {
      if (this.timeseriesData) {
        var x = [];
        var y = [];

        let months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        xrange.forEach((year, index) => {
          months.forEach((month) => {
            let dataIndex = (year - 1850) * 12 + (month - 1);
            console.log(dataIndex);
            // Loop as many times as the %conc to fake the "histogram!"
            for (let i = 1; i <= this.timeseriesData[dataIndex]; ++i) {
              x.push(month);
              y.push(year);
            }
          });
        });
        console.log(y);
        this.thresholdChartData = [
          {
            x: x,
            y: y,
            type: "histogram2d",
            autocolorscale: false,
            colorscale: "YlGnBu",
            zmin: 0,
            zmax: 100,
          },
        ];
      }
    },
    updateAtlas() {
      var dates = getDateFromInteger(this.selectedDate, this.monthOffset)
      this.displayDate = dates.display
      if (this.layer) {
        this.$options.components["mv-map"].leaflet.map.removeLayer(this.layer);
      }
      this.layer = this.$L.tileLayer.wms(
        "http://apollo.snap.uaf.edu:8080/rasdaman/ows?",
        _.extend(this.baseLayerOptions, {
          layers: ["hsia_arctic"],
          styles: "hsia",
          version: "1.3.0",
          time: dates.wms,
        })
      );
      this.map.addLayer(this.layer);
    },
    dateFormatter(dateVal) {
      return getDateFromInteger(dateVal).display;
    },
    handleMapClick(event) {
      // If the foldout was active, then clicking on the exposed map
      // is the same as "go back" but won't fire a new load attempt.
      if (this.foldoutActive === true) {
        this.foldoutActive = false;
        return;
      }

      // If the foldout was hidden, then this is an attempt to load new data.  Activate the foldout and try and load new stuff.
      // Setting reportIsLoaded to false ensures the spinner is shown.
      this.foldoutActive = true;
      this.reportIsLoaded = false;

      // Set the current latlng in the app context
      this.latlng = event.latlng;

      // Set the month shown via the map to be the concentration map's initial selection
      this.selectedMonthOrSeason = [this.monthOffset];

      // If we've already got a point on the map, clear it out
      // until we know if this point is valid or not.
      if (this.marker) {
        this.$options.components["mv-map"].leaflet.map.removeLayer(this.marker);
        this.marker = undefined;
      }

      // Set the current lat/lng (in EPSG:3857), for display.
      this.latDeg = Number.parseFloat(event.latlng.lat).toFixed(2);
      this.lngDeg = Number.parseFloat(event.latlng.lng).toFixed(2);

      // var latlng = event.latlng // preserve context for promise below

      // Define and perform Rasdaman query to get the data
      var coords = proj4("EPSG:4326", "EPSG:3572", [
        event.latlng.lng,
        event.latlng.lat,
      ]);
      var query =
        "http://apollo.snap.uaf.edu:8080/rasdaman/ows?&SERVICE=WCS&VERSION=2.0.1&REQUEST=GetCoverage&COVERAGEID=hsia_arctic&SUBSET=X(" +
        coords[0] +
        ")&SUBSET=Y(" +
        coords[1] +
        ")&FORMAT=application/json&RANGESUBSET=Gray";

      return new Promise((resolve) => {
        this.$axios
          .get(query, { timeout: 10000 })
          .then((res) => {
            if (res) {
              // Set the report as loaded.
              this.reportIsLoaded = true;
              this.timeseriesData = res.data;

              // If returned data are all 0's, it's an invalid pixel
              // (or literally never sea ice).  Tell user, and don't
              // show the graphs.
              const reducer = (accumulator, currentValue) =>
                accumulator + currentValue;
              let sum = this.timeseriesData.reduce(reducer);
              if (sum === 0) {
                this.validMapPixel = false;
                resolve();
                return;
              }

              // Put a marker / popup on the map to show the
              // sidebar again.
              this.marker = this.$L.marker(event.latlng);
              this.marker.addTo(this.$options.components["mv-map"].leaflet.map);

              // Show the reports.
              this.validMapPixel = true;

              // Maybe?  Draw a mini-map zoomed in around the point,
              // with a place marker.

              resolve();
            }
          })
          .catch((error) => {
            // TODO Something failed, show an error note.
            this.validMapPixel = false;
            resolve();
            return;
          });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.lead,
.content,
p,
span {
  font-family: "Open Sans", "Helvetica Neue", Calibri, Arial, sans-serif;
}

.header-wrapper {
  background-color: #ebebeb;
  /deep/ nav {
    background-color: #ebebeb;
  }
}

.date--display {
  /deep/ .vue-slider-dot-tooltip-inner {
    font-family: "Open Sans", "Helvetica Neue", Calibri, Arial, sans-serif;
    background-color: rgba(25, 25, 25, 0.50);
    font-weight: 700;
  }
}

section.lead {
  background: no-repeat top left
    url("../../../static/ice_montage_1900_satellite_duo.jpg");
  .titles {
    margin: -2rem 0 300px 6.5rem;
    h1 {
      text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.5);
      color: rgb(255, 246, 229);
      font-weight: 500;
      font-size: 2.75rem;
    }
    h2 {
      text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.5);
      color: rgb(255, 246, 229);
      font-size: 1.25rem;
    }
  }
}

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
    transition: transform 0.5s ease;

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
      transition: transform 0.5s ease;
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
          top: 0.4rem;
        }
      }
    }

    .report--loaded {
      margin: 2rem 0;
      &.hidden,
      .hidden {
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
  padding: 0 10vw;
  text-align: justify;
}

dt {
  font-weight: bold;
}

dd {
  padding-bottom: 1rem;
}
</style>
