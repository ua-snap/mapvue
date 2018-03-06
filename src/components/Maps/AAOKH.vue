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
    observationLayer = this.$L.layerGroup(observations)
  },
  mounted () {
    // Necessary to see the markers.
    this.$L.Icon.Default.imagePath = 'static'
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
<h1>What areas of the Arctic are &ldquo;important&rdquo;?</h1>
<p>One challenge that managers and policy makers often face is the conflict of interests among groups. This was evident when the <a target='_blank' href='https://www.snap.uaf.edu'>Scenarios Network for Alaska and Arctic Planning</a> was asked to identify specific geographic &ldquo;areas of environmental, economic, and cultural importance&rdquo; in Arctic Alaska for a 2013 report to the President of the United states on <a target='_blank' href='https://www.afsc.noaa.gov/publications/misc_pdf/iamreport.pdf'>Integrated Arctic Management</a> (IAM).
</p>
<p>While many groups have an answer to this question, the answer depends on the perspective and interests of the group. As a proof of concept, SNAP took an objective approach to identifying important areas by displaying existing geospatial datasets that fit into the environmental, economic, and cultural categories to see where they overlap. Based upon available data, this can illustrate the relative importance of those areas, identify potential areas of conflict, and highlight gaps in Arctic geospatial data.
</p>
<p class='photo-credit'>UAF Photo by Todd Paris</p>
`,
      mapOptions: {
        zoom: 5,
        minZoom: 4,
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
          'abstract': 'Obs from SIZONET',
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
  max-width: 933px;
  background: url('~@/assets/uaf-todd-paris-iam.jpg') white top left / cover no-repeat;
  h1 {
    color: #ffffee;
    padding-top: 2em; // A little extra to position correctly on photo
  }
  p {
    font-size: 14pt;
    color: #ffffee;
    a {
      color: #bdcdfa;
    }
    &.photo-credit {
      font-size: 10pt;
      color: #cfcfc0;
    }
  }
}
</style>
<style lang='scss'>
// Not scoped so we can modify some Tour styles
.iam-tour.shepherd-step .shepherd-text h4 {
  color: #efefef;
}
</style>
