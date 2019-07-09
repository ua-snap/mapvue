<template>
<div id="mv-ak-fires">
  <h1 class="map-title">{{ title }}</h1>
  <layer-menu :buttons="buttons"></layer-menu>
  <splash-screen :abstract="abstract"></splash-screen>
  <mv-map
    ref="map"
    :base-layer-options="baseLayerOptions"
    :base-layer="baseLayer"
    :place-layer="placeLayer"
    :crs="crs"
    :map-options="mapOptions"
    :local-layers="localLayers"
  ></mv-map>
  <sidebar
    :mapObj="map"
    :templateVars="templateVars"
  ></sidebar>
  <tour :tour="tour"></tour>
  <mv-footer></mv-footer>
  <graph></graph>
</div>
</template>

<script>
// For Leaflet, whose constructors are often lowercase
/* eslint new-cap: "off" */
import _ from 'lodash'
import MapInstance from '@/components/MapInstance'
import AKFiresGraph from './AK_Fires_Graph'
import Tour from '../Tour'
import Vue from 'vue'
const { detect } = require('detect-browser')
const browser = detect()

// Determine if we need to hack for IE11 or not.
var isIe11
if (browser) {
  if (browser.name === 'ie' && browser.version === '11.0.0' && browser.os === 'Windows 7') {
    isIe11 = true
  }
}

// Leaflet objects, keep these outside of the
// scope of the Vue component for performance
// reasons
var firePolygons
var fireMarkers
var fireLayerGroup
var viirsLayerGroup

// Current time zone offset (used in parseDate below).
var offset = new Date().getTimezoneOffset()

// Define the store methods that will be used here
const fireStore = { // eslint-disable-line no-unused-vars
  state: {
    // True if the fire graph is visible
    fireGraphVisible: false
  },
  mutations: {
    showFireGraph (state) {
      state.fireGraphVisible = true
    },
    hideFireGraph (state) {
      state.fireGraphVisible = false
    }
  }
}

export default {
  name: 'AK_Fires',
  extends: MapInstance,
  components: {
    'graph': AKFiresGraph,
    'tour': Tour
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
    localLayers () {
      return {
        'fires': fireLayerGroup,
        'viirs': viirsLayerGroup
      }
    },
    // Custom buttons for menu
    buttons () {
      return [
        {
          text: 'Compare this year to others',
          glyphicon: 'signal',
          classes: 'mobile-hidden',
          id: 'fire-graph',
          callback: this.showFireGraph
        },
        {
          text: 'How clean is the air?',
          id: 'air-quality',
          callback: this.openAQI
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

      // Helper to delay the display of the tour stop.
      let delay = (layer) => {
        var p = new Promise((resolve, reject) => {
          this.$store.commit('showLayerMenu')
          this.$store.commit('showOnlyLayers', {
            first: [layer]
          })
          setTimeout(() => { resolve() }, 160)
        })
        return p
      }

      tour.addStep({
        title: 'This season&rsquo;s fires',
        attachTo: '#fires right',
        highlightClass: 'tour-highlighted',
        text: `<img src="/static/legend3.svg"/><p>This layer shows fires that occurred or are actively burning this year.</p>`,
        beforeShowPromise: delay.bind(null, 'fires'),
        when: {
          show: () => {
            this.$store.commit('hideDualMaps')
          }
        },
        buttons: [
          {
            text: 'Cancel',
            action: tour.cancel
          },
          {
            text: 'Next',
            action: tour.next
          }
        ]
      })

      tour.addStep({
        title: 'Fires in History',
        attachTo: '#historical_fire_perimiters right',
        highlightClass: 'tour-highlighted',
        text: 'This layer shows all mapped fire perimeters from 1940 to 2018. It can be interesting to look for areas of repeated burn, or where a fire is burning today compared to older fire scars.',
        when: {
          show: () => {
            this.$ga.event({
              eventCategory: 'Tour Step: Fires in History',
              eventAction: 'show',
              eventLabel: 'AK Fires Tour'
            })
          }
        },
        beforeShowPromise: delay.bind(null, 'historical_fire_perimiters'),
        buttons: buttons
      })

      tour.addStep({
        title: 'Land cover from 2010',
        attachTo: '#alaska_landcover_2010 right',
        text: `This layer provides a generalized view of the vegetation and type of land at a spatial resolution of 250 meters. Vegetation types affect the flammability of an area.`,
        when: {
          show: () => {
            this.$ga.event({
              eventCategory: 'Tour Step: Land cover from 2010',
              eventAction: 'show',
              eventLabel: 'AK Fires Tour'
            })
          }
        },
        beforeShowPromise: delay.bind(null, 'alaska_landcover_2010'),
        buttons: buttons
      })

      tour.addStep({
        title: 'What do the colors mean?',
        attachTo: 'a.info bottom',
        highlightClass: 'tour-highlighted',
        text: `Use the <span class="fire-tour-info">&#9432;</span> Info button by the name of each layer to see a legend and additional information about the layer.`,
        buttons: buttons
      })

      tour.addStep({
        title: 'How does this year compare to others?',
        attachTo: '#fire-graph right',
        highlightClass: 'tour-highlighted',
        text: `This graph compares this year to all of the years when more than 1 million acres burned since daily records began in 2004. Are we on track for another big year?`,
        buttons: buttons
      })

      tour.addStep({
        title: 'How clean is the air?',
        attachTo: '#air-quality right',
        highlightClass: 'tour-highlighted',
        text: `What is the current air quality like?  This link goes to a site that explains current air quality conditions throughout Alaska.`,
        buttons: buttons
      })

      tour.addStep({
        title: 'End of tour!',
        text: `Thanks for checking this out! This map is for general information only. If you need the newest information on current fires, <a target="_blank" rel="noopener"  href="http://afsmaps.blm.gov/imf_fire/imf.jsp?site=fire">visit the AICC web map</a>.  If you have feedback, we’d love to hear it&mdash;please <a href="mailto:uaf-mapventure@alaska.edu?subject=Alaska Wildfire map feedback">contact us!</a>`,
        buttons: [
          {
            text: 'Back',
            action: tour.back
          },
          {
            text: 'Done!',
            action: tour.complete
          }
        ],
        when: {
          show: () => {
            this.$store.commit('showOnlyLayers', {
              first: ['fires']
            })
          }
        }
      })
      return tour
    }
  },
  data () {
    return {
      templateVars: {
        totalStrikes: undefined
      },
      title: 'Alaska Wildfires: Past and Present',
      abstract: `
<h1>It’s important to study wildland fire and its relationship to humans and the ecosystems we share. Use this map to see locations and sizes of wildfires in relation to long-term fire history, land cover types, and more.</h1>
 <div class="abstractWrapper">
   <p>For the most current fire management information, visit:</p>
   <ul>
     <li><a href="https://fire.ak.blm.gov" target="_blank" rel="noopener">Alaska Interagency Coordination Center (AICC)</a></li>
     <li><a href="https://fire.ak.blm.gov/content/aicc/sitreport/AICC%20Situation%20Report.pdf" target="_blank" rel="noopener">Current AICC Situation Report</a></li>
     <li><a href="https://akfireinfo.com/" target="_blank" rel="noopener">Alaska Wildland Fire Information</a></li>
   </ul>
   <p>We thank the Alaska Fire Service, State of Alaska, and the Alaska Interagency Coordination Center for their hard work fighting fires and maintaining the fire data.</p>
 </div>`,
      mapOptions: {
        zoom: 1,
        minZoom: 0,
        maxZoom: 6,
        center: [65, -152.5]
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
          'id': 'fires',
          'wmsLayerName': 'fires',
          'title': '2019 Wildfires',
          'local': true,
          'legend': false,
          'visible': true,
          'abstract': '<img src="static/legend3.svg"/><p>This layer shows fires that occurred or are actively burning this year.</p><p>We update our map each hour from the source data available at the <a href="https://fire.ak.blm.gov" target="_blank" rel="noopener" rel="external">AICC</a> web site.</p><p><em>Where do most fires occur?  Where do most of the large fires occur?</em></p>'
        },
        {
          'id': 'postgis_lightning',
          'wmsLayerName': 'postgis_lightning',
          'title': 'Lightning strikes, last 36 hours',
          'layerName': 'alaska_wildfires:postgis_lightning',
          'legend': false,
          'abstract': `
            <table class="alaska-wildfires-legend lightning">
              <tr><td><div class="positive"><img src="/static/lightning-positive.svg"/></div></td><td>Positive</td></tr>
              <tr><td><div class="negative"><img src="/static/lightning-negative.svg"/></div></td><td>Negative</td></tr>
              <tr><td><div class="cloud2cloud">•</div></td><td>Cloud to cloud</td></tr>
            </table>
            <p>This layer shows the last 36 hours of lightning activity, with older lightning strikes fading out to be more opaque the older they are.  Both <href target="_blank" rel="noopener"  href="https://www.weather.gov/jetstream/positive">positive and negative lightning</a> strikes are shown.  Positive lightning is often stronger and may be more closely associated with wildfires, and is shown with a red outline.  Negative lightning is shown with a black outline.</p>`
        },
        {
          'id': 'viirs',
          'wmsLayerName': 'viirs',
          'title': 'Hotspots, last 48 hours',
          'local': true,
          'legend': false,
          'abstract': `<p>VIIRS, a <a href="https://jointmission.gsfc.nasa.gov/viirs.html" target="_blank" rel="noopener">scientific instrument</a> on the <a href="https://www.nasa.gov/mission_pages/NPP/main/index.html" target="_blank" rel="noopener">Suomi satellite</a>, can see hotspots where temperatures are higher than expected, which can mean that a wildfire has started. Fire managers can use this information to assess locations of new wildfires.</p>
            <p>Because VIIRS picks up elevated temperatures, it can detect other phenomena which are not wildfire-related.  For example, the flare stacks at oil drilling facilities on the North Slope of Alaska frequently show up as hotspots with this instrument, even though there are no wildfires at that location.</p>
            `
        },
        {
          'abstract': `
          <table class="alaska-wildfires-legend alaska-landcover-2010">
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
          <p>This layer provides a generalized view of the physical cover on land at a spatial resolution of 250 meters.  Land cover classifications are used by scientists to determine what is growing on the landscape. These are made by looking at satellite imagery and categorizing the images into land cover types.</p><p>The dominant land cover varies across the landscape and influences how flammable a region is. When wildfires burn, they often alter the dominant land cover. Many fires have occurred since this layer was created in 2010. <i>What landcover burns the most?</i></p><p>To access and learn more about this dataset, visit the <a href="http://www.cec.org/tools-and-resources/map-files/land-cover-2010" target="_blank" rel="noopener">Commission for Environmental Cooperation</a></p>.`,
          'id': 'alaska_landcover_2010',
          'wmsLayerName': 'alaska_wildfires:alaska_landcover_2010',
          'title': 'Land cover, 2010',
          'legend': false
        },
        {
          'abstract': `
          <table class="alaska-wildfires-legend historical-fire-perimeters">
            <tr><td><div class="h-40-69"></div></td><td>1940&mdash;1969</td></tr>
            <tr><td><div class="h-70-99"></div></td><td>1970&mdash;1999</td></tr>
            <tr><td><div class="h-00-17"></div></td><td>2000&mdash;2018</td></tr>
          </table>
          <p>This layer shows historical fire perimeters from 1940&mdash;2018. <i>More recent wildfires often stop fires from spreading due to the lack of fuel, but does this always hold true?</i></p><p>To access and learn more about this dataset, visit the <a href="https://fire.ak.blm.gov" target="_blank" rel="noopener">AICC</a>.</p>`,
          'id': 'historical_fire_perimiters',
          'wmsLayerName': 'historical_fire_perimiters',
          'title': 'All Historical Fires',
          'legend': false
        },
        {
          'abstract': `
          <table class="alaska-wildfires-legend big-fire-years">
            <tr><td><div class="bf2004"></div></td><td>2004</td></tr>
            <tr><td><div class="bf2005"></div></td><td>2005</td></tr>
            <tr><td><div class="bf2009"></div></td><td>2009</td></tr>
            <tr><td><div class="bf2010"></div></td><td>2010</td></tr>
            <tr><td><div class="bf2013"></div></td><td>2013</td></tr>
            <tr><td><div class="bf2015"></div></td><td>2015</td></tr>
          </table>
          <p>This layer shows the extent of the largest recent fire seasons.</p>`,
          'id': 'alaska_wildfires:big_fire_perimiters',
          'wmsLayerName': 'alaska_wildfires:historical_fire_perimiters',
          'styles': 'alaska_wildfires:big_fire_years',
          'title': 'Recent Large Fire Years',
          'legend': false
        },
        {
          'abstract': `
          <p>This layer shows the results of a wildfire model, ALFRESCO, that shows the <a target="_blank" rel="noopener"  href="http://ckan.snap.uaf.edu/dataset/alfresco-model-outputs-relative-flammability">projected relative flammability</a>.  The darker red, the more likely that that area may burn in the future according to this model.  This layer includes data from the <a target="_blank" rel="noopener"  href="https://www.snap.uaf.edu/projects/iem">Integrated Ecosystem Management</a> project and assumes
          <a target="_blank" rel="noopener"  href="https://link.springer.com/article/10.1007/s10584-011-0149-y">comparatively high greenhouse gas emissions (RCP8.5)</a>.</p><p>This is a different type of data from other kinds on this map.  Instead of being directly observed current or historical data, this layer shows the result of computer models that take many different things into consideration to give an estimate about how future climate conditions may impact flammability.  This information can be useful for communities and decision makers.  To find out more about this type of data, visit the <a href="https://www.snap.uaf.edu" target="_blank" rel="noopener">SNAP web site</a>.</p>`,
          'id': 'alfresco_relative_flammability_NCAR-CCSM4_rcp85_2000_2099',
          'wmsLayerName': 'alaska_wildfires:alfresco_relative_flammability_NCAR-CCSM4_rcp85_2000_2099',
          'title': 'Future flammability, 2000-2099',
          'legend': false
        }
      ],
      fireJson: null,
      viirsJson: null
    }
  },
  created () {
    // Register this map's store with the global store
    this.$store.registerModule('fire', fireStore)

    // This will be the container for the fire markers & popups.
    fireLayerGroup = this.$L.layerGroup()
    viirsLayerGroup = this.$L.layerGroup()
  },
  mounted () {
    this.fetchFireData()
    this.fetchViirsData()

    // Remove any stray localStorage.
    localStorage.clear()
  },
  beforeDestroy () {
    // Remove the store module when the component is destroyed.
    this.$store.unregisterModule('fire')
  },
  methods: {
    openAQI () {
      window.open('https://fires.airfire.org/outlooks/Alaska', '_blank')
    },
    showFireGraph () {
      this.$store.commit('showFireGraph')
    },

    // Helper function to format incoming UNIX timestamps
    // relative to brower's local time zone.  Returns Moment
    // object for formatting relevant in context.
    parseDate (t) {
      return this.$moment(t).utcOffset(offset)
    },

    fetchViirsData () {
      var processViirsData = data => {
        if (data.features.length === 0) {
          Vue.set(this.layers[2], 'nodata', true)
          Vue.set(this.layers[2], 'nodataMessage', 'No hotspots have been recorded by VIIRS in the past 48 hours.')
        }
        let viirsPoints = this.getViirsMarkers(data)
        viirsLayerGroup.addLayer(viirsPoints)
      }

      return new Promise((resolve, reject) => {
        if (!this.viirsJson) {
          this.$axios.get(process.env.VIIRS_URL, { timeout: 120000 })
            .then(res => {
              if (res) {
                this.viirsJson = res.data
                processViirsData(res.data)
                this.$refs.map.refreshLayers()
                resolve()
              }
            },
            err => {
              console.error(err)
              reject()
            })
        } else {
          processViirsData(this.viirsJson)
          this.$refs.map.refreshLayers()
          resolve()
        }
      })
    },
    getViirsMarkers (geoJson) {
      var viirsMarkers = []

      _.each(geoJson.features, feature => {
        viirsMarkers.push(
          this.$L.circleMarker(
            new this.$L.latLng([feature.geometry.coordinates[1], feature.geometry.coordinates[0]]),
            {
              radius: 5,
              fillColor: '#F9382B',
              fillOpacity: 1,
              stroke: false,
              className: 'viirs-hotspot'
            }
          )
        )
      })
      return this.$L.layerGroup(viirsMarkers)
    },
    fetchFireData () {
      // Helper function to rebuild Leaflet objects
      var processFireData = (data) => {
        firePolygons = this.getGeoJsonLayer(data)
        fireMarkers = this.getFireMarkers(data)

        // Add layers to the LayerGroup we're using here.
        fireLayerGroup
          .addLayer(firePolygons)
          .addLayer(fireMarkers)
      }

      return new Promise((resolve, reject) => {
        if (!this.fireJson) {
          this.$axios.get(process.env.FIRE_FEATURES_URL, { timeout: 120000 })
            .then(res => {
              if (res) {
                this.fireJson = res.data
                processFireData(res.data)
                this.$refs.map.refreshLayers()
                if (isIe11) {
                  setTimeout(() => {
                    this.$store.commit('showOnlyLayers', {
                      first: []
                    })
                    setTimeout(() => {
                      this.$store.commit('showOnlyLayers', {
                        first: ['fires']
                      })
                    }, 500)
                  }, 250)
                }
                resolve()
              }
            },
            err => {
              console.error(err)
              reject()
            })
        } else {
          processFireData(this.fireJson)
          this.$refs.map.refreshLayers()
          resolve()
        }
      })
    },
    // For any polygon features, return a marker with a bound popup.
    getFireMarkers (geoJson) {
      var svgCircleTemplate = _.template(`
      <svg width="120" height="120" viewBox="0 0 120 120"
         xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="fire-gradient">
            <stop offset="0%" stop-opacity="<%= stop1opacity %>" stop-color="<%= stop1 %>"/>
            <stop offset="75%" stop-opacity="<%= stop2opacity %>" stop-color="<%= stop2 %>"/>
            <stop offset="100%" stop-opacity="<%= stop3opacity %>" stop-color="<%= stop3 %>"/>
          </radialGradient>
        </defs>

        <circle fill="url(#fire-gradient)" cx="60" cy="60" r="50"/>
      </svg>
      `)
      var activeSvgCircle = svgCircleTemplate({
        stop1: 'RGB(207, 38, 47)',
        stop1opacity: '.05',
        stop2: 'RGB(207, 38, 47)',
        stop2opacity: '.15',
        stop3: 'RGB(207, 38, 47)',
        stop3opacity: '.35'
      })
      var inactiveSvgCircle = svgCircleTemplate({
        stop1: 'RGB(80, 63, 63)',
        stop1opacity: '.05',
        stop2: 'RGB(80, 63, 63)',
        stop2opacity: '.15',
        stop3: 'RGB(80, 63, 63)',
        stop3opacity: '.35'
      })

      var activeFireCircle = encodeURI('data:image/svg+xml,' + activeSvgCircle).replace('#', '%23')
      var inactiveFireCircle = encodeURI('data:image/svg+xml,' + inactiveSvgCircle).replace('#', '%23')

      // Set up icon markers
      let FireIcon = this.$L.Icon.extend({
        options: {
          iconUrl: activeFireCircle,
          shadowSize: [0, 0], // no shadow!
          popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
        }
      })

      var fireMarkers = []
      var popupOptions = {
        maxWidth: 200
      }
      _.each(geoJson.features, feature => {
        if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') {
          // If this is a MultiPolygon, we need to "flatten" the
          // array of polygons into a single polygon before we can
          // calculatethe centroid.  The use of `[].concat.apply`
          // accomplishes this flattening by concatenating the
          // array of polygons.
          var polygonCoordinates = (feature.geometry.type === 'MultiPolygon')
            ? [].concat.apply([], feature.geometry.coordinates[0])
            : feature.geometry.coordinates[0]

          // Icon size needs to be proportionate to fire size, max 100px.
          var iconCandidateSize = 0.0025 * (feature.properties.acres + 15000) + 25
          var iconSize = (iconCandidateSize > 100) ? 100 : iconCandidateSize

          // Reverse order from what we need
          var coords = this.getCentroid2(polygonCoordinates)
          var icon = this.isFireActive(feature.properties)
            ? new FireIcon({
              iconSize: [iconSize, iconSize],
              iconAnchor: [iconSize / 2, iconSize / 2]
            }) : new FireIcon({
              iconUrl: inactiveFireCircle,
              iconSize: [iconSize, iconSize],
              iconAnchor: [iconSize / 2, iconSize / 2]
            })

          fireMarkers.push(
            this.$L.marker(new this.$L.latLng([coords[1], coords[0]]), {
              icon: icon
            }).bindPopup(this.getFireMarkerPopupContents(
              {
                title: feature.properties.NAME,
                acres: feature.properties.acres,
                cause: feature.properties.GENERALCAUSE,
                updated: feature.properties.updated,
                outdate: feature.properties.OUTDATE,
                discovered: feature.properties.discovered
              }, popupOptions))
          )
        }
      })
      return this.$L.layerGroup(fireMarkers)
    },
    getGeoJsonLayer (geoJson) {
      return this.$L.geoJson(geoJson, {
        style: this.styleFirePolygons,
        pointToLayer: this.firePointFeatureHandler
      })
    },
    styleFirePolygons (feature) {
      if (this.isFireActive(feature.properties)) {
        return {
          color: '#ff0000',
          fillColor: '#E83C18',
          opacity: 0.8,
          weight: 2,
          fillOpacity: 0.3
        }
      } else {
        return {
          color: '#888888',
          fillColor: '#888888',
          opacity: 0.8,
          weight: 3,
          fillOpacity: 1
        }
      }
    },
    // There's a few places in the code that are making this check,
    // and we've needed to swap it more than once to account
    // for differing upstream data.  This function implements
    // the logic to determine if a fire is active or not.
    isFireActive (fireFeatures) {
      return fireFeatures.active
    },
    // This handler is only used for point features (no polygon).
    // It returns a Leaflet divIcon marker with classes
    // for active/inactive, and if the size of the fire is
    // less than an acre, the class 'small' is attached.
    firePointFeatureHandler (geoJson, latLng) {
      var isActive
      var zIndex
      var popupOptions = {
        maxWidth: 200
      }
      if (this.isFireActive(geoJson.properties)) {
        isActive = 'active'
        zIndex = 1000
      } else {
        isActive = 'inactive'
        zIndex = 300
      }
      var acres = parseFloat(geoJson.properties.acres).toFixed(1)
      if (acres <= 1) {
        isActive += ' small'
        acres = ' '
      }
      var icon = this.$L.divIcon({
        className: isActive,
        popupAnchor: [15, -5],
        html: '<span class="' + isActive + '">' + acres + '</span>'
      })
      return this.$L.marker(latLng, {
        icon: icon,
        zIndexOffset: zIndex
      }).bindPopup(this.getFireMarkerPopupContents(
        {
          title: geoJson.properties.NAME,
          acres: geoJson.properties.acres,
          cause: geoJson.properties.GENERALCAUSE,
          updated: geoJson.properties.updated,
          outdate: geoJson.properties.OUTDATE,
          discovered: geoJson.properties.discovered
        }, popupOptions))
    },
    // For this method, fireInfo must contain properties
    // title, acres, cause, updated, outdate
    getFireMarkerPopupContents (fireInfo) {
      // Convert updated to "days ago" format; not all fires have
      // updated info, in which case, leave that blank.
      var updated = ''

      if (fireInfo.updated) {
        updated = '<p class="updated">Updated ' + this.parseDate(fireInfo.updated).fromNow() + '.</p>'
      }

      var acres = fireInfo.acres + ' acres'
      var out = fireInfo.outdate ? '<p class="out">Out date: ' + this.parseDate(fireInfo.outdate).format('MMMM D') + '</p>' : ''
      var cause = fireInfo.cause ? '<h3>Cause: ' + fireInfo.cause + '</h3>' : ''
      var discovered = fireInfo.discovered ? '<h3 class="discovered">Discovered ' + this.parseDate(fireInfo.discovered).format('MMMM D') + '</h3>' : ''

      return _.template(`
  <h1><%= title %></h1>
  <h2><%= acres %></h2>
  <%= discovered %>
  <%= cause %>
  <%= out %>
  <%= updated %>`)(
        {
          title: fireInfo.title,
          acres: acres,
          cause: cause,
          updated: updated,
          out: out,
          discovered: discovered
        }
      )
    },
    // Helper function to place markers at the centroid
    // of their polygon.
    // http://stackoverflow.com/questions/22796520/finding-the-center-of-leaflet-polygon
    getCentroid2 (arr) {
      var twoTimesSignedArea = 0
      var cxTimes6SignedArea = 0
      var cyTimes6SignedArea = 0

      var length = arr.length

      var x = (i) => { return arr[i % length][0] }
      var y = (i) => { return arr[i % length][1] }

      for (let i = 0; i < arr.length; i++) {
        var twoSA = x(i) * y(i + 1) - x(i + 1) * y(i)
        twoTimesSignedArea += twoSA
        cxTimes6SignedArea += (x(i) + x(i + 1)) * twoSA
        cyTimes6SignedArea += (y(i) + y(i + 1)) * twoSA
      }
      var sixSignedArea = 3 * twoTimesSignedArea
      return [cxTimes6SignedArea / sixSignedArea, cyTimes6SignedArea / sixSignedArea]
    }
  }
}
</script>

<style lang="scss">
// Not scoped, for editing tour / leaflet styles
span.fire-tour-info {
  display: inline-block;
  padding: 0 .1ex;
  color: #333;
  font-weight: bold;
}

path.leaflet-interactive.viirs-hotspot {
  animation: colors 2s infinite;
}

@keyframes colors {
  50% {
    fill: #F9EA31;
    fill-opacity: 0.5;
  }
}

.leaflet-popup-content {
  z-index: 1000;

  h1 {
    font-size: 16pt;
    color: #322323;
    margin: .5rem 0 .25rem;
    padding: 0;
  }

  h2 {
    font-size: 1rem;
    margin: .5rem 0;
    padding: 0;
  }

  h3 {
    font-size: .75rem;
    margin-bottom: 0;
    padding: 0;

    &.discovered {
      margin-top: 0;
      font-weight: 500;
    }
  }

  p.updated {
    margin-top: .25ex;
    font-weight: 300;
    color: #988989;
  }

  p.out {
    font-weight: 700;
    margin: 0;
  }
}

div.leaflet-marker-icon span {
  color: white;
  font-weight: bold;
  border-radius: 1em;
  margin: 1ex;
  padding: .5ex;

  &.active {
    background-color: rgba(200, 56, 20, .85);
    z-index: 10000;
  }

  &.inactive {
    background-color: rgba(100, 100, 100, .6);
    z-index: 500;
  }

  &.small {
    border-radius: 50%;
    width: 1em;
    height: 1em;
    display: inline-block;
    z-index: 300;
  }
}

table.alaska-wildfires-legend.lightning {
  td div {
    border: none;
    text-align: center;
  }
}

table.alaska-wildfires-legend {

  td {
    padding: .5ex 1ex 0 0;
    div {
      height: 2em;
      width: 2em;
      border: 2px solid #222;
    }
  }

  &.historical-fire-perimeters {
    .h-40-69 { background-color: #FFF7BC; }
    .h-70-99 { background-color: #fec44f; }
    .h-00-17 { background-color: #d95f0e; }
  }
}

table.alaska-wildfires-legend.alaska-landcover-2010 {
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

table.alaska-wildfires-legend.big-fire-years {
  td {
    font-size: 12pt;
    div {
      height: 2em;
      width: 2em;
      border: none;
      &.bf2004 { background-color: #7fc97f; }
      &.bf2005 { background-color: #beaed4; }
      &.bf2009 { background-color: #fdc086; }
      &.bf2010 { background-color: #ffff99; }
      &.bf2013 { background-color: #386cb0; }
      &.bf2015 { background-color: #f0027f; }
    }
  }
}

</style>

<style scoped lang="scss">

// /deep/ applies these styles to the child component
/deep/ .splash-screen .billboard {
  background: url("~@/assets/scott-fire-fade.jpg") white bottom left / cover no-repeat;
  color: #222;

  h1 {
    width: 75%;
    font-size: 20pt;
    padding: 1ex;
    color: #000;
  }

  a {
    color: #438bca;
  }

  p {
    margin: 1em;
    &:first-of-type {
      padding-top: 1em;
    };
    &:last-of-type {
      padding-bottom: 1em;
    };
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
      max-width: 50%;
    }
    background: rgba(255, 255, 255, .8);
    border-radius: 1ex;
    margin: 1em;
  }

  .buttons {
    margin: 1em;
    font-weight: 700;
  }

  .logos {
    margin: 0 0 0 1em !important;
  }
}

</style>
