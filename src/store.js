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
      state.layers = layers
    },
    toggleLayerVisibility (state, payload) {
      // state.layers[payload.layer].visible = !state.layers[payload.layer].visibile
      console.log(state.layers)
      console.log(payload)
      // console.log(state.layers[payload.layer].visible)
    }
  }
})
