<template>
  <div id="map-instance-wrapper">
    <component ref="component" v-bind:is="mapComponent">
      <!-- Map-specific HTML & Tour will be rendered here -->
    </component>
  </div>
</template>

<script>
import Vue from 'vue'
import store from '../store'
import L from 'leaflet'
import p4l from 'proj4leaflet' // eslint-disable-line
import leaflet_sidebar from 'leaflet-sidebar' // eslint-disable-line
import leaflet_side_by_side from 'leaflet-side-by-side' // eslint-disable-line
import leaflet_heat from 'leaflet.heat' // eslint-disable-line
import shepherd from 'shepherd.js'
import moment from 'moment'
import 'leaflet/dist/leaflet.css'
import '@/shepherd.css'

// Polyfill needed for IE11 to work properly with Axios.
/* global require */
require('es6-promise').polyfill()
var axios = require('axios')

Object.defineProperty(Vue.prototype, '$L', { value: L })
Object.defineProperty(Vue.prototype, '$axios', { value: axios })
Object.defineProperty(Vue.prototype, '$shepherd', { value: shepherd })
Object.defineProperty(Vue.prototype, '$moment', { value: moment })

// Wire in two listeners that will keep track of open
// HTTP requests.
Vue.prototype.$axios.interceptors.request.use(function (config) {
  store.commit('incrementPendingHttpRequest')
  return config
}, function (error) {
  return Promise.reject(error)
})

// Add a response interceptor
Vue.prototype.$axios.interceptors.response.use(function (response) {
  store.commit('decrementPendingHttpRequest')
  return response
}, function (error) {
  return Promise.reject(error)
})

// Import all map components, lazy-load style, showing the loading
// component while the load is in progress.
// https://vuejs.org/v2/guide/components.html#Advanced-Async-Components
const MvIam = () => (Object.assign({
  component: import('@/components/Maps/IAM')
}, Vue.$loadingDefaults))

const MvAkFires = () => (Object.assign({
  component: import('@/components/Maps/AK_Fires')
}, Vue.$loadingDefaults))

const MvAaokh = () => (Object.assign({
  component: import('@/components/Maps/AAOKH')
}, Vue.$loadingDefaults))

const MvSnapRcp6 = () => (Object.assign({
  component: import('@/components/Maps/SNAP_RCP6')
}, Vue.$loadingDefaults))

const MvHsiaa = () => (Object.assign({
  component: import('@/components/Maps/HSIAA')
}, Vue.$loadingDefaults))

// The keys in the key/value map below
// need to match the "slug" that is defined
// in the /src/maps.js file.
var mapSlugComponentMapper = {
  'snap-data-intro': MvSnapRcp6,
  'iam': MvIam,
  'fires': MvAkFires,
  'aaokh': MvAaokh,
  'historical-sea-ice-atlas': MvHsiaa
}

export default {
  name: 'MapInstanceWrapper',
  metaInfo: {
    titleTemplate: 'MapVentures: %s'
  },
  props: [
    'slug' // "slug" name (key) for map component to use here
  ],
  computed: {
    mapComponent () {
      return mapSlugComponentMapper[this.slug]
    }
  }
}

</script>
