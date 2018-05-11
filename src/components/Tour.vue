<template></template>

<script>
export default {
  name: 'Tour',
  props: ['tour'],
  computed: {
    tourIsActive () {
      return this.$store.state.tourIsActive
    }
  },
  mounted () {
    // Handle event when tour is finished, or user pushes
    // the "Close" button
    var completeTour = (event) => {
      this.$store.commit('endTour')
    }
    this.tour.on('complete', completeTour)
    this.tour.on('cancel', completeTour)
  },
  watch: {
    // Start/stop the tour
    tourIsActive (tourIsActive) {
      if (tourIsActive === true) {
        // Tour started.  Clean up the app state and start tour.
        this.$store.commit('hideSplash')
        this.$store.commit('hideSidebar')
        this.tour.start()
      }
    }
  },
  beforeDestroy () {
    this.tour.cancel()
  }
}
</script>

<style type="scss" scoped></style>
