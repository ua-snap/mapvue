<template>
<div :id="name" class="layer" data-toggle="buttons">
  <!-- Below, we need @click.prevent because of this: https://github.com/vuejs/vue/issues/3699 -->

  <!-- Draggy handle -->
  <span class="glyphicon glyphicon-option-vertical drag"></span>

  <!-- Information about layer button -->
  <a @click="showLayerInformation(name)">
    <span>?</span>
  </a>

  <!-- Dual map controls -->
  <span
    class="split-map-controls"
    v-if="dualMaps"
  >
    <span
      class="left-right"
      :class="{'visible':visible}"
      @click.prevent="toggleLayer(name)"
    >
      Left
    </span>
    &#47;
    <span
      class="left-right"
      :class="{'visible':secondVisible}"
      @click.prevent="toggleLayer(name, 'second')"
    >
      Right
    </span>
  </span>

  <!-- Layer title! -->
  <span
    v-html="title"
    class="layer-title"
    :class=" { 'visible': visible || (dualMaps && secondVisible) }"
    @click.prevent="toggleLayer(name)"
  >{{ title }}</span>
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
    span.drag {
      cursor: grab;
      color: #888;
    }
  }
  .split-map-controls {
    display: inline-block;
    margin-left: 1em;
  }
  .visible {
    font-weight: 900;
    text-shadow: #FC0 1px 0 10px;
  }
  .layer-title {
    display: inline-block;
    padding-left: 1em;
  }
</style>
