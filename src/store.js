import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'

Vue.use(Vuex)

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

  // Gotcha here: because we are replacing
  // the property in an array element,
  // we need to ensure that Vue is aware of the
  // change.
  //
  // See: https://vuejs.org/v2/guide/list.html#Caveats
  //
  // If the layer is being turned on,
  // pull it to the top of the list
  if (targetLayer[propName] === true) {
    state.layers.splice(targetLayerIndex, 1)
    state.layers.unshift(targetLayer)
  } else {
    // Otherwise, just replace it in-place to ensure
    // that reactivity rules see the changes and
    // propagate this change to watchers.
    Vue.set(state.layers, targetLayerIndex, targetLayer)
  }
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

    // Should the dual maps be kept in sync?
    syncMaps: false,

    // True if tour is active
    tourIsActive: false,

    // True if the fire graph is visible
    fireGraphVisible: false
  },
  mutations: {
    // This function is used to initialize the layers in the store.
    setLayers (state, layers) {
      var restructuredlayers = []

      // Set some defaults for state/instance-based properties
      _.each(layers, layer => {
        // Default visibility on left/right maps to off
        layer.visible = layer.visible || false
        layer.secondVisible = layer.visible

        restructuredlayers.push(layer)
      })
      state.layers = restructuredlayers
    },
    /* Payload is an object with these properties:
    {
      // layer: Layer name
      layer: '',

      // mapPane: if 'second', applies to 2nd map
      mapPane: 'second',

      // If `undefined`, toggles current state.
      // If `true` or `false`, sets the layer's visibility
      // to that value.
      setTo: undefined
    } */
    toggleLayerVisibility (state, payload) {
      // Identify the layer in the array
      let targetLayerIndex = _.findIndex(
        state.layers,
        layer => layer.name === payload.layer
      )
      let targetLayer = state.layers[targetLayerIndex]

      if (payload.mapPane !== 'second') {
        // Swap visibility flag
        swapVisibility(state, targetLayer, targetLayerIndex, 'visible', payload.setTo)
      } else {
        swapVisibility(state, targetLayer, targetLayerIndex, 'secondVisible', payload.setTo)
      }
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
            name => name === layer.name
          )
          swapVisibility(state, layer, index, 'visible', ifShowFirst !== undefined)
        }

        if (_.isArray(payload.second)) {
          let ifShowSecond = _.find(
            payload.second,
            name => name === layer.name
          )
          swapVisibility(state, layer, index, 'secondVisible', ifShowSecond !== undefined)
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
        layer => layer.name === payload.layer
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
    toggleSyncMaps (state) {
      state.syncMaps = !state.syncMaps
    },
    enableSyncMaps (state) {
      state.syncMaps = true
    },
    disableSyncMaps (state) {
      state.syncMaps = false
    },
    showFireGraph (state) {
      state.fireGraphVisible = true
    },
    hideFireGraph (state) {
      state.fireGraphVisible = false
    },
    incrementPendingHttpRequest (state) {
      state.pendingHttpRequests++
    },
    decrementPendingHttpRequest (state) {
      state.pendingHttpRequests--
    }
  },
  getters: {
    // Returns true if there are pending HTTP requests
    loadingData (state) {
      return state.pendingHttpRequests > 0
    }
  }
})
