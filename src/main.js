// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import L from 'leaflet'
import p4l from 'proj4leaflet' // eslint-disable-line
import leaflet_sidebar from 'leaflet-sidebar' // eslint-disable-line
import axios from 'axios'

// Attach 3rd party libraries to Vue instance objects
// https://vuejsdevelopers.com/2017/04/22/vue-js-libraries-plugins/
Object.defineProperty(Vue.prototype, '$L', { value: L })
Object.defineProperty(Vue.prototype, '$axios', { value: axios })

/* Hacks section */
// TODO move these into another appropriate spot!
window.geoserverWmsUrl = 'http://54.70.10.93:8080/geoserver/wms'
window.pendingRequests = 0
/* End ghoulish hacks */

// Oddly, this is the correct thing to do here.
require('../node_modules/bootstrap-sass/assets/stylesheets/_bootstrap.scss')

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  store: store
})
