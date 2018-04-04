<template>
<div class='aaokh'>
  <h1 class='map-title'>{{ title }}</h1>
  <layer-menu></layer-menu>
  <splash-screen
    :abstract='abstract'></splash-screen>
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

// Will have references to DOM objects used in the tour
var observationLayer // eslint-disable-line no-unused-vars
var observationPopup // eslint-disable-line no-unused-vars

export default {
  name: 'aaokh',
  extends: MapInstance,
  components: {
    tour: Tour
  },
  created () {
    // Process the observed SIZONET data
    this.setupObservations()
  },
  mounted () {
    // Necessary to see the markers.
    this.$L.Icon.Default.imagePath = 'static/'
    // Add places to map
    this.participating_communities().addTo(this.$refs.map.primaryMapObject)
    this.participating_communities().addTo(this.$refs.map.secondaryMapObject)
  },
  data () {
    return {
      participating_communities () {
        /*
        Kaktovik 70.132778, -143.616111
        Wainwright 70.647222, -160.016111
        Point Lay 69.741111, -163.008611
        Point Hope 68.346944, -166.763056
        Kotzebue 66.897222, -162.585556
        Utqiagvik 71.290556, -156.788611
        Wales 65.612222, -168.089167
        */
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
            this.$L.marker(
              new this.$L.latLng([feature.lat, feature.lon])).bindPopup('<h2 class="popup">' + feature.place + '</h2>')
          )
        })
        return this.$L.layerGroup(communities)
      },
      title: 'AAOKH (Draft)',
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
          'abstract': 'Placeholder for observations from ELOKA',
          'name': 'observations',
          'title': 'Observations',
          'legend': false,
          'local': true
        },
        {
          'abstract': 'TBD',
          'name': 'aaokh:barrow_radar',
          'title': 'Barrow Sea Ice Radar',
          'legend': false
        },
        {
          'abstract': 'TBD',
          'name': 'aaokh:whaling_trails',
          'title': 'Whaling Trails (2017)',
          'legend': false
        },
        {
          'abstract': 'TBD',
          'name': 'aaokh:sea_ice_extent',
          'title': 'Sea Ice Extent',
          'legend': true
        },
        {
          'abstract': 'TBD',
          'name': 'aaokh:sea_ice_concentration',
          'title': 'Sea Ice Concentration',
          'legend': true
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
    localLayers () {
      return {
        'observations': {
          first: observationLayer,
          second: observationLayer
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
          },
          hide: () => {}
        },
        tetherOptions: {
          attachment: 'top left',
          targetAttachment: 'left right',
          offset: '32px 0'
        }
      })

      // 2. comparing changes
      tour.addStep({
        title: 'Compare changes with neighboring communities',
        text: `<p>See larger-scale data for all communities participating in the AAOKH project. Here is an example of daily sea ice concentration that allows community members to see how ice conditions compare at other locations.</p>`,
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
        attachTo: '#research_photo left',
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

            this.$refs.map.primaryMapObject.openPopup(observationPopup)
            this.$refs.map.primaryMapObject.setView([69.23232124768693, -170.39295749936036], 3, { animate: false })
            setTimeout(() => { resolve() }, 250)
          })
          return p
        },
        when: {
          hide: () => {
            this.$refs.map.primaryMapObject.closePopup(observationPopup)
          }
        },
        tetherOptions: {
          attachment: 'top right',
          targetAttachment: 'top left',
          offset: '32px 0'
        }
      })

      // 4. Show MIZO
      tour.addStep({
        title: 'See shoreline and offshore ice types',
        attachTo: '#top_item right',
        text: `<p>The marginal ice zone is the transition between the open ocean and more stable landfast ice that is anchored to the coastline or the seafloor. This zone is very dynamic due to the influence of the weather and rapid changes. Knowing the locations of different ice types can help people figure out how safe it is to travel, indicate habitats for marine life, and show areas of potential coastal erosion.
        </p>`,
        classes: 'shepherd-theme-square-dark adjust-tour-panel',
        when: {
          show: () => {
            this.$store.commit('showOnlyLayers', {
              first: ['aaokh:sea_ice_extent']
            })
            this.$refs.map.primaryMapObject.setView([65.66768261334428, -170.23812752033535], 1, { animate: false })
          }
        },
        buttons: buttons,
        tetherOptions: {
          attachment: 'top left',
          targetAttachment: 'left right',
          offset: '32px 0'
        }
      })

      // 5. Inform activities
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
        buttons: [
          {
            text: 'Back',
            action: tour.back
          },
          {
            text: 'Done',
            action: tour.complete
          }
        ],
        tetherOptions: {
          attachment: 'top left',
          targetAttachment: 'left right',
          offset: '32px 0'
        }
      })

      return tour
    }
  },
  methods: {
    setupObservations () {
      var imagePath = require('@/assets/point_hope_eggs.jpg')
      var latlng = [68.40033170453667, -166.3469122563418]
      observationPopup = this.$L.popup()
      .setLatLng(latlng)
      .setContent(`
<h3>Collecting eggs in Point Hope</h3>
<img id="research_photo" src="${imagePath}">
`)
      let marker = this.$L.marker(latlng)
      marker.bindPopup(observationPopup)
      observationLayer = this.$L.layerGroup([marker])
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
  background: url('~@/assets/barrow.jpg') #ff0000 top left / cover no-repeat;
  background-blend-mode: screen;
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
    background: rgba(0, 0, 0, .5);
  }
}
</style>
<style lang='scss'>
// Not scoped so we can modify some Tour styles
.iam-tour.shepherd-step .shepherd-text h4 {
  color: #efefef;
}

.aaokh {
    h1 {
      margin-top: 0;
    }
}
</style>
