<template>
  <ul class="map-list">
    <li v-for="(map, key) in maps" v-if="!map.draft">
      <router-link :to="{ name: 'map', params: { slug: key }}">
        {{ map.title}}
      </router-link>
    </li>
  </ul>
</template>

<script>
import maps from '../maps.js'

export default {
  name: 'map-list',
  computed: {
    maps () {
      return maps
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

.map-list {
  padding: 0;
  margin: 0;
  list-style: none;
  & li {
    cursor: pointer;
    font-size: 18pt;
    padding: 0;
    margin: 0 0 .75ex 0;
    line-height: .92;
  }
}
</style>
