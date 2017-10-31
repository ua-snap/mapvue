<template>
<div id="sidebar"></div>
</template>

<script>
import showdown from 'showdown'

export default {
  props: ['mapObj'],
  data () {
    return {
      sidebar: undefined
    }
  },
  computed: {
    showOrHideSidebar () {
      return this.$store.state.sidebarVisibility
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

      // Populate sidebar content if showing it
      if (this.showOrHideSidebar === true) {
        var converter = new showdown.Converter({
          openLinksInNewWindow: true
        })

        var content = '<h3>' + this.sidebarContent.title + '</h3>'
        if (this.sidebarContent.legend !== false) {
          content = content.concat(
            '<img id="legend" src="' +
            process.env.GEOSERVER_WMS_URL +
            '?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=' +
            this.sidebarContent.name +
            '" onerror="this.style.display=\'none\'" />'
          )
        }
        content = content.concat(converter.makeHtml(this.sidebarContent.abstract))
        this.sidebar.setContent(content).show()
      } else {
        // Or, clear the content if hiding it.
        this.sidebar.setContent('').hide()
      }
    }
  }
}
</script>

<style lang="scss">
@import url("../../node_modules/leaflet-sidebar/src/L.Control.Sidebar.css");

#sidebar {
  font-family: 'Lato';
  font-size: 150%;
  z-index: 500;

  // Assign the ID to override an !important
  // assigned in the general Leaflet css.
  img #legend {
    max-width: 100%;
    display: block;
    float: right;
  }
  h3 {
    margin-bottom: 3rem;
  }
  h4 {
    margin-top: 2rem;
    font-size: 150%;
  }
  p {
    margin: 10px 0;
  }
}
</style>
