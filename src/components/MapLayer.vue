<template>
<div  :id="name"
      class="layer"
      :class="{'nodata':nodata}"
      data-toggle="buttons"
      :data-balloon="nodataMessage"
      data-balloon-pos="right"
>
  <!-- Below, we need @click.prevent because of this: https://github.com/vuejs/vue/issues/3699 -->

  <!-- Draggy handle -->
  <span class="reorder"><svg xmlns="https://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path stroke="#888" fill="#888" d="M20 9H4v2h16V9zM4 15h16v-2H4v2z"/></svg></span>

  <!-- Information about layer button -->
  <a class="info" @click="showLayerInformation(name)">&#9432;</a>

  <!-- Dual map controls -->
  <a
    class="split-map-controls"
    v-if="dualMaps"
  >
    <a
      class="left-right"
      :class="{'visible':visible}"
      @click.prevent="toggleLayer(name)"
    >
      Left
    </a>
    &#47;
    <a
      class="left-right"
      :class="{'visible':secondVisible}"
      @click.prevent="toggleLayer(name, 'second')"
    >
      Right
    </a>
  </a>

  <!-- Layer title! -->
  <span class="layer-title">
    <a
      @click.prevent="toggleLayer(name)"
    >
      <span v-if="visible || (dualMaps && secondVisible)" >&#10003;</span>
      <span
        v-html="title"
        :class=" { 'visible': visible || (dualMaps && secondVisible) }">
      </span>
    </a>
  </span>
</div>
</template>

<script>

export default {
  name: 'MapLayer',
  props: ['name', 'title', 'abstract', 'visible', 'secondVisible', 'nodata', 'nodataMessage'],
  computed: {
    dualMaps () {
      return this.$store.state.dualMaps
    }
  },
  methods: {
    toggleLayer (layerName, mapPane) {
      // If the layer has data, toggle on/off!
      if (!this.nodata) {
        this.$store.commit('toggleLayerVisibility', {
          layer: layerName,
          mapPane: mapPane
        })
        this.$ga.event({
          eventCategory: 'Toggle ' + this.title + ' layer',
          eventAction: 'toggle',
          eventLabel: 'Map Layer Toggle'
        })
      }
    },
    showLayerInformation (layer) {
      this.$store.commit('showSidebar', {
        layer: layer
      })
      this.$ga.event({
        eventCategory: 'View ' + this.title + ' layer information',
        eventAction: 'toggle',
        eventLabel: 'Map Layer Info'
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
  margin-left: 1ex;
}
.visible {
  font-weight: 900;
  text-shadow: #FC0 1px 0 10px;
  text-decoration: underline;
}
.layer-title {
  display: inline-block;
  padding-left: 1ex;

  & span {
    color: #666;
    padding: 0;
    margin: 0;
  }
}

a.info {
  font-weight: 900;
  &:hover { text-decoration: none; }
}

.reorder {
  display: inline-block;
  position: relative;
  top: 2px;
  cursor: move;
  padding-right: .25ex;
}

.nodata {
  a {
    color: #888;
  }
  & a.layer-title {
    cursor: not-allowed;
    text-decoration: line-through;
    &:hover, &:focus {
      text-decoration: line-through;
    }
  }
  span.reorder {
    visibility: hidden;
  }
}

</style>
