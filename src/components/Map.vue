<template>
<div id="outer-map-wrapper">
  <h1>{{ title }}</h1>
  <layer-menu></layer-menu>
  <splash-screen
    :abstract="abstract"></splash-screen>

  <sidebar :mapObj="mapObj"></sidebar>

  <div id="snapmapapp" v-bind:class="{ half: dualMaps }"></div>
  <div id="secondmap" v-bind:class="{ half: dualMaps }"></div>

  <component ref="component" v-bind:is="mapComponentName">
    <!-- Map-specific HTML & Tour will be rendered here -->
  </component>

  <mv-footer></mv-footer>
</div>
</template>

<script>
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

    // These need to be separate instances because we listen for events differently on each.
    var baseLayer = this.$refs.component.baseLayer
    var placeLayer = this.$refs.component.placeLayer

    // Don't add the place layer if not defined
    var layers = placeLayer ? [baseLayer, placeLayer] : [baseLayer]

    // Mix together some defaults with map-specific configuration.
    var mapOptions = _.extend({
      crs: this.$refs.component.crs,
      zoomControl: false,
      scrollWheelZoom: true
    }, this.$refs.component.mapOptions)

    // Instantiate map objects
    this.mapObj = this.$L.map('snapmapapp', _.extend(mapOptions, {
      layers: layers
    }))

    this.secondMapObj = this.$L.map('secondmap', _.extend(mapOptions, {
      layers: _.cloneDeep(layers)
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

    // TODO Make the Abstract pull from some other source
    // than the list of maps (i.e. equiv to the getAbstract function
    // in the prior version)
    this.abstract = this.$store.state.maps[this.slug].abstract

    // This references the component implementing this map!
    this.mapComponentName = mapSlugs[this.slug]

    // The store is updated with the current component layers
    this.$store.commit('setLayers', mapObjectMapper[this.mapComponentName].data().layers)
  },
  watch: {
    // Start/stop the tour
    tourIsActive () {
      console.log('Totally going to do something here')
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

<style type="scss">

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

#snapmapapp {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
}

#snapmapapp.half {
  width: 50%;
  right: 50%;
  border-right: 2px solid rgba(0, 0, 0, .5);
  border: 2px solid red;
}

#secondmap {
  position: absolute;
  left: 50%;
  width: 50%;
  height: 100%;
  border: 0;
  z-index: -1;
}

#secondmap.half {
  z-index: 0;
  border: 2px solid blue;
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
