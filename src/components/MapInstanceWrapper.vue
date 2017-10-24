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

<style type="scss" scoped"></style>
