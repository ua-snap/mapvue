<template>
<div id="outer-map-wrapper">
  <h1>{{ title }}</h1>
  <layer-menu></layer-menu>
  <splash-screen
    :abstract="abstract"></splash-screen>

  <sidebar :mapObj="mapObj"></sidebar>

  <div map id="map-1" class="leaflet-container" v-bind:class="{fullmap: !dualMaps, halfmap: dualMaps}"></div>
  <div map id="map-2" class="leaflet-container" v-bind:class="{hide: !dualMaps, show: dualMaps}"></div>

  <component ref="component" v-bind:is="mapComponentName">
    <!-- Map-specific HTML & Tour will be rendered her -->
  </component>

  <mv-footer></mv-footer>
</div>
</template>

<script>
  /* eslint-disable */
import LayerMenu from './LayerMenu'
import Footer from './Footer'

/**
This whole hoo-haw should be redone, it's not easily extensible
or easy to understand the right factorization here, but this isn't
good.
*/
import MvIam from './Maps/IAM'
import MvAkFires from './Maps/AK_Fires'
import MvSnapRcp6 from './Maps/SNAP_RCP6'
import _ from 'lodash'
import Sidebar from './Sidebar'
import SplashScreen from './SplashScreen'

var mapSlugs = {
  'snap-rcp-6.0': 'MvSnapRcp6',
  'iam': 'MvIam',
  'fires': 'MvAkFires'
}

var mapObjectMapper = {
  'MvIam': MvIam,
  'MvAkFires': MvAkFires,
  'MvSnapRcp6': MvSnapRcp6
}
/* End hoo-haw. */

export default {
  name: 'map',
  props: ['slug'],
  data () {
    return {
      // reference to leaflet-sidebar
      sidebar: undefined,

      // Leaflet map objects
      mapObj: undefined,
      secondMapObj: undefined,

      // Array of layer Leaflet objects, keyed by layer name.
      layerObjs: {},
      secondLayerObjs: {},

      // Map info (title, abstract, etc??)
      map: undefined,
      title: undefined,
      abstract: undefined,
      mapComponentName: undefined, // name of current map component
      mapComponent: undefined // contains reference to current map component object

    }
  },
  computed: {
    layers () {
      return this.$store.state.layers
    },
    dualMaps () {
      return this.$store.state.dualMaps
    },
    getLayers () {
      return this.$store.getters.getLayers
    },
    tourIsActive () {
      return this.$store.getters.tourIsActive
    }
  },
  components: {
    'layer-menu': LayerMenu,
    'mv-footer': Footer,
    'sidebar': Sidebar,
    'splash-screen': SplashScreen,
    ...mapObjectMapper
  },
  mounted () {
    // Throughout the below, you'll see `this.$refs.component`.
    // That's how we access the child map component, i.e.
    // the specific map that is being rendered.
    // See: https://vuejs.org/v2/api/#ref
    this.abstract = this.$refs.component.abstract

    // These need to be separate instances because we listen for events differently on each.
    var baseLayer = this.$refs.component.baseLayer
    var placeLayer = this.$refs.component.placeLayer

    var secondBaseLayer = this.$refs.component.secondBaseLayer
    var secondPlaceLayer = this.$refs.component.secondPlaceLayer

    // Don't add the place layer if not defined
    var layers = placeLayer ? [baseLayer, placeLayer] : [baseLayer]
    var secondLayers = secondPlaceLayer  ? [secondBaseLayer, secondPlaceLayer] : [secondBaseLayer]

    // Mix together some defaults with map-specific configuration.
    var mapOptions = _.extend({
      crs: this.$refs.component.crs,
      zoomControl: false,
      scrollWheelZoom: true,
      attributionControl: false
    }, this.$refs.component.mapOptions)

    // Instantiate map objects
    this.mapObj = L.map('snapmapapp', _.extend(mapOptions, {
      layers: layers
    }))

    this.secondMapObj = L.map('secondmap', _.extend(mapOptions, {
      layers: secondLayers
    }))

    // Add all layers
    // TODO refactor away to module or whatever
    var addLayers = () => {
      var wmsLayerOptions = _.extend({
        continuousWorld: true,
        transparent: true,
        tiled: 'true',
        format: 'image/png',
        version: '1.3'
      }, this.$refs.component.layerOptions)

      // TODO: 2nd map, "special" layers (ones handled by the map component itself, not GeoServer)
      _.each(this.layers, (layer) => {
        let layerConfiguration = _.extend(wmsLayerOptions,
          {
            layers: [layer.name]
          })
        this.layerObjs[layer.name] = this.$L.tileLayer.wms(window.geoserverWmsUrl, layerConfiguration)
      })
    }
    addLayers()
  },
  created () {
    // This populates the overview info for the map
    this.title = this.$store.state.maps[this.slug].title

    // This references the component implementing this map!
    this.mapComponentName = mapSlugs[this.slug]

    // The store is updated with the current component layers
    this.$store.commit('setLayers', mapObjectMapper[this.mapComponentName].data().layers)
  },
  watch: {
    dualMaps (dualMaps) {
      setTimeout(function() {
        this.mapObj.invalidateSize()
        this.secondMapObj.invalidateSize()
      }.bind(this), 25)
    },
    // Start/stop the tour
    tourIsActive (tourIsActive) {
      if (tourIsActive === true) {
        // Tour started.  Clean up the app state and start tour.
        this.$store.commit('hideSplash')
        this.$store.commit('hideSidebar')
        this.$refs.component.tour.start()
      } else {
        // ...
      }
    },
    // When layer visibility or order changes, re-render
    getLayers: {
      deep: true,
      handler (layers) {
        _.each(layers, (layer, index) => {
          let layerObj = this.layerObjs[layer.name]
          // Explicitly order the list so that topmost layer
          // has the highest z-index
          layerObj.setZIndex(100 - index)

          // Add or remove the layer from the map
          if (layer.visible && !this.mapObj.hasLayer(layerObj)) {
            this.mapObj.addLayer(layerObj)
          } else if (!layer.visible && this.mapObj.hasLayer(layerObj)) {
            this.mapObj.removeLayer(layerObj)
          }
        })
      }
    }
  }
}

</script>

<style type="scss" scoped>
h1 {
  position: absolute;
  top: 0; left: 0;
  z-index: 100;
  background-color: rgba(255, 255, 255, .9);
  margin: 0;
  padding: .5ex;
}

.leaflet-right {
  margin-right: 10px;
  margin-top: 60px;
}

.fullmap {
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
}

.halfmap {
  display: block;
  position: absolute;
  width: 50%;
  height: 100%;
  left: 0;
  top: 0;
  border-right: 2px solid rgba(0, 0, 0, .5);
}

#map-2 {
  position: absolute;
  width: 50%;
  height: 100%;
  left: 50%;
  top: 0;
}

#map-2.hide {
  z-index: -1
}

#map-2.show {
  z-index: 0
}

.leaflet-top, .leaflet-bottom {
  z-index: 499;
}

.leaflet-container {
  background-color: #fff;
}

.leaflet-sidebar {
  z-index: 4500;
}

</style>
