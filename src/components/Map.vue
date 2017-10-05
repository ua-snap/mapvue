<template>
<div id="outer-map-wrapper">
  <h1 id="mapTitle">{{ title }}</h1>
  <layer-menu></layer-menu>
<!--
  <map-splash-screen></map-splash-screen>
  <map-loading-indicator></map-loading-indicator>
-->

  <div id="info-sidebar"></div>

  <div id="mapsWrapper">
    <div id="snapmapapp" :class="{'half': dualMaps}"></div>
    <div id="secondmap" :class="{'half': dualMaps}"></div>
  </div>

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
import MvIam from './Maps/IAM.vue'
import MvAkFires from './Maps/AK_Fires.vue'
import MvSnapRcp6 from './Maps/SNAP_RCP6.vue'
import _ from 'lodash'

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
      // TODO: rename to mapOptions, it won't be different
      // for each map, will it?
      firstMapOptions: undefined,

      // Leaflet map object
      mapObj: undefined,

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
    }
  },
  components: {
    'layer-menu': LayerMenu,
    'mv-footer': Footer,
    ...mapObjectMapper
  },
  mounted () {
    // Throughout the below, you'll see `this.$refs.component`.
    // That's how we access the child map component.
    // See: https://vuejs.org/v2/api/#ref

    // These need to be separate instances because we listen for events differently on each.
    var baseLayer = this.$refs.component.baseLayer
    // var secondBaseLayer = this.mapComponent.getBaseLayer()
    var placeLayer = this.$refs.component.placeLayer
    // var secondPlaceLayer = this.mapComponent.getPlaceLayer()

    // Don't add the place layer if not defined
    var layers = placeLayer ? [baseLayer, placeLayer] : [baseLayer]
    // var secondLayers = secondPlaceLayer ? [secondBaseLayer, secondPlaceLayer] : [secondBaseLayer];

    // Mix together some defaults with map-specific configuration.
    this.firstMapOptions = _.extend({
      layers: layers,
      crs: this.$refs.component.crs,
      zoomControl: false,
      scrollWheelZoom: true
    }, this.$refs.component.mapOptions)

/*
    var secondMapOptions = angular.extend({
      layers: secondLayers
    },
    $scope.mapDefaults);
    $scope.secondMapObj = L.map('secondmap', secondMapOptions);
*/
    this.mapObj = this.$L.map('snapmapapp', this.firstMapOptions)

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

      _.each(this.layers, (layer) => {
        let layerConfiguration = _.extend(wmsLayerOptions,
          {
            layers: [layer.name]
          })
        this.layerObjs[layer.name] = this.$L.tileLayer.wms(window.geoserverWmsUrl, layerConfiguration)
      })
      /*
      _.each(this.map.layers, function(layer) {
        layer.name = layer.name.replace('geonode:','');
        $scope.layers[layer.name] = {};

        if (true !== layer.local) {
          angular.extend(wmsLayerOptions, {
            layers: 'geonode:' + layer.name,
            name: layer.name
          });

          $scope.layers[layer.name].obj = L.tileLayer.wms(GEOSERVER_WMS_URL, wmsLayerOptions);
          $scope.layers[layer.name].secondObj = L.tileLayer.wms(GEOSERVER_WMS_URL, wmsLayerOptions);
        } else {
          // Flag this as nonlocal layer so other code can handle it
          $scope.layers[layer.name].local = true;
          $scope.layers[layer.name].obj = layer.getObject();
          $scope.layers[layer.name].secondObj = layer.getObject();
        }

      }); */
    }
    addLayers()
  },
  created () {
    // This populates the overview info for the map
    this.title = this.$store.state.maps[this.slug].title
    this.abstract = this.$store.state.maps[this.slug].title

    // This references the component implementing this map!
    this.mapComponentName = mapSlugs[this.slug]

    // The store is updated with the current component layers
    this.$store.commit('setLayers', mapObjectMapper[this.mapComponentName].data().layers)
  },
  watch: {
    getLayers: {
      deep: true,
      handler (layers) {
        _.each(layers, layer => {
          if (layer.visible && !this.mapObj.hasLayer(this.layerObjs[layer.name])) {
            this.mapObj.addLayer(this.layerObjs[layer.name])
          } else if (!layer.visible && this.mapObj.hasLayer(this.layerObjs[layer.name])) {
            this.mapObj.removeLayer(this.layerObjs[layer.name])
          }
        })
      }
    }
  }
}
</script>

<style type="scss" scoped>
#mapTitle {
  position: absolute;
  top: 0; left: 0;
  z-index: 100;
  background-color: rgba(255, 255, 255, .9);
  margin: 0;
  padding: .5ex;
}

#snapmapapp {
  position: absolute;
  width: 100%;
  height: 100%;
}

#snapmapapp.half {
  position: absolute;
  width: 50%;
  right: 50%;
  border-right: 2px solid rgba(0, 0, 0, .5);

  .leaflet-right {
    margin-right: 10px;
    margin-top: 60px;
  }
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

  .leaflet-right {
    margin-right: 10px;
    margin-top: 60px;
  }
}
</style>
