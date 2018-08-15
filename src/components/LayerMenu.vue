<template>
<div class="layer-menu">
  <label @click="toggleLayerMenu()">
    <a v-show="layerMenuVisibility">Hide menu</a>
    <a v-show="!layerMenuVisibility">Show menu</a>
  </label>
  <div v-show="layerMenuVisibility" class="menu-wrapper">
    <layer-list></layer-list>
    <div class="map-tools form-inline">

      <div class="custom-buttons">
        <layer-menu-button-item
          :class="{ 'enabled': dualMaps }"
          classes="mobile-hidden"
          :callback="toggleDualMaps"
          text="Show two maps"
        ></layer-menu-button-item>
        <layer-menu-button-item
          :class="{ 'enabled': syncMaps }"
          classes="dual-maps"
          v-show="dualMaps"
          :callback="toggleSyncMaps"
          text="Link maps"
        ></layer-menu-button-item>
        <layer-menu-button-item
          v-for="(button, index) in buttons"
          :key="index"
          :classes="button.classes"
          :callback="button.callback"
          :text="button.text"
        ></layer-menu-button-item>
      </div>

      <layer-menu-button-item
        :callback="showSplash"
        text="About this map"
      ></layer-menu-button-item>

      <layer-menu-button-item
        classes="mobile-hidden"
        :callback="startTour"
        text="Take a tour of this map"
      ></layer-menu-button-item>

    </div>
  </div>
</div>
</template>

<script>
import LayerList from './LayerList'
import LayerMenuButtonItem from './LayerMenuButtonItem'

export default {
  name: 'LayerMenu',
  props: ['map', 'buttons'],
  components: {
    'layer-list': LayerList,
    'layer-menu-button-item': LayerMenuButtonItem
  },
  computed: {
    dualMaps () {
      return this.$store.state.dualMaps
    },
    syncMaps () {
      return this.$store.state.syncMaps
    },
    layerMenuVisibility () {
      return this.$store.state.layerMenuVisibility
    }
  },
  methods: {
    toggleLayerMenu () {
      this.$store.commit('toggleLayerMenu')
    },
    showSplash () {
      this.$store.commit('showSplash')
      this.$ga.event({
        eventCategory: 'Show About This Map splash screen',
        eventAction: 'show',
        eventLabel: 'About This Map'
      })
    },
    startTour () {
      this.$store.commit('startTour')
    },
    toggleDualMaps () {
      this.$store.commit('toggleDualMaps')
      this.$ga.event({
        eventCategory: 'Toggle Dual Maps',
        eventAction: 'toggle',
        eventLabel: 'Dual Maps'
      })
    },
    toggleSyncMaps () {
      this.$store.commit('toggleSyncMaps')
      this.$ga.event({
        eventCategory: 'Synchronize dual maps',
        eventAction: 'toggle',
        eventLabel: 'Dual Maps'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.layer-menu {
  z-index: 500;
  background-color: rgba(255, 255, 255, .9);
  position: absolute;
  top: 4em;
  padding: 1em;
  min-width: 20em; /* prevent horizontal resize if possible */

  .custom-buttons {
    margin: 2em 0;
  }

  .map-tools {
    margin: 1em 0;

    /deep/ {
      .dual-maps {
        margin-left: 2em;
      }
      .enabled {
        color: #23527c;
        font-weight: 900;
        text-shadow: #FC0 1px 0 10px;
      }
      .mobile-hidden {
        @media screen and (max-width: 768px) {
          display: none;
        }
      }
    }

  }

  .menu-wrapper {
    margin-top: 1em;
  }
}
</style>
