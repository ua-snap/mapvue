import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'

Vue.use(Vuex)

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
        layer.visible = false
        layer.secondVisible = false

        restructuredlayers.push(layer)
      })
      state.layers = restructuredlayers
    },
    toggleLayerVisibility (state, payload) {
      // Helper function to toggle visiblity properties on the
      // store for either left or right map pane
      var swapVisibility = (targetLayer, propName) => {
        targetLayer[propName] = !targetLayer[propName]

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

      // Identify the layer in the array
      let targetLayerIndex = _.findIndex(
        state.layers,
        layer => layer.name === payload.layer
      )
      let targetLayer = state.layers[targetLayerIndex]

      if (payload.mapPane !== 'second') {
        // Swap visibility flag
        swapVisibility(targetLayer, 'visible')
      } else {
        swapVisibility(targetLayer, 'secondVisible')
      }
    },
    reorderLayers (state, layers) {
      state.layers = layers
    },
    // Set the sidebar contents, and open the sidebar
    showSidebar (state, payload) {
      state.sidebarVisibility = true
      let targetLayer = _.find(
        state.layers,
        layer => layer.name === payload.layer
      )
      state.sidebarContent = targetLayer
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
    toggleSyncMaps (state) {
      state.syncMaps = !state.syncMaps
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
