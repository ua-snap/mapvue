<template>
<div class="layer-menu" ng-hide="minimized || loadingData">
  <layer-list></layer-list>
    <div ng-hide="loadingData" class="mapTools form-inline">
      <label id="showMapInformation" class="btn btn-primary info" ng-click="showMapInformation(map.id)">
        <span class="glyphicon glyphicon-question-sign"></span>
        &nbsp;
        About this map&hellip;
      </label>
      <!-- <a ng-show="map.distribution_url" id="downloadMap" class="mobile-hidden btn btn-primary info" :ng-href="map.distribution_url">
        <span class="glyphicon glyphicon-download-alt"></span>
        &nbsp;
        Download data
      </a> -->
      <label id="showDualMaps" class="mobile-hidden btn btn-primary info" ng-click="toggleDualMaps()">
        <span ng-hide="dualMaps" class="glyphicon glyphicon-unchecked"></span>
        <span ng-hide="dualMaps">|</span>
        <span class="glyphicon glyphicon-unchecked"></span>
        &nbsp;
        Split / single map
      </label>
      <label id="syncDualMaps" class="mobile-hidden btn btn-primary info" ng-class="{'btn-success': syncMaps}" ng-show="dualMaps" ng-click="toggleSynchronizeMaps()">
        <span class="glyphicon glyphicon-flash"></span>
        &nbsp;
        Synchronize maps
      </label>
      <!-- <label id="showGraph" class="mobile-hidden btn btn-primary" ng-click="showGraph()" ng-show="graphButtonText">
        <span class="glyphicon glyphicon-signal"></span>
        &nbsp;
        {{ graphButtonText }}&hellip;
      </label> -->
      <label class="mobile-hidden btn btn-primary" ng-click="startTour()">
        <span class="glyphicon glyphicon-question-sign"></span>
        &nbsp;
        Take a tour of this map&hellip;
      </label>
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
    }
  },
  created () {
  }
}
</script>

<style lang="scss" scoped>
.layer-menu {
  z-index: 500;
  background-color: rgba(255, 255, 255, .75);
  position: absolute;
  top: 4em;
  padding: 3em 1em 1em 1em;

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
</style>
