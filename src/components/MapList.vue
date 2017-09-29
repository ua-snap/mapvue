<template>
  <ul class="map-list">
    <li v-for="(map, key) in maps">
      <router-link :to="{ name: 'map', params: { slug: key }}">
        {{ map.title}}
      </router-link>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'map-list',
  data () {
    return {
      maps: this.$store.state.maps
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
