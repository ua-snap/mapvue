<template>
<div id="map">
  <div id="map--leaflet-map" class="leaflet-container"></div>
</div>
</template>

<script>

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
        version: '1.3'
      }, this.baseLayerOptions)
    }
  },
  mounted () {
    // Instantiate map objects
    this.$options.leaflet.map = this.$L.map('map--leaflet-map', this.getBaseMapAndLayers())

    // Put the (left) map center in the console to assist with coding
    if (process.env.DEBUG === true) {
      this.$options.leaflet.map.on('zoomend', () => {
        console.log('Map zoom: ', this.$options.leaflet.map.getZoom())
      })
      this.$options.leaflet.map.on('moveend', () => {
        console.log('Map center: ', this.$options.leaflet.map.getCenter().lat, ', ', this.$options.leaflet.map.getCenter().lng)
      })
    }

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
      this.updateSideBySideMap()
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
    // Filter layers by left/right side of map visibility,
    // Add or remove the split map control.
    updateSideBySideMap () {
      // Helper to filter layers
      var getFilteredLayerList = (propertyName) => {
        let layers = _.filter(this.layers, layer => {
          return layer[propertyName]
        })

        return _.map(layers, layerProps => {
          return _.find(this.$options.leaflet.layers, layerObj => {
            return layerObj.options.id === layerProps.id
          })
        })
      }

      if (this.$options.leaflet.sideBySideControl) {
        this.$options.leaflet.sideBySideControl.remove()
      }

      if (this.dualMaps === true) {
        // Activate split map control!
        let left = getFilteredLayerList('visible')
        let right = getFilteredLayerList('secondVisible')

        console.log('left', left)
        console.log('right', right)

        this.$options.leaflet.sideBySideControl = this.$L.control.sideBySide(left, right).addTo(this.$options.leaflet.map)
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
    addWmsLayer (layer) {
      let layerConfiguration = _.extend(this.wmsLayerOptions,
        {
          layers: [layer.wms],
          styles: layer.styles ? layer.styles : '',
          id: layer.id
        }
      )
      if (layer.time) {
        _.extend(layerConfiguration, {
          time: layer.time
        })
      }

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
        this.$options.leaflet.layers[layer.id] = this.localLayers[layer.id].first
      }
    },
    // Reorder & update layer visibility
    // REFACTOR We should split this into 3 parts,
    // managing the smallest amount of change possible -- this
    // sort of rebuilds the whole map.
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
        // TBD -- this should only update the specific layer that changed
        // REFACTOR BEFORE MERGE TO MASTER
        if (_.isFunction(layer.wmsLayerName)) {
          // This is really forcing a reload of a specific layer to
          // get an updated WMS endpoint.  Just changing the properties and
          // calling redraw() didn't seem to work, unsure why -- this should
          // be tested and fixed before final merge.  Placeholder code!
          // TODO fix this
          // REFACTOR
          this.addWmsLayer(layer)
        }

        // Explicitly order the list so that topmost layers
        // have the highest z-index
        this.$options.leaflet.layers[layer.id].setZIndex(100 - index)

        toggleLayerVisibility(layer.visible || layer.secondVisible, this.$options.leaflet.map, this.$options.leaflet.layers[layer.id])
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
