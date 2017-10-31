import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import MapInstanceWrapper from '@/components/MapInstanceWrapper'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/map/:slug',
      name: 'map',
      component: MapInstanceWrapper,
      props: true
    }
  ]
})
