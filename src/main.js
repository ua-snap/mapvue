/* global process */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import VueAnalytics from 'vue-analytics'
import VueMobileDetection from 'vue-mobile-detection'
import Meta from 'vue-meta'
import 'bulma/css/bulma.css'

Vue.use(Meta)

Vue.use(VueAnalytics, {
  id: [process.env.MV_GOOGLE_ANALYTICS_TOKEN],
  router,
  checkDuplicatedScript: true,
  debug: {
    enabled: false,
    sendHitTask: true
  }
})

// Exposes Vue.$isMobile()
Vue.use(VueMobileDetection)

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
