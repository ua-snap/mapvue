<template>
<div id="map">
  <div id="map--leaflet-map" class="leaflet-container"></div>
</div>
</template>

<script>
/* global process */
import _ from 'lodash'

var getFilteredLayers = (layers, propertyName) => {
  return _.filter(layers, layer => {
    return layer[propertyName]
  })
}

// Helper to filter layers
var getFilteredLayerObjects = (layers, layerObjs, propertyName) => {
  let filteredLayers = getFilteredLayers(layers, propertyName)
  return _.map(filteredLayers, layerProps => {
    return _.find(layerObjs, layerObj => {
      return layerObj.options.id === layerProps.id
    })
  })
}

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
  // Static property, access via this.$options.leaflet
  leaflet: {
    // Leaflet object
    map: undefined,
    // Object of Leaflet layer objects, keyed by layer ID.
    layers: {},
    // L.Control if side by side maps are active
    sideBySideControl: undefined
  },
  computed: {
    layers () {
      return this.$store.state.layers
    },
    dualMaps () {
      return this.$store.state.dualMaps
    },
    wmsLayerOptions () {
      return _.extend({
        continuousWorld: true,
        transparent: true,
        tiled: 'true',
        format: 'image/png',
        version: '1.3.0'
      }, this.baseLayerOptions)
    },
    map () {
      return this.$options.leaflet.map
    }
  },
  mounted () {
    // Instantiate map objects
    this.$options.leaflet.map = this.$L.map('map--leaflet-map', this.getBaseMapAndLayers())

    // Add zoom controls
    this.$L.control.zoom({
      position: 'topright'
    }).addTo(this.$options.leaflet.map)

    this.addLayers()
  },
  destroyed () {
    this.$store.commit('resetState')
  },
  watch: {
    dualMaps () {
      this.toggleSideBySideMap()
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
    // Returns the Leaflet object corresponding to the
    // requested layer ID, or, undefined if not present
    findLayerById (id) {
      return _.find(this.$options.leaflet.layers, layerObj => {
        return layerObj.options.id === id
      })
    },
    // Enable/disable side-by-side map.
    toggleSideBySideMap () {
      if (this.dualMaps === true) {
        this.$options.leaflet.sideBySideControl = this.$L.control.sideBySide().addTo(this.$options.leaflet.map)
        this.updateSideBySideMap()
      } else {
        // Only remove if it's already been added.
        if (this.$options.leaflet.sideBySideControl) {
          this.$options.leaflet.sideBySideControl.remove()
        }
      }
      this.refreshLayers()
    },
    // Filter layers by left/right side of map visibility,
    // Add or remove the split map control.
    updateSideBySideMap () {
      // Only set layers if we're in split map mode and the
      // control is initialized.
      if (this.dualMaps === true && this.$options.leaflet.sideBySideControl) {
        let left = getFilteredLayerObjects(this.layers, this.$options.leaflet.layers, 'visible')
        let right = getFilteredLayerObjects(this.layers, this.$options.leaflet.layers, 'secondVisible')
        this.$options.leaflet.sideBySideControl.setLeftLayers(left)
        this.$options.leaflet.sideBySideControl.setRightLayers(right)
      }
    },
    // Instantiate the Leaflet layer objects
    addLayers () {
      // Create or obtain actual Leaflet objects, and add them
      // to the maps.
      _.each(this.layers, (layer) => {
        this.updateLayer(layer)
      })
    },
    // Adds WMS layer, removing a prior layer if present.
    // Some of these properties are assigned in the vue store,
    // like layer.time and layer.wms.
    addWmsLayer (layer) {
      let layerConfiguration = {}
      layerConfiguration = _.extend(this.wmsLayerOptions,
        {
          layers: layer.wms,
          styles: layer.styles ? layer.styles : '',
          time: layer.time ? layer.time : '',
          id: layer.id
        }
      )

      // Remove old layers if present
      if (this.$options.leaflet.layers[layer.id]) {
        this.$options.leaflet.map.removeLayer(this.$options.leaflet.layers[layer.id])
      }

      this.$options.leaflet.layers[layer.id] = this.$L.tileLayer.wms(process.env.GEOSERVER_WMS_URL, layerConfiguration)
    },
    // Triggered when a configurable layer has changed, and
    // when setting up the map.  Defines the WMS properties for the layer.
    updateLayer (layer) {
      // If the layer is a normal GeoServer layer, create
      // and add it here.
      if (layer.local !== true) {
        this.addWmsLayer(layer)
      } else {
        // Otherwise, fetch the layer from the list
        // of local layers maintained in this map.
        this.$options.leaflet.layers[layer.id] = this.localLayers[layer.id]
      }
    },
    // Reorder & update layer visibility
    // TODO: issue #134, consider if we can only update what's changed here.
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

      // Refresh map layer contents and visibility
      _.each(layers, (layer, index) => {
        if (_.isFunction(layer.wmsLayerName)) {
          // Update layer parameters
          let layerObj = this.findLayerById(layer.id)
          if (layerObj) {
            let newParams = {
              layers: layer.wms
            }

            if (layer.styles) {
              _.extend(newParams, { styles: layer.styles })
            }

            if (layer.time) {
              _.extend(newParams, { time: layer.time })
            }

            // This will re-request tiles in case any of the params
            // are different.
            layerObj.setParams(newParams)
          }
        }

        // Explicitly order the list so that topmost layers
        // have the highest z-index
        this.$options.leaflet.layers[layer.id].setZIndex(100 - index)

        // The layer is visible (added to Leaflet map) if:
        // single map mode -- 'visible' flag set
        // dual map mode -- 'visible' or 'secondVisible' flag set
        let layerVisibility = this.dualMaps
          ? layer.visible || layer.secondVisible // dual maps, either side...
          : layer.visible // single map, left side only.

        toggleLayerVisibility(layerVisibility, this.$options.leaflet.map, this.$options.leaflet.layers[layer.id])
      })

      this.updateSideBySideMap()
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

<style type="scss">

#map--leaflet-map {
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
}

.leaflet-sbs-range:focus {
  border: unset !important;
  outline: unset !important;
}

.leaflet-top, .leaflet-bottom {
  z-index: 499;
}

.leaflet-top .leaflet-control {
  margin-top: 55px;
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
