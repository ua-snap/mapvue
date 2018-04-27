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
  <sidebar :mapObj="primaryMapObject"></sidebar>
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

// Leaflet objects, keep these outside of the
// scope of the Vue component for performance
// reasons
var firePolygons
var fireMarkers
var fireLayerGroup
var secondFirePolygons
var secondFireMarkers
var secondFireLayerGroup
var activeFireIcon
var inactiveFireIcon
var lightningLayerGroup
var secondLightningLayerGroup
var lightningIcon
var lightningMarkers
var secondLightningMarkers

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
        'fires_2017': {
          first: fireLayerGroup,
          second: secondFireLayerGroup
        },
        '2w_lightning': {
          first: lightningLayerGroup,
          second: secondLightningLayerGroup
        }
      }
    },
    fireJson: {
      get () { return this.$localStorage.get('fireJson') },
      set (value) { this.$localStorage.set('fireJson', value) }
    },
    lightningJson: {
      get () { return this.$localStorage.get('lightningJson') },
      set (value) { this.$localStorage.set('lightningJson', value) }
    },
    // Custom buttons for menu
    buttons () {
      return [
        {
          text: 'Graph large fire seasons',
          glyphicon: 'signal',
          classes: 'mobile-hidden',
          callback: this.showFireGraph
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
      tour.addStep({
        title: 'This season&rsquo;s fires',
        attachTo: '#top_item right',
        text: `<img src="static/legend3.svg"/><p>This layer shows fires that occurred or are actively burning this year.</p>`,
        classes: 'shepherd-theme-square-dark adjust-tour-panel',
        when: {
          show: () => {
            this.$store.commit('hideDualMaps')
            this.$store.commit('disableSyncMaps')
            this.$store.commit('showOnlyLayers', {
              first: ['fires_2017']
            })
          }
        },
        tetherOptions: {
          attachment: 'top left',
          targetAttachment: 'left right',
          offset: '32px 0'
        }
      })
      tour.addStep({
        title: 'Fires in history',
        attachTo: '#top_item right',
        text: 'This layer shows all mapped fire perimeters from 1940 to 2016. It can be interesting to look for areas of repeated burn, or where a fire is burning today compared to older fire scars.',
        classes: 'shepherd-theme-square-dark adjust-tour-panel',
        when: {
          show: () => {
            this.$store.commit('showOnlyLayers', {
              first: ['fireareahistory']
            })
          },
          hide () {
            //
          }
        },
        buttons: [
          {
            text: 'Back',
            action: tour.back
          },
          {
            text: 'Next',
            action: tour.next
          }
        ]
      })
      tour.addStep({
        title: 'Land cover from 2010',
        attachTo: '#top_item right',
        text: `This layer provides a generalized view of the vegetation and type of  land at a spatial resolution of 250 meters. Vegetation types affect the flammability of an area.`,
        classes: 'shepherd-theme-square-dark adjust-tour-panel',
        when: {
          show: () => {
            this.$store.commit('showOnlyLayers', {
              first: ['alaska_landcover_2010']
            })
          },
          hide () {
            //
          }
        },
        buttons: [
          {
            text: 'Back',
            action: tour.back
          },
          {
            text: 'Next',
            action: tour.next
          }
        ]
      })
      tour.addStep({
        title: 'What do the colors mean?',
        attachTo: '#alaska_landcover_2010 .info right',
        text: `Use the Info button to see more details and a legend for each layer. Try clicking this button now to see what the colors for the land cover layer mean!`,
        when: {
          show: () => {
            //
          },
          hide: () => {
            this.$store.commit('hideSidebar')
          }
        },
        buttons: [
          {
            text: 'Back',
            action: tour.back
          },
          {
            text: 'Next',
            action: tour.next
          }
        ]
      })
      tour.addStep({
        title: 'How does this year compare to others?',
        attachTo: '.legend left',
        text: `This graph compares this year to all of the years when more than 1 million acres burned since daily records began in 2004. Are we on track for another big year?`,
        // Modify DOM before showing step
        beforeShowPromise: () => {
          return new Promise((resolve, reject) => {
            this.$store.commit('showFireGraph')
            resolve()
          })
        },
        when: {
          show: () => {
          },
          hide: () => {
            this.$store.commit('hideFireGraph')
          }
        },
        buttons: [
          {
            text: 'Back',
            action: tour.back
          },
          {
            text: 'Next',
            action: tour.next
          }
        ]
      })
      tour.addStep({
        title: 'End of tour!',
        text: `Thanks for checking this out! This map is for general information only. If you need the newest information on current fires, <a target="_blank" href="http://afsmaps.blm.gov/imf_fire/imf.jsp?site=fire">visit the AICC web map</a>.  If you have feedback, we’d love to hear from you at uaf-mapventure@alaska.edu!`,
        when: {
          show: () => {
            // this.$store.commit('showFireGraph')
          },
          hide: () => {
            // this.$store.commit('hideFireGraph')
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
  data () {
    return {
      title: 'Alaska Wildfires: Past and Present',
      abstract: `
<h1>It’s important to study wildland fire and its relationship to humans and the ecosystems we share. Use this map to see locations and sizes of wildfires in context of long-term fire history, land cover types, and more.</h1>
 <div class="abstractWrapper">
   <p>For the most current fire management information, visit:</p>
   <ul>
     <li><a href="https://fire.ak.blm.gov" target="_blank">Alaska Interagency Coordination Center (AICC)</a></li>
     <li><a href="http://fire.ak.blm.gov/content/aicc/sitreport/current.pdf" target="_blank">Current AICC Situation Report</a></li>
     <li><a href="https://akfireinfo.com/" target="_blank">Alaska Wildland Fire Information</a></li>
   </ul>
   <p>We thank the Alaska Fire Service, State of Alaska, and the Alaska Interagency Coordination Center for their hard work fighting fires and maintaining the data.</p>
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
          'name': 'fires_2017',
          'title': 'All fires, 2017',
          'local': true,
          'legend': false,
          'visible': true,
          'abstract': '<img src="images/legend3.svg"/><p>This layer shows fires that occurred or are actively burning this year.</p><p>We update our map each hour from the source data available at the <a href="https://fire.ak.blm.gov" target="_blank" rel="externa">AICC</a> web site.</p><p><em>Where do most fires occur?  Where do most of the large fires occur?</em></p>'
        },
        {
          'name': '2w_lightning',
          'title': 'Lightning Strikes in past 2 weeks',
          'local': true,
          'legend': false,
          'abstract': '<p>This layer shows all of the recorded lightning strikes that have occurred over the course of the past two weeks.</p><p>Many of the fires that occur during the summer in Alaska are caused by lightning strikes, thus seeing the recorded lightning strikes can be a good indication of potential fire starting points. See if you can find some lightning strikes that line up with recently started forest fires.</p>'
        },
        {
          'abstract': '<p>This layer provides a generalized view of the physical cover on land at a spatial resolution of 250 meters.  Land cover classifications are used by scientists to determine what is growing on the landscape. These are made by looking at satellite imagery and categorizing the images into land cover types.</p><p>The dominant land cover varies across the landscape and influences how flammable a region is. When wildfires burn, they often alter the dominant land cover. Many fires have occurred since this layer was created in 2010. <i>What landcover burns the most?</i></p><p>To access and learn more about this dataset, visit the <a href="http://www.cec.org/tools-and-resources/map-files/land-cover-2010" target="_blank">Commission for Environmental Cooperation</a></p>.',
          'name': 'alaska_landcover_2010',
          'title': 'Land cover, 2010'
        },
        {
          'abstract': '<p>This layer shows historical fire perimeters from 1940-2016. <i>More recent wildfires often stop fires from spreading due to the lack of fuel, but does this always hold true?</i></p><p>To access and learn more about this dataset, visit the <a href="https://fire.ak.blm.gov" target="_blank">AICC</a>.</p>',
          'name': 'fireareahistory',
          'title': 'Historical extent, 1940-2016'
        }
      ]
    }
  },
  created () {
    // Register this map's store with the global store
    this.$store.registerModule('fire', fireStore)

    // Set up icon markers
    let FireIcon = this.$L.Icon.extend({
      options: {
        iconUrl: '/static/active_fire.png',
        iconSize: [30, 35],
        shadowSize: [0, 0], // no shadow!
        iconAnchor: [16, 34], // point of the icon which will correspond to marker's location
        shadowAnchor: [0, 0],  // the same for the shadow
        popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
      }
    })

    activeFireIcon = new FireIcon()
    inactiveFireIcon = new FireIcon({
      iconUrl: '/static/inactive_fire.png'
    })

    let LightningIcon = this.$L.Icon.extend({
      options: {
        iconUrl: '/static/lightning_bolt.png',
        iconSize: [30, 35],
        shadowSize: [0, 0], // no shadow!
        iconAnchor: [16, 34], // point of the icon which will correspond to marker's location
        shadowAnchor: [0, 0],  // the same for the shadow
        popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
      }
    })

    lightningIcon = new LightningIcon()

    // This will be the container for the fire markers & popups.
    fireLayerGroup = this.$L.layerGroup()
    secondFireLayerGroup = this.$L.layerGroup()

    lightningLayerGroup = this.$L.layerGroup()
    secondLightningLayerGroup = this.$L.layerGroup()
  },
  mounted () {
    this.fetchFireData()
    this.fetchLightningData()
  },
  beforeDestroy () {
    // Remove the store module when the component is destroyed.
    this.$store.unregisterModule('fire')
  },
  methods: {
    showFireGraph () {
      this.$store.commit('showFireGraph')
    },
    fetchFireData () {
      // Helper function to rebuild Leaflet objects
      // from either localStorage or HTTP request
      var processFireData = (data) => {
        firePolygons = this.getGeoJsonLayer(data)
        fireMarkers = this.getFireMarkers(data)
        secondFirePolygons = this.getGeoJsonLayer(data)
        secondFireMarkers = this.getFireMarkers(data)

        // Add layers to the LayerGroup we're using here.
        fireLayerGroup
          .addLayer(firePolygons)
          .addLayer(fireMarkers)
        secondFireLayerGroup
          .addLayer(secondFirePolygons)
          .addLayer(secondFireMarkers)
      }

      return new Promise((resolve, reject) => {
        // Check if the data is in local storage
        if (!this.fireJson) {
          this.$axios.get(process.env.FIRE_FEATURES_URL, { timeout: 120000 })
            .then(res => {
              if (res) {
                this.fireJson = res.data
                processFireData(res.data)
                this.$refs.map.refreshLayers()
                resolve()
              }
            },
            err => {
              console.error(err)
              reject()
            })
        } else {
          // Restoring from localStorage
          processFireData(this.fireJson)
          this.$refs.map.refreshLayers()
          resolve()
        }
      })
    },
    // For any polygon features, return a marker with a bound popup.
    getFireMarkers (geoJson) {
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

          // Reverse order from what we need
          var coords = this.getCentroid2(polygonCoordinates)
          var icon = this.isFireActive(feature.properties)
            ? activeFireIcon : inactiveFireIcon

          fireMarkers.push(
            this.$L.marker(new this.$L.latLng([coords[1], coords[0]]), {icon: icon}).bindPopup(this.getFireMarkerPopupContents(
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
        html: '<span class="' + isActive + '">' + acres + '</span'
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
        updated = '<p class="updated">Updated ' + this.$moment(fireInfo.updated, 'MMMM DD, h:m a').fromNow() + '.</p>'
      }
      var acres = fireInfo.acres + ' acres'
      var out = fireInfo.outdate ? '<p class="out">Out date: ' + this.$moment.utc(this.$moment.unix(fireInfo.outdate / 1000)).format('MMMM Do, h:mm a') + '</p>' : ''
      var cause = fireInfo.cause ? '<h3>Cause: ' + fireInfo.cause + '</h3>' : ''
      var discovered = fireInfo.discovered ? '<h3 class="discovered">Discovered ' + fireInfo.discovered + '</h3>' : ''

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
    },
    // Fetch lightning data from AK BLM cached data
    fetchLightningData () {
      // Helper function to rebuild Leaflet objects
      // from either localStorage or HTTP request
      var processLightningData = (data) => {
        lightningMarkers = this.getLightningMarkers(data)
        secondLightningMarkers = this.getLightningMarkers(data)

        lightningLayerGroup.addLayer(lightningMarkers)
        secondLightningLayerGroup.addLayer(secondLightningMarkers)
      }
      return new Promise((resolve, reject) => {
        // Check if the data is in local storage
        if (!this.lightningJson) {
          this.$axios.get(process.env.LIGHTNING_FEATURES_URL, { timeout: 120000 })
            .then(res => {
              if (res) {
                this.lightningJson = res.data
                processLightningData(res.data)
                this.$refs.map.refreshLayers()
                resolve()
              }
            },
            err => {
              console.error(err)
              reject()
            })
        } else {
          // Restoring from localStorage
          processLightningData(this.lightningJson)
          this.$refs.map.refreshLayers()
          resolve()
        }
      })
    },
    // This handler is only used for point features (no polygon).
    // It returns a Leaflet divIcon marker with classes
    // for active/inactive, and if the size of the fire is
    // less than an acre, the class 'small' is attached.
    getLightningMarkers (geoJson) {
      var lightningMarkers = []
      var popupOptions = {
        maxWidth: 200
      }
      _.each(geoJson.features.features, feature => {
        // Maybe change opacity based on how old the lightning is?
        lightningMarkers.push(
          this.$L.marker(new this.$L.latLng(feature.properties.LATITUDE, feature.properties.LONGITUDE), {icon: lightningIcon}).bindPopup(this.getLightningMarkerPopupContents(
            {
              datetime: feature.properties.STRIKETIME,
              latitude: feature.properties.LATITUDE,
              longitude: feature.properties.LONGITUDE,
              amplitude: feature.properties.AMPLITUDE,
              lightningtype: feature.properties.lightningtype
            }, popupOptions))
          )
      })
      return this.$L.layerGroup(lightningMarkers)
    },
    // For this method, fireInfo must contain properties
    // title, acres, cause, updated, outdate
    getLightningMarkerPopupContents (lightningInfo) {
      // Convert updated to "days ago" format; not all fires have
      // updated info, in which case, leave that blank.

      return _.template(`
  <h1><%= datetime %></h1>
  <h2><%= lightningtype %></h2>

  <p><b>Latitude:</b> <%= latitude %>
  <br/><b>Longitude:</b> <%= longitude %></p>
  <p><b>Amplitude:</b> <%= amplitude %></p>`)(
        {
          datetime: lightningInfo.datetime,
          lightningtype: lightningInfo.lightningtype,
          longitude: lightningInfo.longitude,
          latitude: lightningInfo.latitude,
          amplitude: lightningInfo.amplitude
        }
      )
    }
  }
}
</script>
<style lang="scss">
.leaflet-popup-content {
  z-index: 1000;

  h1 {
    font-size: 16pt;
    color: #322323;
    margin: 1rem 0 .5rem;
  }

  h2 {
    font-size: 1rem;
    margin: .5rem 0;
  }

  h3 {
    font-size: .75rem;
    margin-bottom: 0;

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

.splash-screen .billboard {
  background: url("~@/assets/scott-fire-fade.jpg") white bottom left / cover no-repeat;
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
      max-width: 50%;
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

.graph-screen {
  position: fixed;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(150, 168, 48, 0.8);
  z-index: 3000;
  > div {
    padding: 2rem;
    background-color: rgba(255, 255, 255, .8);
    width: 80%;
    margin: 4rem auto;
    box-shadow: 0px 10px 40px 0px rgba(0,0,0,0.75);

    .graph-content {
      background-color: rgba(255, 255, 255, 1.0);
      padding: 1em 2em;
    }

    button {
      position: relative;
      top: -1.5em;
      right: -1.75em;
      font-size: 25pt;
    }
  }
}
</style>
