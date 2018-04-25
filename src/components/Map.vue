<template>
<div id="outer-map-wrapper">
  <div map id="map-1" class="leaflet-container" v-bind:class="{fullmap: !dualMaps, halfmap: dualMaps}"></div>
  <div map id="map-2" class="leaflet-container" v-bind:class="{hide: !dualMaps, show: dualMaps}"></div>
</div>
</template>

<script>

// This data structure will hold all the Leaflet
// objects for both maps & layers
var maps = {
  left: {
    map: undefined, // leaflet object
    layers: [] // array of leaflet layer objects
  },
  right: {
    map: undefined, // leaflet object
    layers: [] // array of leaflet layer objects
  }
}

import _ from 'lodash'

export default {
  name: 'mv-map',
  props: [
    'baseLayerOptions',
    'baseLayer',
    'placeLayer',
    'crs',
    'mapOptions',
    'localLayers'
  ],
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
    // These wrappers allows access to the primary (left) map object
    // and secondary (right) map object so it can be provided to other components, but
    // the object remains outside the scope of Vue and thus
    // won't get decorated with accessors, etc.
    primaryMapObject () {
      return maps.left.map
    },
    secondaryMapObject () {
      return maps.right.map
    }
  },
  mounted () {
    // Instantiate map objects
    maps.left.map = this.$L.map('map-1', this.getBaseMapAndLayers())
    maps.right.map = this.$L.map('map-2', this.getBaseMapAndLayers())

    // Put the (left) map center in the console to assist with coding
    maps.left.map.on('zoomend', () => {
      console.log('Map zoom: ', maps.left.map.getZoom())
    })
    maps.left.map.on('moveend', () => {
      console.log('Map center: ', maps.left.map.getCenter().lat, ', ', maps.left.map.getCenter().lng)
    })

    // Add zoom controls
    this.$L.control.zoom({
      position: 'topright'
    }).addTo(maps.left.map)
    this.$L.control.zoom({
      position: 'topright'
    }).addTo(maps.right.map)

    this.addLayers()
  },
  destroyed () {
    this.$store.commit('resetState')
  },
  watch: {
    dualMaps () {
      this.$nextTick(function () {
        maps.left.map.invalidateSize()
        maps.right.map.invalidateSize()
      })
    },
    syncMaps (syncMaps) {
      if (syncMaps) {
        maps.left.map.sync(maps.right.map)
        maps.right.map.sync(maps.left.map)
      } else {
        maps.left.map.unsync(maps.right.map)
        maps.right.map.unsync(maps.left.map)
      }
    },
    // When layer visibility or order changes, re-render
    layers: {
      deep: true,
      handler (layers) {
        this.refreshLayers(layers)
      }
    }
  },
  methods: {
    // Instantiate the Leaflet layer objects
    addLayers () {
      var wmsLayerOptions = _.extend({
        continuousWorld: true,
        transparent: true,
        tiled: 'true',
        format: 'image/png',
        version: '1.3'
      }, this.baseLayerOptions)

      // Create or obtain actual Leaflet objects, and add them
      // to the maps.
      _.each(this.layers, (layer) => {
        // If the layer is a normal GeoServer layer, create
        // and add it here.
        if (layer.local !== true) {
          let layerConfiguration = _.extend(wmsLayerOptions,
            {
              layers: [layer.name]
            })
          maps.left.layers[layer.name] = this.$L.tileLayer.wms(process.env.GEOSERVER_WMS_URL, layerConfiguration)
          maps.right.layers[layer.name] = this.$L.tileLayer.wms(process.env.GEOSERVER_WMS_URL, layerConfiguration)
        } else {
          // Otherwise, fetch the layer from the list
          // of local layers maintained in this map.
          maps.left.layers[layer.name] = this.localLayers[layer.name].first
          maps.right.layers[layer.name] = this.localLayers[layer.name].second
        }
      })
    },
    // Reorder & update layer visibility
    refreshLayers (layers) {
      layers = layers || this.layers

      // Helper function to toggle layers
      var toggleLayerVisibility = (visible, map, layer) => {
        if (visible && !map.hasLayer(layer)) {
          map.addLayer(layer)
        } else if (!visible && map.hasLayer(layer)) {
          map.removeLayer(layer)
        }
      }
      _.each(layers, (layer, index) => {
        let leftLayerObj = maps.left.layers[layer.name]
        let rightLayerObj = maps.right.layers[layer.name]

        // Explicitly order the list so that topmost layers
        // have the highest z-index
        leftLayerObj.setZIndex(100 - index)
        rightLayerObj.setZIndex(100 - index)

        toggleLayerVisibility(layer.visible, maps.left.map, leftLayerObj)
        toggleLayerVisibility(layer.secondVisible, maps.right.map, rightLayerObj)
      })
    },
    getBaseMapAndLayers () {
      // The _.cloneDeep is to ensure we aren't recycling
      // the Leaflet layers (breaks map)
      var baseLayer = _.cloneDeep(this.baseLayer)
      var placeLayer = _.cloneDeep(this.placeLayer)

      // Don't add the place layer if not defined
      var layers = placeLayer ? [baseLayer, placeLayer] : [baseLayer]

      var defaultMapProperties = _.extend({
        crs: this.crs,
        zoomControl: false,
        scrollWheelZoom: true,
        attributionControl: false
      }, this.mapOptions)

      // Mix together some defaults with map-specific configuration.
      return _.extend(defaultMapProperties, { layers: layers })
    }
  }
}

</script>

<style type="scss" scoped>

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

.leaflet-control-zoom {
  position: relative;
  top: -4em;
}

</style>
