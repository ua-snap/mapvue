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
import leaflet_sync from '../../node_modules/leaflet.sync/L.Map.Sync.js' // eslint-disable-line
import shepherd from 'tether-shepherd'
import moment from 'moment'
import 'leaflet/dist/leaflet.css'
import 'tether/dist/css/tether.css'
import 'tether/dist/css/tether-theme-arrows-dark.css'
import 'tether-shepherd/dist/css/shepherd-theme-square-dark.css'
import 'balloon-css/balloon.css'

// Polyfill needed for IE11 to work properly with Axios.
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

var mapSlugComponentMapper = {
  'snap-data-intro': MvSnapRcp6,
  'iam': MvIam,
  'fires': MvAkFires,
  'aaokh': MvAaokh
}

export default {
  name: 'MapInstanceWrapper',
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
