<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
require('./global.scss')

export default {
  name: 'app'
}
</script>

<style lang="scss">
// Any styles belonging to the global scope should instad be in `global.scss`
</style>
