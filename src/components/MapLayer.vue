<template>
<div  :id="id"
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
  <a class="info" @click="showLayerInformation(id)">&#9432;</a>

  <!-- Dual map controls -->
  <a
    class="split-map-controls"
    v-if="dualMaps && !layer.local"
  >
    <a
      class="left-right"
      :class="{'visible':layer.visible}"
      @click.prevent="toggleLayer(id)"
    >
      Left
    </a>
    &#47;
    <a
      class="left-right"
      :class="{'visible':layer.secondVisible}"
      @click.prevent="toggleLayer(id, 'second')"
    >
      Right
    </a>
  </a>

  <!-- Layer title! -->
  <span class="layer-title">
    <a
      @click.prevent="toggleLayer(id)"
    >
      <span v-if="layer.visible || (dualMaps && layer.secondVisible)" >&#10003;</span>
      <span
        v-html="layer.title"
        :class=" { 'visible': layer.visible || (dualMaps && layer.secondVisible) }">
      </span>
    </a>
  </span>

  <!-- If there is a custom layer configuration renderer, show here. -->
  <span v-if="controls && (layer.visible || layer.secondVisible)">
    <keep-alive>
      <component
        v-bind:is="customConfigurationRenderer"
        @change="handleLayerConfigChange"
        :defaults="rendererDefaults"
      ></component>
    </keep-alive>
  </span>
</div>
</template>

<script>

// Import custom widgets that may be used.
import DateScenarioSelector from '@/components/DateScenarioSelector'
import MonthSelector from '@/components/MonthSelector'
import _ from 'lodash'

export default {
  name: 'MapLayer',
  props: ['id', 'nodata', 'nodataMessage', 'controls'],
  computed: {
    layer () {
      // Helper to return a layer from the ordered array of layers.
      let targetLayerIndex = _.findIndex(
        this.$store.state.layers,
        layer => layer.id === this.id
      )
      return this.$store.state.layers[targetLayerIndex]
    },
    dualMaps () {
      return this.$store.state.dualMaps
    },
    customConfigurationRenderer () {
      // Right now, there's two custom renderers for
      // selecting time slices.  If needed, refactor
      // this to be more general later!
      if (this.controls === 'months') {
        return MonthSelector
      } else {
        return DateScenarioSelector
      }
    },
    rendererDefaults () {
      return this.layer.defaults
    }
  },
  methods: {
    toggleLayer (name, mapPane) {
      // If the layer has data, toggle on/off!
      if (!this.nodata) {
        this.$store.commit('toggleLayerVisibility', {
          id: this.id,
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
    },
    handleLayerConfigChange (data) {
      this.$store.commit('updateLayer', {
        layer: this.id,
        properties: data
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
  border-radius: 50%;
  display: inline-block;
  padding: 0 5px;
  margin: 0 -5px;
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

/* Used by DateScenarioSelector and MonthSelector */
/deep/ .layer--selector {
  text-align: right;
  select {
    width: 7em;
    font-size: 80%;
  }
}

</style>
