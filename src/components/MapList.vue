<template>
  <ul class="map-list">
    <li v-for="(map, key) in maps" v-if="!map.draft">
      <router-link class="button" :to="{ name: 'map', params: { slug: key }}" v-if="!map.path">
        {{ map.title}}
      </router-link>
      <a class="button" v-else v-bind:href="map.path">
        {{ map.title}}
      </a>
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
  padding: 1em;
  margin: 0;
  list-style: none;
  & li {
    font-size: 150%;
    line-height: 1.2;
  }
}
</style>
