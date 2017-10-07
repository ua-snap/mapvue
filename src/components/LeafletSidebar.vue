<template>
<div id="sidebar"></div>
</template>

<script>
export default {
  props: ['mapObj'],
  data () {
    return {
      sidebar: undefined
    }
  },
  computed: {
    showOrHideSidebar () {
      return this.$store.getters.sidebarVisibility
    },
    sidebarContent () {
      return this.$store.state.sidebarContent
    }
  },
  watch: {
    showOrHideSidebar () {
      // If necessary, create the sidebar control.
      // This should be done here instead of during the
      // created/mounted cycle because the map and other
      // objects may not be fully instantiated yet.
      if (undefined === this.sidebar) {
        this.sidebar = this.$L.control.sidebar('sidebar', {
          position: 'left',
          autoPan: false
        })
        this.mapObj.addControl(this.sidebar)

        // Wire in the event to watch for closing the sidebar
        this.sidebar.on('hidden', () => {
          this.$store.commit('hideSidebar')
        })
      }

      // Only take action if the sidebar is being shown.
      if (this.showOrHideSidebar === true) {
        this.sidebar.setContent(this.sidebarContent).show()
      }
    }
  }
}
</script>

<style lang="scss">
@import url("../../node_modules/leaflet-sidebar/src/L.Control.Sidebar.css");
</style>
