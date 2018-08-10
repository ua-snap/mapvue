import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
Vue.use(Router)

// Lazy load the map wrapper
const MapInstanceWrapper = () => (Object.assign({
  component: import('@/components/MapInstanceWrapper')
}, Vue.$loadingDefaults))

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
