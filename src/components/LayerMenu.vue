<template>
<div class="layer-menu">
  <label class="btn btn-primary" @click="toggleLayerMenu()">
    <span v-show="layerMenuVisibility" class="glyphicon glyphicon-remove"></span>
    <span v-show="!layerMenuVisibility" class="glyphicon glyphicon-menu-hamburger"></span>
  </label>
  <div v-show="layerMenuVisibility" class="menu-wrapper">
    <layer-list></layer-list>
    <div class="map-tools form-inline">

      <layer-menu-button-item
        glyphicon="question-sign"
        :callback="showSplash"
        text="About this map"
      ></layer-menu-button-item>

      <layer-menu-button-item
        :class="{ 'btn-success': dualMaps }"
        classes="mobile-hidden"
        glyphicon="resize-horizontal"
        :callback="toggleDualMaps"
        text="Split / single map"
      ></layer-menu-button-item>

      <layer-menu-button-item
        :class="{ 'btn-success': syncMaps }"
        v-show="dualMaps"
        glyphicon="flash"
        :callback="toggleSyncMaps"
        text="Synchronize maps"
      ></layer-menu-button-item>

      <layer-menu-button-item
        glyphicon="question-sign"
        classes="mobile-hidden"
        :callback="startTour"
        text="Take a tour of this map"
      ></layer-menu-button-item>

      <layer-menu-button-item
        v-for="(button, index) in buttons"
        :key="index"
        :glyphicon="button.glyphicon"
        :classes="button.classes"
        :callback="button.callback"
        :text="button.text"
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
    },
    startTour () {
      this.$store.commit('startTour')
    },
    toggleDualMaps () {
      this.$store.commit('toggleDualMaps')
    },
    toggleSyncMaps () {
      this.$store.commit('toggleSyncMaps')
    }
  }
}
</script>

<style lang="scss" scoped>
.layer-menu {
  z-index: 500;
  background-color: rgba(255, 255, 255, .75);
  position: absolute;
  top: 4em;
  padding: 1em;

  .map-tools {
    margin: 1em 0;
    label, a {
      display: block;
      margin: 1ex 0;
      text-align: left !important;
      width: 16em;
    }

    /deep/ .mobile-hidden {
      @media screen and (max-width: 768px) {
        display: none;
      }
    }
  }

  .menu-wrapper {
    margin-top: 1em;
  }
}
</style>
