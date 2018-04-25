<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
// Include styles for some libraries here;
// it's important to include Bootstrap first so that our custom
// styls will override its defaults.
require('../node_modules/bootstrap-sass/assets/stylesheets/_bootstrap.scss')
require('./global.scss')

export default {
  name: 'app'
}
</script>

<style lang="scss">
// Any styles belonging to the global scope should instad be in `global.scss`
</style>
