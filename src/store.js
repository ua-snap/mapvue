import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'

Vue.use(Vuex)

// Helper function to set WMS properties for a layer.
var setWmsProperties = (state, layer, properties) => {
  if (_.isFunction(layer.wmsLayerName)) {
    Vue.set(layer, 'wms', layer.wmsLayerName(properties).name)
    Vue.set(layer, 'time', layer.wmsLayerName(properties).time)
    Vue.set(layer, 'title', layer.wmsLayerName(properties).title)
  } else {
    // Don't need to ensure deep watchers see this change -- static layer name
    layer.wms = layer.wmsLayerName
  }
}

// Helper function to toggle visiblity properties on the
// store for either left or right map pane
var swapVisibility = (state, targetLayer, targetLayerIndex, propName, value) => {
  // If we're explicitly setting the value, do so.
  if (value === true || value === false) {
    targetLayer[propName] = value
  } else {
    // Or, switch.
    targetLayer[propName] = !targetLayer[propName]
  }

  Vue.set(state.layers, targetLayerIndex, targetLayer)
}

// Helper to return a layer from the ordered array of layers.
var getLayerIndexById = (state, id) => {
  let targetLayerIndex = _.findIndex(
    state.layers,
    layer => layer.id === id
  )
  return targetLayerIndex
}

export default new Vuex.Store({
  state: {
    // Layers is an array of objects which
    // define the layers and visibility for each layer
    layers: [],

    // Should the sidebar be shown?
    sidebarVisibility: false,

    // SidebarContent is set to the layer object
    // when shown, then returned to `undefined` when hidden.
    sidebarContent: undefined,

    // Should the layer menu be shown?
    layerMenuVisibility: true,

    // Whether the splash/intro screen for a map is visible or not
    showSplash: true,

    // True if the app knows that there are still outstanding
    // data requests (used on map splash screen)
    pendingHttpRequests: 0,

    // Are dual maps being shown?
    dualMaps: false,

    // True if tour is active
    tourIsActive: false
  },
  mutations: {
    // This function is used to initialize the layers in the store.
    setLayers (state, layers) {
      var restructuredlayers = []

      // Set some defaults for state/instance-based properties
      _.each(layers, layer => {
        // Default visibility on left/right maps to off
        layer.visible = layer.visible || false
        layer.secondVisible = false
        setWmsProperties(state, layer, layer.defaults)
        restructuredlayers.push(layer)
      })
      state.layers = restructuredlayers
    },
    /* Payload is an object with these properties:
    {
      // id: Layer id
      id: '',

      // mapPane: if 'second', applies to 2nd map
      mapPane: 'second',

      // If `undefined`, toggles current state.
      // If `true` or `false`, sets the layer's visibility
      // to that value.
      setTo: undefined
    } */
    toggleLayerVisibility (state, payload) {
      // Identify the layer in the array
      let targetLayerIndex = getLayerIndexById(state, payload.id)
      if (payload.mapPane !== 'second') {
        // Swap visibility flag
        swapVisibility(state, state.layers[targetLayerIndex], targetLayerIndex, 'visible', payload.setTo)
      } else {
        swapVisibility(state, state.layers[targetLayerIndex], targetLayerIndex, 'secondVisible', payload.setTo)
      }
    },
    /*

    Triggered when a parameterized layer's configuration changes.

    payload.layer is the layer name
    payload.properties is whatever the configuration GUI presents.

    */
    updateLayer (state, payload) {
      let layer = state.layers[getLayerIndexById(state, payload.layer)]
      setWmsProperties(state, layer, payload.properties)
    },
    /*
    Here, `payload` is an object with this structure:
    {
      first: ['layer1Name', 'layer2Name'],
      second ['layer2Name']
    }
    Layers listed under `first` are shown on the left map,
    layers listed under `second` on the right.

    All layers not listed are hidden.

    `first` or `second` can be ommitted.
    */
    showOnlyLayers (state, payload) {
      _.each(state.layers, (layer, index) => {
        if (_.isArray(payload.first)) {
          let ifShowFirst = _.find(
            payload.first,
            name => name === layer.id
          )
          swapVisibility(state, layer, index, 'visible', ifShowFirst !== undefined, (_.isArray(payload.first) && _.isArray(payload.second)))
        }

        if (_.isArray(payload.second)) {
          let ifShowSecond = _.find(
            payload.second,
            name => name === layer.id
          )
          swapVisibility(state, layer, index, 'secondVisible', ifShowSecond !== undefined, (_.isArray(payload.first) && _.isArray(payload.second)))
        }
      })
    },
    reorderLayers (state, layers) {
      state.layers = layers
    },
    // Set the sidebar contents, and open the sidebar
    showSidebar (state, payload) {
      let targetLayer = _.find(
        state.layers,
        layer => layer.id === payload.layer
      )
      state.sidebarContent = targetLayer
      state.sidebarVisibility = true
    },
    hideSidebar (state) {
      state.sidebarVisibility = false
      state.sidebarContent = undefined
    },
    toggleLayerMenu (state) {
      state.layerMenuVisibility = !state.layerMenuVisibility
    },
    showLayerMenu (state) {
      state.layerMenuVisibility = true
    },
    hideLayerMenu (state) {
      state.layerMenuVisibility = false
    },
    showSplash (state) {
      state.showSplash = true
    },
    hideSplash (state) {
      state.showSplash = false
    },
    startTour (state) {
      state.tourIsActive = true
    },
    endTour (state) {
      state.tourIsActive = false
    },
    toggleDualMaps (state) {
      state.dualMaps = !state.dualMaps
    },
    showDualMaps (state) {
      state.dualMaps = true
    },
    hideDualMaps (state) {
      state.dualMaps = false
    },
    incrementPendingHttpRequest (state) {
      state.pendingHttpRequests++
    },
    decrementPendingHttpRequest (state) {
      state.pendingHttpRequests--
    },
    // Reset the map to some defaults.
    // Called when a map is destroyed, such as when
    // user navigates between maps.
    resetState (state) {
      this.commit('hideDualMaps')
      this.commit('endTour')
      this.commit('hideSidebar')

      // Show splash screen by default!
      this.commit('showSplash')
    }
  },
  getters: {
    // Returns true if there are pending HTTP requests
    loadingData (state) {
      return state.pendingHttpRequests > 0
    },
    tourIsActive (state) {
      return state.tourIsActive
    }
  }
})
