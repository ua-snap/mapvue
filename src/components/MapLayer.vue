<template>
<div :id="name" class="layer" data-toggle="buttons">
  <!-- We need @click.prevent because of this: https://github.com/vuejs/vue/issues/3699 -->
  <label
    class="btn btn-primary visibility"
    :class=" { 'btn-success': visible }"
    @click.prevent="toggleLayer(name)"
  >
    <span v-if="visible" class="glyphicon glyphicon-check" ></span>
    <span v-if="!visible" class="glyphicon glyphicon-unchecked"></span>
    <input type="checkbox" autocomplete="off">
  </label>
  <!-- Buttons for second map -->
  <label
    class="btn btn-primary visibility"
    v-if="dualMaps"
    :class=" { 'btn-success': secondVisible }"
    @click.prevent="toggleLayer(name, 'second')"
  >
    <span v-if="secondVisible" class="glyphicon glyphicon-check"></span>
    <span v-if="!secondVisible" class="glyphicon glyphicon-unchecked"></span>
    <input type="checkbox" autocomplete="off">
  </label>
  <!-- Information about layer button -->
  <label
    class="btn btn-primary info"
    @click="showLayerInformation(name)"
  >
    <span class="glyphicon glyphicon-info-sign"></span>
  </label>
  {{ title }}
</div>
</template>

<script>

export default {
  name: 'MapLayer',
  props: ['name', 'title', 'abstract', 'visible', 'secondVisible'],
  computed: {
    dualMaps () {
      return this.$store.state.dualMaps
    }
  },
  methods: {
    toggleLayer (layerName, mapPane) {
      this.$store.commit('toggleLayerVisibility', {
        layer: layerName,
        mapPane: mapPane
      })
    },
    showLayerInformation (layer) {
      this.$store.commit('showSidebar', {
        layer: layer
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .layer {
    margin: 5px 0;
    cursor: pointer;
    cursor: hand;
    .btn {
      margin: 0 5px 0 0;
    }
  }
</style>
