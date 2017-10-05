import Vue from 'vue'
import Vuex from 'vuex'
import maps from './maps'
import _ from 'lodash'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    maps: maps,
    currentMap: undefined,
    layers: undefined
  },
  mutations: {
    // This function is used to initialize the layers in the store.
    setLayers (state, layers) {
      var restructuredlayers = []
      _.each(layers, layer => {
        layer.visible = false
        restructuredlayers.push(layer)
      })
      state.layers = restructuredlayers
    },
    toggleLayerVisibility (state, payload) {
      // Identify the layer in the array
      let targetLayerIndex = _.findIndex(
        state.layers,
        layer => layer.name === payload.layer
      )
      let targetLayer = state.layers[targetLayerIndex]

      // Swap visibility flag
      targetLayer.visible = !targetLayer.visible

      // If the layer is being turned on,
      // pull it to the top of the list
      if (targetLayer.visible === true) {
        state.layers.splice(targetLayerIndex, 1)
        state.layers.unshift(targetLayer)
      }
    },
    reorderLayers (state, layers) {
      state.layers = layers
    }
  },
  // Some getters here are just used for watching global state changes.
  getters: {
    getLayers: function (state) {
      return state.layers
    }
  }
})
