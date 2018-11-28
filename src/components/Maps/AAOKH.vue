<template>
<div class='aaokh'>
  <h1 class='map-title' v-html="title"></h1>
  <layer-menu :buttons="buttons"></layer-menu>
  <aaokh-splash-screen
    :abstract='abstract'></aaokh-splash-screen>
  <mv-map
    ref='map'
    :baseLayerOptions='baseLayerOptions'
    :baseLayer='baseLayer'
    :placeLayer='placeLayer'
    :crs='crs'
    :mapOptions='mapOptions'
    :local-layers="localLayers"
  ></mv-map>
  <sidebar :mapObj='primaryMapObject'></sidebar>
  <tour class='tour' :tour='tour'></tour>
  <div id='bottom-center'></div>
  <mv-footer></mv-footer>
</div>
</template>
<script>
/* eslint new-cap: 'off' */
import _ from 'lodash'
import MapInstance from '@/components/MapInstance'
import Tour from '../Tour'
import AaokhSplashScreen from './AaokhSplashScreen'
import moment from 'moment'
import Observations from '@/assets/aaokh/obs.json'

// Define the store methods that will be used here
const aaokhStore = { // eslint-disable-line no-unused-vars
  state: {
    // True if the user has agreed to terms of use
    userAgreed: false
  },
  mutations: {
    userAgrees (state) {
      state.userAgreed = true
    }
  },
  getters: {
    // Returns true if there are pending HTTP requests
    userAgreed (state) {
      return state.userAgreed
    }
  }
}

// Will have references to DOM objects used in the tour
var observationLayer // eslint-disable-line no-unused-vars
var observationLayerRight // eslint-disable-line no-unused-vars
var ctdLayer // eslint-disable-line no-unused-vars
var ctdLayerRight // eslint-disable-line no-unused-vars

export default {
  name: 'aaokh',
  extends: MapInstance,
  components: {
    tour: Tour,
    aaokhSplashScreen: AaokhSplashScreen
  },
  created () {
    this.setupObservations()
    this.setupCtd()
    this.$store.registerModule('aaokh', aaokhStore)
  },
  mounted () {
    // Necessary to see the markers.
    this.$L.Icon.Default.imagePath = 'static/'

    // Adding to $options makes these objects
    // static i.e. non-Vue reactive.
    this.$options.participatingCommunitiesLeft = this.participating_communities()
    this.$options.participatingCommunitiesLeft.addTo(this.$refs.map.primaryMapObject)
    this.$options.participatingCommunitiesRight = this.participating_communities()
    this.$options.participatingCommunitiesRight.addTo(this.$refs.map.secondaryMapObject)
    this.toggleCommunityTooltips() // hide the tooltips to start with
  },
  data () {
    return {
      // tooltipOffset may be needed because the 2nd map pane was showing
      // offset tooltips by a consistent amount.
      participating_communities (tooltipOffset = 0) {
        var geojsonMarkerOptions = {
          radius: 8,
          fillColor: '#ff7800',
          color: '#000',
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        }
        var communities = []
        _.each([
          { place: 'Kaktovik', lat: 70.132778, lon: -143.616111 },
          { place: 'Wainwright', lat: 70.647222, lon: -160.016111 },
          { place: 'Point Lay', lat: 69.741111, lon: -163.008611 },
          { place: 'Point Hope', lat: 68.346944, lon: -166.763056 },
          { place: 'Kotzebue', lat: 66.897222, lon: -162.585556 },
          { place: 'Utqia&#289;vik', lat: 71.290556, lon: -156.788611 },
          { place: 'Wales', lat: 65.612222, lon: -168.089167 }
        ], (feature) => {
          communities.push(
            this.$L.circleMarker(
              new this.$L.latLng([feature.lat, feature.lon]),
              geojsonMarkerOptions).bindTooltip(feature.place, {
                permanent: true,
                direction: 'bottom',
                offset: this.$L.point(tooltipOffset, 0)
              })
            )
        })
        return this.$L.layerGroup(communities)
      },
      title: 'Alaska Arctic Observatory &amp; Knowledge Hub',
      abstract: `
<h1>Alaska Arctic Observatory &amp; Knowledge Hub</h1>
<p><strong>The Alaska Arctic Observatory and Knowledge Hub</strong> (AAOKH) facilitates the sharing of sea ice conditions in combination with observations collected by members of coastal communities in the context of a changing seasonal cycle. This approach can help track environmental change from a community perspective. The tour below will give you a idea of the types of curated data AAOKH helps to share and make accessible.
</p>
`,
      mapOptions: {
        zoom: 4,
        minZoom: 1,
        maxZoom: 6,
        center: [71.2906, -156.7886]
      },
      baseLayerOptions: {
        transparent: true,
        srs: 'EPSG:3338',
        format: 'image/png',
        version: '1.3',
        continuousWorld: true // needed for non-3857 projs
      },
      layers: [
        {
          'abstract': '<p>Local observers in coastal communities provide observations on sea ice, weather, wildlife, and subsistence activities throughout the year, particularly in relation to the seasonal cycle. Participating communities include Kaktovik, Wainwright, Point Lay, Point Hope, Kotzebue, Utqiagvik, and Wales.</p><p>Visit the <a href="https://arctic-aok.org/observations/" target="_blank" rel="noopener">AAOKH observations web site</a> for more information about observations. Data are stored and can be accessed through a collaboration with the <a href="https://eloka-arctic.org/sizonet/" target="_external">ELOKA</a> project.</p>',
          'name': 'observations',
          'title': 'Observations',
          'legend': false,
          'local': true
        },
        {
          'abstract': `
            <p>The Utqiagvik marine radar is mounted on top of the 4-story bank building in downtown Utqiagvik. It detects sea ice up to 6 miles out and acquires a new image every 5 minutes for near real-time results. Ice appears white in the image due to the radar signals reflecting off it. Ridges in the sea ice also appear as bright linear objects, but buildings, fences, and cars on the land can also return strong signals. Darker regions in the image can indicate open water, smooth ice, or shadows.  The image shown here is from April 2, 2016.</p>
            <p><a target="_blank" rel="noopener"  href="http://seaice.alaska.edu/gi/observatories/barrow_radar">Access and learn more about these data</a>.</p>`,
          'name': 'aaokh:barrow_radar',
          'title': 'Utqia&#289;vik Marine Radar',
          'legend': false
        },
        {
          'abstract': '<p>Trails built by Utqia&#289;vik whaling crews for the 2017 spring whaling season were mapped by Matthew Druckenmiller (National Snow and Ice Data Center) and Josh Jones (AAOKH) in late April 2017.</p>',
          'name': 'aaokh:aa_whaling_trails',
          'title': 'Spring 2017 Whaling Trails',
          'legend': false
        },
        {
          'abstract': `<p>Trails built by Utqia&#289;vik whaling crews for the 2018 spring whaling season were mapped by Matthew Druckenmiller (National Snow and Ice Data Center) and Josh Jones (AAOKH) in late April / early May 2018.  The team uses GPS to map trails. They also continuously measure ice thickness with a special instrument called an
electromagnetic conductivity (EM) meter.  <a rel="noopener" target="_blank" href="https://arctic-aok.org/data/whaling-trail-mapping/">See more information and access data</a> on the AAOKH project web site.</p>
            <table class="aaokh-sidebar-legend whaling_trails_2018"><!-- quantile / equal count classification -->
              <caption>Ice thickness (ft)</caption>
              <tr><td><div class="class-1"></div></td><td>0.2&mdash;0.3</td></tr>
              <tr><td><div class="class-2"></div></td><td>0.3&mdash;2.6</td></tr>
              <tr><td><div class="class-3"></div></td><td>2.6&mdash;3.5</td></tr>
              <tr><td><div class="class-4"></div></td><td>3.5&mdash;4.9</td></tr>
              <tr><td><div class="class-5"></div></td><td>4.9&mdash;7.4</td></tr>
              <tr><td><div class="class-6"></div></td><td>7.4&mdash;38.9</td></tr>
            </table>`,
          'name': 'aaokh:utiqiagvik_ice_trail_em_surveys_2018',
          'title': 'Spring 2018 Whaling Trails',
          'legend': false
        },
        {
          'abstract': `
          <table class="aaokh-sidebar-legend">
          <tr><td><div class="marginal-ice"></div></td><td>Marginal Ice Zone</td></tr>
          <tr><td><div class="fast-ice"></div></td><td>Fast Ice</td></tr>
          </table>
          <p>Produced by the National Ice Center and updated daily (although we are only showing a single previous point in time with this example, from December 5, 2017), this layer shows the sea ice edge and delineates the marginal ice zone from fast ice. Fast ice or shorefast ice is anchored to land and relatively stable. The marginal ice zone is the transition between fast ice and the open ocean. It can consist of drifting ice floes, or compact floes at the head of fast ice, but is subject to deformation from ocean processes. This portion of the ice cover is the most biologically diverse and is an essential habitat for many species including marine mammals, fish, and birds.</p><p>See the <a target="_blank" href="http://www.natice.noaa.gov/products/daily_products.html">National Ice Center</a> and the <a target="_blank" target="_blank" rel="noopener"  href="https://www.polarview.aq/arctic">Polar View</a> web sites for more information.</p>`,
          'name': 'aaokh:sea_ice_extent',
          'title': 'Sea Ice Extent',
          'legend': false
        },
        {
          'abstract': `
          <table class="aaokh-sidebar-legend ice-concentration">
            <tr><td><div class="conc-19"></div></td><td>0&mdash;19%</td></tr>
            <tr><td><div class="conc-39"></div></td><td>20&mdash;39%</td></tr>
            <tr><td><div class="conc-59"></div></td><td>40&mdash;59%</td></tr>
            <tr><td><div class="conc-79"></div></td><td>60&mdash;79%</td></tr>
            <tr><td><div class="conc-89"></div></td><td>80&mdash;89%</td></tr>
            <tr><td><div class="conc-94"></div></td><td>90&mdash;94%</td></tr>
            <tr><td><div class="conc-99"></div></td><td>95&mdash;09%</td></tr>
            <tr><td><div class="conc-100"></div></td><td>100%</td></tr>
          </table>
          <p>Sea ice concentration is approximated by imagery from the Advanced Microwave Scanning Radiometer 2 (AMSR-2) instrument on JAXA’s GCOM-W1 satellite. The data layer shown here is from March 6, 2018.</p><p>Find more information and data at the <a target="_blank"  href="https://earthdata.nasa.gov/earth-observation-data/near-real-time/download-nrt-data/amsr2-nrt">NASA AMSR-2 near-real-time data products page</a>, and the <a target="_blank" target="_blank" rel="noopener" href="https://www.polarview.aq/arctic">Polar View web site</a>.</p>`,
          'name': 'aaokh:sea_ice_concentration',
          'title': 'Sea Ice Concentration',
          'legend': false
        },
        {
          'abstract': `<p>Electronic CTD (conductivity, temperature and depth) devices can examine water properties to detect how the conductivity and temperature of the water column change relative to depth.  Scientists analyze CTD data make inferences about the occurrence of certain biological processes, such as the growth of algae.</p>
          </p><p>For more information and to access these data, visit the <a href="https://arctic-aok.org/observations/coastal-water-profiles/" target="_blank" target="_blank" rel="noopener">AAOKH Coastal Water Profiles page.</p>`,
          'name': 'ctd',
          'title': 'CTD',
          'legend': false,
          'local': true
        },
        {
          'abstract': '<p>Synthetic Aperture Radar (SAR) image from Sentinel-1 satellite acquired on May 1, 2017. SAR is an active microwave remote sensing platform, particularly useful in Alaska due to its ability to penetrate clouds and acquire images during the day or night.</p><p>Learn about and access SAR data from the <a target="_blank"  href="https://vertex.daac.asf.alaska.edu">Alaska Satellite Facility</a> data portal.</p>',
          'name': 'aaokh:Sentinel1A_01May2017_overviews_transparent',
          'title': 'Sentinel-1 SAR image',
          'legend': false
        }
      ]
    }
  },
  computed: {
    userAgreed () {
      return this.$store.userAgreed
    },
    buttons () {
      return [
        {
          text: 'Get involved!',
          classes: 'button',
          callback: this.openGetInvolved
        }
      ]
    },
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
    localLayers () {
      return {
        'observations': {
          first: observationLayer,
          second: observationLayerRight
        },
        'ctd': {
          first: ctdLayer,
          second: ctdLayerRight
        }
      }
    },
    tour () {
      let tour = new this.$shepherd.Tour({
        defaults: {
          classes: 'shepherd-theme-square-dark',
          showCancelLink: true
        }
      })

      this.$shepherd.on('active', (tour) => {
        this.toggleCommunityTooltips()
      })
      this.$shepherd.on('inactive', (tour) => {
        this.toggleCommunityTooltips()
      })

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

      // 1. participating communities
      tour.addStep({
        title: 'Participating communities',
        attachTo: '#top_item right',
        text: `<p>Participating AAOKH communities include Kaktovik, Wainwright, Point Lay, Point Hope, Kotzebue, Utqia&#289;vik, and Wales.</p>`,
        classes: 'shepherd-theme-square-dark adjust-tour-panel',
        when: {
          show: () => {
            this.$store.commit('hideDualMaps')
            this.$store.commit('disableSyncMaps')
            this.$store.commit('showOnlyLayers', {
              first: []
            })
            this.$refs.map.primaryMapObject.setView([65.7835000982029, -170.03220962071967], 1, { animate: false })
          }
        },
        beforeShowPromise: () => {
          var p = new Promise((resolve, reject) => {
            this.$store.commit('showLayerMenu')
            setTimeout(() => { resolve() }, 100)
          })
          return p
        },
        tetherOptions: {
          offset: '32px 0'
        }
      })

      // 2. comparing changes
      tour.addStep({
        title: 'Compare data between places',
        text: `<p>See larger-scale data for all communities participating in the AAOKH project. In this split-map view showing Wales (left) and Point Lay (right), community members can see how ice conditions compare at other locations.</p>`,
        classes: 'shepherd-theme-square-dark adjust-tour-panel',
        buttons: buttons,
        when: {
          show: () => {
            this.$store.commit('showDualMaps')
            this.$store.commit('disableSyncMaps')
            this.$store.commit('hideLayerMenu')
            this.$store.commit('showOnlyLayers', {
              first: ['aaokh:sea_ice_concentration']
            })
            this.$store.commit('showOnlyLayers', {
              second: ['aaokh:sea_ice_concentration']
            })

            // Point Hope
            this.$refs.map.primaryMapObject.setView([65.77107106796926, -166.41565997885598], 3, { animate: false })

            // Kaktovik
            this.$refs.map.secondaryMapObject.setView([68.69278629127302, -164.77517269036156], 3, { animate: false })
          },
          hide: () => {
            this.$store.commit('hideDualMaps')
            this.$store.commit('showLayerMenu')
            this.$store.commit('showOnlyLayers', {
              first: [],
              second: []
            })
          }
        }
      })

      // 3. Participate in research
      tour.addStep({
        title: 'Actively participate in research',
        attachTo: 'div.leaflet-popup-content-wrapper right',
        text: `<p>Your observations and pictures help everyone! Communities are at the front lines of changing conditions, seeing changes in action before measurements can be made by scientists and often in places otherwise inaccessible to scientific instruments. </p>`,
        classes: 'shepherd-theme-square-dark adjust-tour-panel',
        buttons: buttons,
        beforeShowPromise: () => {
          var p = new Promise((resolve, reject) => {
            this.$store.commit('hideDualMaps')
            this.$store.commit('disableSyncMaps')
            this.$store.commit('showOnlyLayers', {
              first: ['observations']
            })

            let popup = observationLayer.getLayers()[4].getPopup()
            popup.setLatLng([71.3195, -156.7051])
            this.$refs.map.primaryMapObject.setView([71.43902096076037, -157.22073662565657], 6, { animate: false })
            this.$refs.map.primaryMapObject.openPopup(popup)
            setTimeout(() => { resolve() }, 250)
          })
          return p
        }
      })

      tour.addStep({
        title: 'See shoreline and offshore ice types',
        attachTo: '#top_item right',
        text: `<p>Knowing the locations of different ice types can help people figure out how safe it is to travel, indicate habitats for marine life, and show areas of potential coastal erosion. The marginal ice zone is the transition between the open ocean and more stable landfast ice that is anchored to the coastline or the seafloor. This zone is very dynamic due to the influence of the weather and rapid changes.
        </p>`,
        classes: 'shepherd-theme-square-dark adjust-tour-panel',
        when: {
          show: () => {
            this.$store.commit('showOnlyLayers', {
              first: ['aaokh:sea_ice_extent']
            })
            this.$refs.map.primaryMapObject.setView([65.66768261334428, -170.23812752033535], 1, { animate: false })
          },
          hide: () => {
            this.$store.commit('showOnlyLayers', {
              first: []
            })
          }
        },
        buttons: buttons,
        tetherOptions: {
          attachment: 'top left',
          targetAttachment: 'left right',
          offset: '32px 0'
        }
      })

      tour.addStep({
        title: 'Coastal Water Profiles and CTD Data',
        text: `<p>Electronic CTD (conductivity, temperature and depth) devices can examine water properties to detect how the conductivity and temperature of the water column change relative to depth.  Scientists analyze CTD data to make inferences about the occurrence of certain biological processes, such as the growth of algae.
        </p>
        <div><img style="max-width: 100%; min-height: 262px;" src="/static/aaokh/CTD_Utqiagvik.png"/></div>`,
        classes: 'shepherd-theme-square-dark adjust-tour-panel',
        buttons: buttons,
        tetherOptions: {
          attachment: 'middle center',
          targetAttachment: 'middle center'
        }
      })

      tour.addStep({
        title: 'Inform your activities with near real-time data',
        attachTo: '#top_item right',
        text: `<p>Marine radar is valuable for locating the ice edge near Utqia&#289;vik for subsistence activities, search and rescue, and maritime navigation. Black areas are open water and ice appears white.
        </p>`,
        classes: 'shepherd-theme-square-dark adjust-tour-panel',
        when: {
          show: () => {
            this.$store.commit('showOnlyLayers', {
              first: ['aaokh:barrow_radar']
            })
            this.$refs.map.primaryMapObject.setView([71.30456041085161, -157.3716677124989], 6, { animate: false })
          },
          hide: () => {
            this.$store.commit('showOnlyLayers', {
              first: []
            })
            this.$refs.map.primaryMapObject.setView([67.87845438149375, -158.76816360952284], 1, { animate: false })
          }
        },
        buttons: buttons,
        tetherOptions: {
          attachment: 'top left',
          targetAttachment: 'left right',
          offset: '32px 0'
        }
      })

      tour.addStep({
        title: 'Inform your activities with near real-time data',
        attachTo: '#top_item right',
        text: `<p>This map shows another way that data can inform activities.  A recording of whaling trails from 2017 are shown on a coastal image of Synthetic Aperture Radar (SAR), where open water is dark and reflecting surfaces (such as ice) are lighter.
        </p>`,
        classes: 'shepherd-theme-square-dark adjust-tour-panel',
        when: {
          show: () => {
            this.$store.commit('showOnlyLayers', {
              first: ['aaokh:Sentinel1A_01May2017_overviews_transparent']
            })
            // Hack to ensure the whale trail is on top
            this.$store.commit('toggleLayerVisibility', {
              layer: 'aaokh:aa_whaling_trails'
            })
            this.$refs.map.primaryMapObject.setView([71.30456041085161, -157.3716677124989], 6, { animate: false })
          },
          hide: () => {
            this.$store.commit('showOnlyLayers', {
              first: []
            })
            this.$refs.map.primaryMapObject.setView([67.87845438149375, -158.76816360952284], 1, { animate: false })
          }
        },
        buttons: buttons,
        tetherOptions: {
          attachment: 'top left',
          targetAttachment: 'left right',
          offset: '32px 0'
        }
      })

      tour.addStep({
        title: 'Get involved!',
        text: `<p>There are many ways to contribute to the Alaska Arctic Observatory & Knowledge Hub. Anyone in coastal communities can provide an observation of coastal conditions or wildlife. We hire new observers, support youth and outreach activities, and are guided by a Steering Group of community representatives and scientists. Learn more on <a href="https://arctic-aok.org">our website</a>.
        </p><p><a class="get-involved" target="_blank" href="https://arctic-aok.org/get-involved/" rel="noopener" role="button">Get involved!</a>`,
        classes: 'shepherd-theme-square-dark adjust-tour-panel',
        when: {
          show: () => {
            this.$store.commit('showOnlyLayers', [])
            this.$refs.map.primaryMapObject.setView([71.2906, -156.7886], 4, { animate: false })
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
    toggleCommunityTooltips () {
      this.$options.participatingCommunitiesLeft.eachLayer((layer) => {
        layer.toggleTooltip()
      })
      this.$options.participatingCommunitiesRight.eachLayer((layer) => {
        layer.toggleTooltip()
      })
    },
    openGetInvolved () {
      window.open('https://arctic-aok.org/get-involved/', '_blank')
    },
    setupCtd () {
      var ctdObs = [
        {
          lat: 71.290556,
          lon: -156.788611,
          image: 'CTD_Utqiagvik.png'
        },
        {
          lat: 70.3875,
          lon: -148.5167,
          image: 'PrudhoeBay_20180614.png'
        },
        {
          lat: 70.6451,
          lon: -160.035,
          image: 'Wainwright_20180805.png'
        }
      ]
      var ctdMarkers = []
      _.each(ctdObs, ob => {
        ctdMarkers.push(this.$L.marker(
          {
            lat: ob.lat, lon: ob.lon
          }).bindPopup(`<img style="width: 300px;" src="/static/aaokh/${ob.image}"/>`)
        )
      })
      console.log(ctdMarkers)
      ctdLayer = this.$L.layerGroup(ctdMarkers)
      ctdLayerRight = this.$L.layerGroup(ctdMarkers)
    },
    setupObservations () {
      var observationPopupTemplate = _.template(`
<div class="aaokh__observation">
  <% if(datetime) { %>
    <h3 class="datetime"><%= datetime %></h3>
  <% } %>
  <% if(observer) { %>
    <h3 class="observer">Observation by <%= observer %></h3>
  <% } %>
  <% if(multimedia) { %>
    <div class="multimedia">
    <% _.each(multimedia, item => { %>

      <img src="<%= item.fullsize_url %>"/>
      <p class="caption"><%= item.description %></p>

    <% }) %>
    </div>
  <% } %>
  <% if(observation) { %>
    <p class="observation"><%= observation %></p>
  <% } %>
</div>
        `)

      let formatDate = (obsDate) => {
        return moment(obsDate).format('MMMM Do, YYYY')
      }

      var getObservationLayer = () => {
        return this.$L.geoJSON(Observations, {
          pointToLayer: (feature, latlng) => {
            return this.$L.marker(latlng).bindPopup(observationPopupTemplate(
              {
                multimedia: feature.properties.multimedia,
                datetime: formatDate(feature.properties.obs_date),
                observer: feature.properties.observer,
                observation: feature.properties.observation
              })
            )
          }
        })
      }

      observationLayer = getObservationLayer()
      observationLayerRight = getObservationLayer()
    }
  }
}
</script>
<style lang='scss' scoped>
// This is to hook some tour steps into specific layout
#bottom-center {
  position: absolute;
  bottom: 0;
  left: 50%;
  height: 5px;
  width: 5px;
  z-index: 10000
}

div /deep/ .leaflet-popup-content-wrapper {
  h1 {
    font-size: 14pt;
  }
  h2.popup {
    font: bold 14pt #000;
    margin: 0;
  }
  ul {
    margin: 1em 2em 1.5em;
    padding: 0;
    font-size: 10pt;
  }
}
div /deep/ .tour_marker, div /deep/ .place_marker {
  visibility: hidden;
}
// The `/deep/` syntax allows for modifying
// child component CSS.
// https://vue-loader.vuejs.org/en/features/scoped-css.html
.splash-screen /deep/ .billboard {
  max-width: 900px;
  min-height: 600px;
  background: url('~@/assets/barrow.jpg') top left / cover no-repeat;
  h1 {
    color: #100505;
  }
  p {
    font-size: 14pt;
    color: #100505;
    a {
      color: #0020f0;
    }
    text-shadow: 0 0 4px #fff;
  }
  .buttons {
    margin-top: 4em;
  }
  .logos {
    padding-left: 1em;
    width: 425px;
    background: rgba(0, 0, 0, .5);
  }
}
</style>

<style lang='scss'>
// Not scoped so we can modify styles outside the typical scope of this component.
div.aaokh__observation {
  h3.datetime {
    font-size: 14pt;
  }
  h3.observer {
    font-size: 12pt;
    color: #666;
  }
  .multimedia {
    img {
      max-width: 300px;
    }

    max-height: 350px;
    overflow: auto;
  }
}

// Sidebar tables
table.aaokh-sidebar-legend {

  td {
    padding: 1ex 1ex 0 0;
    div {
      height: 2em;
      width: 2em;
      border: 2px solid black;

      // Styles for Ice Extent
      &.fast-ice {
        background-color: #fff;
      }
      &.marginal-ice {
        background-color: #236192;
        opacity: 0.7;
      }
    }
  }
}

table.aaokh-sidebar-legend {
  td {
    padding: 0 1ex 0 0;
    div {
      border: none;
    }
  }

  &.ice-concentration {
    div {
      // Styles for Ice Concentration
      &.conc-19 { background-color: #f7fcfd; opacity: 0.1; border: 1px solid #000; }
      &.conc-39 { background-color: #e0ecf4; opacity: 0.6;}
      &.conc-59 { background-color: #bfd3e6; opacity: 0.7;}
      &.conc-79 { background-color: #9ebcda; opacity: 0.8;}
      &.conc-89 { background-color: #8c96c6; opacity: 0.9;}
      &.conc-94 { background-color: #8c6bb1; opacity: 1;}
      &.conc-99 { background-color: #88419d; opacity: 1;}
      &.conc-100 { background-color: #6e016b; opacity: 1;}
    }
  }

  &.whaling_trails_2018 {
    margin-top: 1em;
    caption {
      width: 10em;
      font-weight: bold;
      text-align: left;
      margin-bottom: 1ex;
    }
    .class-1 { background-color: #d7191c; }
    .class-2 { background-color: #f69053; }
    .class-3 { background-color: #0ddf9a; }
    .class-4 { background-color: #def2b4; }
    .class-5 { background-color: #91cba9; }
    .class-6 { background-color: #2b83ba; }
  }
}


.shepherd-text p a {
  font-weight: 600;
  color: #549fe0;
  &:hover {
    color: #ffffff;
  }
}

a.get-involved {
  margin-bottom: 1em;
}
</style>
