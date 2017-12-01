<template>
  <div></div>
</template>

<script>
/* eslint-disable */

// General map components
import Sidebar from './Sidebar'
import SplashScreen from './SplashScreen'
import MvMap from './Map'
import LayerMenu from './LayerMenu'
import Footer from './Footer'

export default {
  name: 'MapInstance',
  components: {
    'mv-map': MvMap,
    'layer-menu': LayerMenu,
    'mv-footer': Footer,
    'sidebar': Sidebar,
    'splash-screen': SplashScreen
  },
  data () {
    return {
      // Will be specified once the DOM is ready & we have
      // the actual reference to the map object
      primaryMapObject: undefined
    }
  },
  created () {
    // Initialize the store with the current component layers
    this.$store.commit('setLayers', this.layers)
  },
  mounted () {
    // The DOM needs to be ready before we can reference
    // this.$refs, so this needs to be in a mounted() hook.
    this.primaryMapObject = this.$refs.map.primaryMapObject
  }
}

</script>

<style lang="scss" scoped></style>
