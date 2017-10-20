<template>
<div id="outer-map-wrapper">
  <h1>{{ title }}</h1>
  <layer-menu></layer-menu>
  <splash-screen
    :abstract="abstract"></splash-screen>

  <sidebar :mapObj="primaryMapObject"></sidebar>

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

// Will contain an array of Leaflet Map objects
var mapObjs = []

// consts for our two maps, primary (left) and
// secondary (right)
const PRIMARY_MAP = 0
const SECONDARY_MAP = 1

export default {
  name: 'map',
  props: ['slug'],
  data () {
    return {
      // reference to leaflet-sidebar
      sidebar: undefined,

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
    syncMaps () {
      return this.$store.state.syncMaps
    },
    getLayers () {
      return this.$store.getters.getLayers
    },
    tourIsActive () {
      return this.$store.getters.tourIsActive
    },
    // This wrapper allows access to the primary (left) map
    // object so it can be provided to other components, but
    // the object remains outside the scope of Vue and thus
    // won't get decorated with accessors, etc.
    primaryMapObject () {
      return mapObjs[0]
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

    // Instantiate map objects
    mapObjs[PRIMARY_MAP] = L.map('map-1', this.getBaseMapAndLayers())
    mapObjs[SECONDARY_MAP] = L.map('map-2', this.getBaseMapAndLayers())

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
    dualMaps () {
      this.$nextTick(function () {
        mapObjs[PRIMARY_MAP].invalidateSize()
        mapObjs[SECONDARY_MAP].invalidateSize()
      })
    },
    syncMaps (syncMaps) {
      console.log(syncMaps)
      if (syncMaps) {
        mapObjs[PRIMARY_MAP].sync(mapObjs[SECONDARY_MAP])
        mapObjs[SECONDARY_MAP].sync(mapObjs[PRIMARY_MAP])
      } else {
        mapObjs[PRIMARY_MAP].unsync(mapObjs[SECONDARY_MAP])
        mapObjs[SECONDARY_MAP].unsync(mapObjs[PRIMARY_MAP])
      }
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
          if (layer.visible && !mapObjs[PRIMARY_MAP].hasLayer(layerObj)) {
            mapObjs[PRIMARY_MAP].addLayer(layerObj)
          } else if (!layer.visible && mapObjs[PRIMARY_MAP].hasLayer(layerObj)) {
            mapObjs[PRIMARY_MAP].removeLayer(layerObj)
          }
        })
      }
    }
  },
  methods: {
    getBaseMapAndLayers () {

      // The _.cloneDeep is to ensure we aren't recycling
      // the Leaflet layers (breaks map)
      var baseLayer = _.cloneDeep(this.$refs.component.baseLayer)
      var placeLayer = _.cloneDeep(this.$refs.component.placeLayer)

      // Don't add the place layer if not defined
      var layers = placeLayer ? [baseLayer, placeLayer] : [baseLayer]

      var defaultMapProperties = _.extend({
        crs: this.$refs.component.crs,
        zoomControl: false,
        scrollWheelZoom: true,
        attributionControl: false
      }, this.$refs.component.mapOptions)

      // Mix together some defaults with map-specific configuration.
      return _.extend(defaultMapProperties, { layers: layers })
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
