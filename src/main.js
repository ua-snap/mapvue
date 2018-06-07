// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import L from 'leaflet'
import p4l from 'proj4leaflet' // eslint-disable-line
import leaflet_sidebar from 'leaflet-sidebar' // eslint-disable-line
import leaflet_sync from '../node_modules/leaflet.sync/L.Map.Sync.js' // eslint-disable-line
import leaflet_awesome_markers from '../node_modules/leaflet.awesome-markers/dist/leaflet.awesome-markers.js' // eslint-disable-line
import shepherd from 'tether-shepherd'
import moment from 'moment'
import VueAnalytics from 'vue-analytics'

// Polyfill needed for IE11 to work properly with Axios.
require('es6-promise').polyfill()
var axios = require('axios')

Vue.use(VueAnalytics, {
  id: [process.env.MV_GOOGLE_ANALYTICS_TOKEN],
  router,
  checkDuplicatedScript: true,
  debug: {
    enabled: false,
    sendHitTask: true
  }
})

// Attach 3rd party libraries to Vue instance objects
// https://vuejsdevelopers.com/2017/04/22/vue-js-libraries-plugins/
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

// Disable nag
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  store: store
})
