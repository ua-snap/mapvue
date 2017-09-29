<template>
<div class="layer-list">
  <div v-for="layer in layers">
    <map-layer
      :name="layer.name"
      :title="layer.title"
      :abstract="layer.abstract"
      :visible="layer.visible"
    ></map-layer>
  </div>
</div>
</template>

<script>
import MapLayer from './MapLayer'

export default {
  name: 'LayerList',
  components: {
    'map-layer': MapLayer
  },
  computed: {
    layers () {
      return this.$store.state.layers
    }
  }
}
</script>

<style lang="scss" scoped"></style>
