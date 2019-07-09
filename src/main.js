// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import VueAnalytics from 'vue-analytics'
import Loading from '@/components/Loading'
import VueMobileDetection from 'vue-mobile-detection'

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

// Attach 3rd party libraries to Vue instance objects
// https://vuejsdevelopers.com/2017/04/22/vue-js-libraries-plugins/
Object.defineProperty(Vue.prototype, 'Loading', { value: Loading })
Object.defineProperty(Vue.prototype, 'loadingDefaults', { value: {
  loading: Loading,
  delay: 200,
  timeout: 10000
}})

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
