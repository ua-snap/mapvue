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
    setLayers (state, layers) {
      var restructuredlayers = {}
      _.each(layers, layer => {
        layer.visible = false
        restructuredlayers[layer.name] = layer
      })
      state.layers = restructuredlayers
    },
    toggleLayerVisibility (state, payload) {
      state.layers[payload.layer].visible = !state.layers[payload.layer].visible
    }
  },
  // Some getters here are just used for watching global state changes.
  getters: {
    getLayers: function (state) {
      return state.layers
    }
  }
})
