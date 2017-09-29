<template>
<div id="outer-map-wrapper">
  <h1 id="mapTitle">{{ map.title }}</h1>
  <layer-menu
    :map="map"
  ></layer-menu>
<!--
  <map-splash-screen></map-splash-screen>
  <map-loading-indicator></map-loading-indicator>
-->

  <div id="info-sidebar"></div>

  <div id="mapsWrapper">
    <div id="snapmapapp" ng-class="{'half': dualMaps}"></div>
    <div id="secondmap" ng-class="{'half': dualMaps}"></div>
  </div>

  <component v-bind:is="currentMap">
    <!-- Map-specific HTML & Tour will be rendered here -->
  </component>

  <mv-footer></mv-footer>
</div>
</template>

<script>
import LayerMenu from './LayerMenu'
import Footer from './Footer'

/**
This whole hoo-haw should be redone, it's not easily extensible
or easy to understand the right factorization here, but this isn't
good.
*/
import MvIam from './Maps/IAM.vue'
import MvAkFires from './Maps/AK_Fires.vue'
import MvSnapRcp6 from './Maps/SNAP_RCP6.vue'

var mapSlugs = {
  'snap-rcp-6.0': 'MvSnapRcp6',
  'iam': 'MvIam',
  'fires': 'MvAkFires'
}

var mapObjectMapper = {
  'MvIam': MvIam,
  'MvAkFires': MvAkFires,
  'MvSnapRcp6': MvSnapRcp6
}
/* End hoo-haw. */

export default {
  name: 'map',
  props: ['slug'],
  data () {
    return {
      map: undefined, // Will be set upon creation via props.slug
      currentMap: undefined // contains reference to current map slug
    }
  },
  computed: {
    layers () {
      return this.$store.state.layers
    }
  },
  components: {
    'layer-menu': LayerMenu,
    'mv-footer': Footer,
    ...mapObjectMapper
  },
  created () {
    this.map = this.$store.state.maps[this.slug]
    this.currentMap = mapSlugs[this.slug]
    this.$store.commit('setLayers', mapObjectMapper[this.currentMap].data().layers)
  }
}
</script>

<style type="scss" scoped>

</style>
