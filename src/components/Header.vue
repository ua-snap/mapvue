<template>

<div class="container">
  <nav class="navbar" role="navigation" aria-label="main navigation">

    <div class="navbar-brand">
      <a class="navbar-item" href="https://uaf-iarc.org">
        <img :src="image">
      </a>

      <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div class="navbar-menu">
      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
            <a class="button" v-for="button in buttons" v-bind:class="button.class" v-bind:key="button.href" target="_blank" rel="noopener noreferrer" v-bind:href="button.href">{{ button.title }}</a>
            <a target="_blank" rel="noopener noreferrer" href="https://uaf-iarc.typeform.com/to/mN7J5cCK#tool=Historical%20Sea Ice%20Atlas%20for%20Alaska%20&%20The%20Arctic" class="button is-link">
              <strong>Feedback</strong>
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</div>

</template>

<script>
export default {
  name: 'Header',
  props: {
    logo: String,
    buttons: Array,
  },
  computed: {
    image () {
      if(this.logo == 'accap') {
        return '/static/ACCAP_wide.svg'
      }
      return '/static/SNAP_color_all.png'
    }
  }
}
</script>

<style lang="scss" scoped>
nav {
  border-bottom: 1px solid #aaa;
}

.navbar-brand img {
  height: 3rem;
  max-height: 3rem;
}
</style>
