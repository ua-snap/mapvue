<template>
  <div id="map-instance-wrapper">
    <component ref="component" v-bind:is="mapComponent">
      <!-- Map-specific HTML & Tour will be rendered here -->
    </component>
  </div>
</template>

<script>
// Import all map components
import MvIam from '@/components/Maps/IAM'
import MvAkFires from '@/components/Maps/AK_Fires'
import MvSnapRcp6 from '@/components/Maps/SNAP_RCP6'

var mapSlugComponentMapper = {
  'snap-rcp-6.0': MvSnapRcp6,
  'iam': MvIam,
  'fires': MvAkFires
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
// Styles common to all maps can be put here.
#map-instance-wrapper /deep/ h1.map-title {
  position: absolute;
  top: 0; left: 0;
  z-index: 100;
  background-color: rgba(255, 255, 255, .9);
  margin: 0;
  padding: .5ex;
}
</style>
