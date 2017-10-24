<template>
<div class="layer-menu">
  <label v-bind:class="{hide: !layerMenuVisibility}" class="btn btn-secondary" @click="hideLayerMenu()">Hide Layer Menu</label>
  <label v-bind:class="{hide: layerMenuVisibility}" class="btn btn-secondary" @click="showLayerMenu()">Show Layer Menu</label>
  <div v-bind:class="{hide: !layerMenuVisibility}">
    <layer-list></layer-list>
    <div class="mapTools form-inline">
      <label class="btn btn-primary info" @click="showSplash()">
        <span class="glyphicon glyphicon-question-sign"></span>
        &nbsp;
        About this map&hellip;
      </label>

      <label id="showDualMaps" class="mobile-hidden btn btn-primary info" @click="toggleDualMaps()">
        <span v-show="!dualMaps">
          <span v-show="!dualMaps" class="glyphicon glyphicon-unchecked"></span>
          |
        </span>
        <span class="glyphicon glyphicon-unchecked"></span>
        &nbsp;
        Split / single map
      </label>

      <label id="syncDualMaps" class="mobile-hidden btn btn-primary info" :class="{ 'btn-success': syncMaps }" v-show="dualMaps" @click="toggleSyncMaps()">
        <span class="glyphicon glyphicon-flash"></span>
        &nbsp;
        Synchronize maps
      </label>

      <label class="mobile-hidden btn btn-primary" @click="startTour()">
        <span class="glyphicon glyphicon-question-sign"></span>
        &nbsp;
        Take a tour of this map&hellip;
      </label>
        <!-- <a ng-show="map.distribution_url" id="downloadMap" class="mobile-hidden btn btn-primary info" :ng-href="map.distribution_url">
        <span class="glyphicon glyphicon-download-alt"></span>
        &nbsp;
        Download data
        </a> -->

      <label class="mobile-hidden btn btn-primary" @click="showFireGraph()">
        <span class="glyphicon glyphicon-signal"></span>
        &nbsp;
        Graph large fire seasons&hellip;
      </label>
    </div>
  </div>
</div>
</template>

<script>
import LayerList from './LayerList'
export default {
  name: 'LayerMenu',
  props: ['map'],
  components: {
    'layer-list': LayerList
  },
  computed: {
    dualMaps () {
      return this.$store.state.dualMaps
    },
    syncMaps () {
      return this.$store.state.syncMaps
    },
    layerMenuVisibility () {
      return this.$store.getters.layerMenuVisibility
    }
  },
  methods: {
    hideLayerMenu () {
      this.$store.commit('hideLayerMenu')
    },
    showLayerMenu () {
      this.$store.commit('showLayerMenu')
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
    },
    showFireGraph () {
      this.$store.commit('showFireGraph')
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
  padding: 1em 1em 1em 1em;

  .mapTools {
    margin: 1em 0;
    label, a {
      display: block;
      margin: 1ex 0;
      text-align: left !important;
      width: 16em;
    }

    #showDualMaps {
      @media screen and (max-width: 768px) {
        display: none;
      }
    }
  }
}

.hide {
  display: none;
}
</style>
