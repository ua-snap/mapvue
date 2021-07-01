/* eslint-disable no-unused-vars */

import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/map/fires',
      beforeEnter(to, from, next) {
        window.location.href = 'https://snap.uaf.edu/tools/alaska-wildfires'
      }
    },
    {
      path: '/map/aaokh',
      beforeEnter(to, from, next) {
        window.location.href = 'https://arctic-aok.org'
      }
    },
    {
      path: '/map/snap-data-intro',
      beforeEnter(to, from, next) {
        window.location.href = 'https://uaf-snap.org/tools-overview/'
      }
    },
    {
      path: '/map/iam',
      beforeEnter(to, from, next) {
        window.location.href = 'https://uaf-snap.org/tools-overview/'
      }
    },
    {
      path: '/environmental-impacts-access/index.html',
      beforeEnter(to, from, next) {
        window.location.href = 'https://snap.uaf.edu/tools/living-off-the-land'
      }
    }
  ]
})
