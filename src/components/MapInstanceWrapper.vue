<template>
  <div id="map-instance-wrapper">
    <component ref="component" v-bind:is="mapComponent">
      <!-- Map-specific HTML & Tour will be rendered here -->
    </component>
  </div>
</template>

<script>
// Loading component to show during async component load
import Loading from '@/components/Loading'

// Specify defaults for lazy loading the map components
const loadingDefaults = {
  loading: Loading,
  delay: 200,
  timeout: 10000
}

// Import all map components, lazy-load style, showing the loading
// component while the load is in progress.
// https://vuejs.org/v2/guide/components.html#Advanced-Async-Components
const MvIam = () => (Object.assign({
  component: import('@/components/Maps/IAM')
}, loadingDefaults))

const MvAkFires = () => (Object.assign({
  component: import('@/components/Maps/AK_Fires')
}, loadingDefaults))

const MvAaokh = () => (Object.assign({
  component: import('@/components/Maps/AAOKH')
}, loadingDefaults))

// This one will either be removed or replaced, so not fully updating it
// here yet.
const MvSnapRcp6 = () => import('@/components/Maps/SNAP_RCP6')

var mapSlugComponentMapper = {
  'snap-rcp-6.0': MvSnapRcp6,
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

<style type="scss" scoped>
/* Styles common to all maps can be put here. */
#map-instance-wrapper /deep/ h1.map-title {
  position: absolute;
  top: 0; left: 0;
  z-index: 100;
  background-color: rgba(255, 255, 255, .9);
  margin: 0;
  padding: .5ex;
}
</style>
