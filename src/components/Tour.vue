<template></template>

<script>
export default {
  name: 'Tour',
  computed: {
    tourIsActive () {
      return this.$store.state.tourIsActive
    }
  }, watch: {
    // Start/stop the tour
    tourIsActive (tourIsActive) {
      if (tourIsActive === true) {
        // Tour started.  Clean up the app state and start tour.
        this.$store.commit('hideSplash')
        this.$store.commit('hideSidebar')
        this.$refs.component.tour.start()
      } else {
        // ...
      }
    }
  }
}
</script>

<style type="scss" scoped></style>
