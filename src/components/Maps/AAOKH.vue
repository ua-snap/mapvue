<template>
<div>
  <h1 class='map-title'>{{ title }}</h1>
  <layer-menu></layer-menu>
  <splash-screen
    :abstract='abstract'></splash-screen>
  <mv-map
    ref='map'
    :baseLayerOptions='baseLayerOptions'
    :baseLayer='baseLayer'
    :placeLayer='placeLayer'
    :crs='crs'
    :mapOptions='mapOptions'
    :local-layers="localLayers"
  ></mv-map>
  <sidebar :mapObj='primaryMapObject'></sidebar>
  <tour class='tour' :tour='tour'></tour>
  <mv-footer></mv-footer>
</div>
</template>
<script>
/* eslint new-cap: 'off' */
import _ from 'lodash'
import MapInstance from '@/components/MapInstance'
import Tour from '../Tour'

// Will have references to DOM objects used in the tour
var observationLayer // eslint-disable-line no-unused-vars

export default {
  name: 'aaokh',
  extends: MapInstance,
  components: {
    tour: Tour
  },
  created () {
    // Process the observed SIZONET data
    var observations = []
    var popupOptions = {
      maxWidth: 200
    }
    _.each(this.observations, feature => {
      observations.push(
        this.$L.marker(
          new this.$L.latLng([feature.lat, feature.lon])).bindPopup(this.getPopupContents(feature), popupOptions))
    })
    this.observationMarkers = observations
    observationLayer = this.$L.layerGroup(observations)
  },
  mounted () {
    // Necessary to see the markers.
    this.$L.Icon.Default.imagePath = 'static/'
  },
  data () {
    return {
      observations: [
        {
          'lat': 71.2906,
          'lon': -156.5486,
          'id': 6123,
          'identifier': 'UTQAD1802091332',
          'hunting': false,
          'fishing': false,
          'dark_sky_visible': false,
          'unusual_condition_situation': false,
          'original_observation_text': 'Location Gravel Pit, overcast, temperature 7f, light winds, and visibility to 7 miles. You can see the ice is active and has piled up about 1/4 mile out where it has piled up recently.',
          'rating': 1,
          'created_at': '2018-02-12T16:59:19.054Z',
          'updated_at': '2018-02-12T17:00:11.434Z',
          'ice_fog': false,
          'instructional_value': false,
          'access_id': null,
          'air_temperature_min': -13.889,
          'air_temperature_max': -13.889,
          'wind_speed_min': null,
          'wind_speed_max': null,
          'visibility_min': 11.265,
          'visibility_max': 11.265,
          'shorefast_ice_thickness_min': null,
          'shorefast_ice_thickness_max': null,
          'distance_to_lead_min': null,
          'distance_to_lead_max': null,
          'distance_to_the_pack_ice_min': null,
          'distance_to_the_pack_ice_max': null,
          'obs_date': '2018-02-09',
          'obs_time': '2000-01-01T13:32:00.000Z',
          'boat_count': null,
          'person_count': null,
          'geom4326': null,
          'mirage': false
        },
        {
          'lat': 71.2006,
          'lon': -156.70884,
          'id': 6120,
          'identifier': 'UTQAD1802081050',
          'hunting': false,
          'fishing': false,
          'dark_sky_visible': false,
          'unusual_condition_situation': false,
          'original_observation_text': ' Location Shop 3, temperature `14f, overcast, light southerly winds, and visibility to 7 miles. Big 2,000 pounder! It is piling up in places.',
          'rating': 1,
          'created_at': '2018-02-09T18:10:46.920Z',
          'updated_at': '2018-02-12T16:56:17.717Z',
          'ice_fog': false,
          'instructional_value': false,
          'access_id': null,
          'air_temperature_min': -10,
          'air_temperature_max': -10,
          'wind_speed_min': null,
          'wind_speed_max': null,
          'visibility_min': 11.265,
          'visibility_max': 11.265,
          'shorefast_ice_thickness_min': null,
          'shorefast_ice_thickness_max': null,
          'distance_to_lead_min': null,
          'distance_to_lead_max': null,
          'distance_to_the_pack_ice_min': null,
          'distance_to_the_pack_ice_max': null,
          'obs_date': '2018-02-08',
          'obs_time': '2000-01-01T10:50:00.000Z',
          'boat_count': null,
          'person_count': null,
          'geom4326': null,
          'mirage': false
        },
        {
          'lat': 71.2944,
          'lon': -156.7846,
          'id': 6122,
          'identifier': 'UTQAD1802071330',
          'hunting': false,
          'fishing': false,
          'dark_sky_visible': false,
          'unusual_condition_situation': false,
          'original_observation_text': 'Location Dry Cleaners, temperature 14f, mostly cloudy, south winds at about 10 mph, and visibility to 8 miles. It opened up very close and it closed up. This event tells me the shore fast ice was hit south from the pack ice which also tells me that the pack ice had to be solid enough to move this shorefast ice. I also know that south winds raises water level.',
          'rating': 1,
          'created_at': '2018-02-12T16:50:06.132Z',
          'updated_at': '2018-02-12T16:51:02.499Z',
          'ice_fog': false,
          'instructional_value': true,
          'access_id': null,
          'air_temperature_min': -10,
          'air_temperature_max': -10,
          'wind_speed_min': 4.47,
          'wind_speed_max': 4.47,
          'visibility_min': 12.875,
          'visibility_max': 12.875,
          'shorefast_ice_thickness_min': null,
          'shorefast_ice_thickness_max': null,
          'distance_to_lead_min': null,
          'distance_to_lead_max': null,
          'distance_to_the_pack_ice_min': null,
          'distance_to_the_pack_ice_max': null,
          'obs_date': '2018-02-07',
          'obs_time': '2000-01-01T13:30:00.000Z',
          'boat_count': null,
          'person_count': null,
          'geom4326': null,
          'mirage': false
        }
      ],
      title: 'AAOKH (Draft)',
      abstract: `
<h1>Alaska Arctic Observatory and Knowledge Hub</h1>
<p>The Alaska Arctic Observatory and Knowledge Hub (AAOKH) was established to build capacity in sharing information from community-based observations on cryosphere change conducted by northern Alaska communities. Observations that could be linked to the seasonal cycle of harvesting activities was identified as an important focus for prioritizing observations.</p>
<p>A Knowledge Hub was developed to provide tools and observational data of relevance to communities in the context of a changing seasonal cycle and offers community members opportunities to share insights and observations to support the information-sharing goals.
</p>
`,
      mapOptions: {
        zoom: 5,
        minZoom: 1,
        maxZoom: 8,
        center: [71.2906, -156.7886]
      },
      baseLayerOptions: {
        transparent: true,
        srs: 'EPSG:3338',
        format: 'image/png',
        version: '1.3',
        continuousWorld: true // needed for non-3857 projs
      },
      layers: [
        {
          'abstract': 'Placeholder for observations from ELOKA',
          'name': 'observations',
          'title': 'Observations',
          'legend': false,
          'local': true
        },
        {
          'abstract': 'TBD',
          'name': 'geoserver:Barrow02April2016',
          'title': 'Barrow Sea Ice Radar',
          'legend': false
        },
        {
          'abstract': 'TBD',
          'name': 'geoserver:WhalingTrails2017_3338',
          'title': 'Whaling Trails (2017)',
          'legend': false
        },
        {
          'abstract': 'TBD',
          'name': 'geoserver:NIC_SeaIce_5Dec2017_3338_AKExtent',
          'title': 'Sea Ice Extent',
          'legend': true
        },
        {
          'abstract': 'TBD',
          'name': 'geoserver:SeaIceConcentration06March2018_3338',
          'title': 'Sea Ice Concentration',
          'legend': true
        }
      ]
    }
  },
  computed: {
    crs () {
      return new this.$L.Proj.CRS('EPSG:3338',
      '+proj=aea +lat_1=55 +lat_2=65 +lat_0=50 +lon_0=-154 +x_0=0 +y_0=0 +ellps=GRS80 +datum=NAD83 +units=m +no_defs',
        {
          resolutions: [4096, 2048, 1024, 512, 256, 128, 64],

          // Origin should be lower-left coordinate
          // in projected space.  Use GeoServer to
          // find this:
          // TileSet > Gridset Bounds > compute from maximum extent of SRS
          origin: [-4648005.934316417, 444809.882955059]
        }
      )
    },
    baseLayer () {
      return new this.$L.tileLayer.wms(
        process.env.GEOSERVER_WMS_URL,
        _.extend(this.baseLayerOptions, {
          layers: 'alaska_osm'
        })
      )
    },
    placeLayer () {
      return new this.$L.tileLayer.wms(
        process.env.GEOSERVER_WMS_URL,
        _.extend(this.baseLayerOptions, {
          zIndex: 101,
          layers: 'alaska_places_osm_3338'
        })
      )
    },
    localLayers () {
      return {
        'observations': {
          first: observationLayer,
          second: observationLayer
        }
      }
    },
    tour () {
      let tour
      tour = new this.$shepherd.Tour({
        defaults: {
          classes: 'shepherd-theme-square-dark',
          showCancelLink: true
        }
      })

      tour.addStep({
        title: 'Compare changes with other places',
        attachTo: '#top_item right',
        text: `<p>See if patterns are similar at broad scales, then zoom in for more details and observations.  This is showing sea ice concentration.</p>`,
        classes: 'shepherd-theme-square-dark adjust-tour-panel',
        when: {
          show: () => {
            this.$store.commit('hideDualMaps')
            this.$store.commit('disableSyncMaps')
            this.$store.commit('showOnlyLayers', {
              first: ['geoserver:SeaIceConcentration06March2018_3338']
            })
            this.$refs.map.primaryMapObject.flyTo([65, -165], 1)
          }
        },
        tetherOptions: {
          attachment: 'top left',
          targetAttachment: 'left right',
          offset: '32px 0'
        }
      })

      tour.addStep({
        title: 'Actively participate in research',
        attachTo: '#top_item right',
        text: `<p>Observations/pictures, value is over time and by seasons to ID trends or patterns
Scientists can’t be there, and obs are expensive, communities can help.</p>`,
        classes: 'shepherd-theme-square-dark adjust-tour-panel',
        when: {
          show: () => {
            this.$store.commit('hideDualMaps')
            this.$store.commit('disableSyncMaps')
            this.$store.commit('showOnlyLayers', {
              first: ['observations']
            })
            this.$refs.map.primaryMapObject.flyTo([71.2906, -156.7886], 5)
          }
        },
        tetherOptions: {
          attachment: 'top left',
          targetAttachment: 'left right',
          offset: '32px 0'
        }
      })

      tour.addStep({
        title: 'Inform your activities',
        attachTo: '#top_item right',
        text: `<p>Here, you can see whaling trails set against the current ice extent with the Utqiagvik radar.</p>`,
        classes: 'shepherd-theme-square-dark adjust-tour-panel',
        when: {
          show: () => {
            this.$store.commit('hideDualMaps')
            this.$store.commit('disableSyncMaps')
            this.$store.commit('showOnlyLayers', {
              first: ['geoserver:NIC_SeaIce_5Dec2017_3338_AKExtent', 'geoserver:Barrow02April2016', 'geoserver:WhalingTrails2017_3338']
            })
            this.$refs.map.primaryMapObject.flyTo([71.2906, -156.7886], 6)
          }
        },
        tetherOptions: {
          attachment: 'top left',
          targetAttachment: 'left right',
          offset: '32px 0'
        }
      })

      return tour
    }
  },
  methods: {
    getPopupContents (feature) {
      let date = this.$moment(feature.obs_date).format('MMMM D, YYYY')
      let time = this.$moment(feature.obs_time).format('h:m a')
      feature.date = date + ' at ' + time
      return _.template(
        `
        <p><%= original_observation_text %></p>
        <p><%= date %></p>
        `
      )(feature)
    }
  }
}
</script>
<style lang='scss' scoped>
div /deep/ .leaflet-popup-content-wrapper {
  h1 {
    font-size: 14pt;
  }
  ul {
    margin: 1em 2em 1.5em;
    padding: 0;
    font-size: 10pt;
  }
}
div /deep/ .tour_marker, div /deep/ .place_marker {
  visibility: hidden;
}
// The `/deep/` syntax allows for modifying
// child component CSS.
// https://vue-loader.vuejs.org/en/features/scoped-css.html
.splash-screen /deep/ .billboard {
  max-width: 900px;
  min-height: 600px;
  background: url('~@/assets/barrow.jpg') #ff0000 top left / cover no-repeat;
  background-blend-mode: screen;
  h1 {
    color: #100505;
  }
  p {
    font-size: 14pt;
    color: #100505;
    a {
      color: #0020f0;
    }
    text-shadow: 0 0 4px #fff;
  }
  .buttons {
    margin-top: 4em;
  }
  .logos {
    padding-left: 1em;
    background: rgba(0, 0, 0, .5);
  }
}
</style>
<style lang='scss'>
// Not scoped so we can modify some Tour styles
.iam-tour.shepherd-step .shepherd-text h4 {
  color: #efefef;
}
</style>
