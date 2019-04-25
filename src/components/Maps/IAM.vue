<template>
<div>
  <h1 class="map-title">{{ title }}</h1>
  <layer-menu
    :buttons="buttons"
  ></layer-menu>
  <splash-screen
    :abstract="abstract"></splash-screen>
  <mv-map
    ref="map"
    :baseLayerOptions="baseLayerOptions"
    :baseLayer="baseLayer"
    :placeLayer="placeLayer"
    :crs="crs"
    :mapOptions="mapOptions"
  ></mv-map>
  <sidebar :mapObj="map"></sidebar>
  <tour class="tour" :tour="tour"></tour>
  <mv-footer></mv-footer>
</div>
</template>
<script>
/* eslint new-cap: "off" */
import _ from 'lodash'
import MapInstance from '@/components/MapInstance'
import Tour from '../Tour'

// Will have references to DOM objects used in the tour
var tourMarker // eslint-disable-line no-unused-vars
var placeMarker // eslint-disable-line no-unused-vars
var extentMarker // eslint-disable-line no-unused-vars

export default {
  name: 'IAM',
  extends: MapInstance,
  components: {
    tour: Tour
  },
  mounted () {
    // Necessary to see the markers.
    this.$L.Icon.Default.imagePath = 'static/'

    // Add points of interest
    _.each(this.hotspots, (e) => {
      this.$L.marker(e.latlng).bindPopup(
        '<h1>' + e.name + '</h1>' +
        e.description, {
          maxWidth: 600
        }
      ).on('click', (e) => {
        this.$refs.map.map.setView([
          e.latlng.lat,
          e.latlng.lng
        ])
      }).addTo(this.$refs.map.map)
    })

    // Usually-invisible marker that will be
    // used as a target during the tour.
    tourMarker = this.$L.circleMarker(
      [
        66.43771036250584,
        -162.61488740208168
      ],
      {
        className: 'tour_marker'
      }
    ).addTo(this.$refs.map.map)

    placeMarker = this.$L.circleMarker(
      this.hotspots[0].latlng,
      {
        className: 'place_marker'
      }
    ).addTo(this.$refs.map.map)

    extentMarker = this.$L.circleMarker(
      [
        65,
        -175
      ],
      {
        className: 'extent_marker'
      }
    ).addTo(this.$refs.map.map)
  },
  data () {
    return {
      hotspots: [
        {
          'name': 'St. Lawrence Island area',
          'latlng': [63.726247, -170.498930],
          'description': '<p>In the St. Lawrence Island area 17 environmental, 4 economic and 3 cultural datasets overlap.</p>'
        },
        {
          'name': 'Point Hope area',
          'latlng': [68.299069, -166.739916],
          'description': '<p>In the Point Hope area, 17 environmental, 5 economic and 4 cultural datasets overlap.</p>'
        },
        {
          'name': 'Prudhoe Bay area',
          'latlng': [70.456491, -148.755187],
          'description': '<p>In the Prudhoe Bay area, 19 environmental, 8 economic and 5 cultural datasets overlap.</p>'
        }
      ],
      title: 'Integrated Arctic Management',
      abstract: `
<h1>What areas of the Arctic are &ldquo;important&rdquo;?</h1>
<p>The meaning of “important” depends on the perspective and interests of a group. This <a target="_blank" href="https://www.afsc.noaa.gov/publications/misc_pdf/iamreport.pdf" rel="noopener">Integrated Arctic Management (IAM)</a> map displays existing geospatial datasets that fit into various environmental, economic, and cultural categories to see where they overlap. This approach illustrates the relative importance of those areas, identifies potential areas of conflict, and highlights gaps in Arctic geospatial data.
</p>
<p class="photo-credit">UAF Photo by Todd Paris</p>
`,
      mapOptions: {
        zoom: 0,
        minZoom: 0,
        maxZoom: 5,
        center: [64, -165]
      },
      baseLayerOptions: {
        transparent: true,
        srs: 'EPSG:3572',
        format: 'image/png',
        version: '1.3',
        continuousWorld: true // needed for non-3857 projs
      },
      buttons: [
        {
          text: 'Dataset information',
          classes: 'iam-dataset-info',
          glyphicon: 'new-window',
          callback: this.openDatasetInformation
        }
      ],
      layers: [
        {
          'abstract': 'This layer shows cultural sites and buildings, as well as protected areas in the IAM area. Arctic Alaska has a long history of inhabitants, settlers, and traders since the earliest families crossed the Bering Land Bridge some 20,000 years ago. Cultural sites and structures are important artifacts. “Protected areas” are defined here as areas designated to preserve cultural and/or recreational features and activities.\n\n<a href="https://docs.google.com/document/u/1/d/1MayMZ6fIfz40tBLhftiisQVpHoGPJuFKxEtkMMcLi88/pub" target="_blank" rel="noopener">More info and data access</a>',
          'id': 'iam:cult_rec',
          'wmsLayerName': 'iam:cult_rec',
          'title': 'Cultural & protected areas',
          'legend': false
        },
        {
          'abstract': 'This layer shows the communities and subsistence areas within the IAM area. People living in Arctic Alaska impact, and are being impacted by, the environmental, economic, and cultural features and changes in their area.\n\n<a href="https://docs.google.com/document/u/1/d/1MayMZ6fIfz40tBLhftiisQVpHoGPJuFKxEtkMMcLi88/pub" target="_blank" rel="noopener">More info and data access</a>',
          'id': 'iam:comm_subs',
          'wmsLayerName': 'iam:comm_subs',
          'title': 'Communities & subsistence',
          'legend': false
        },
        {
          'abstract': 'This layer displays oil and natural gas wells, offshore leasing areas, and portions of the TransAlaska pipeline located in the IAM area. The oil industry plays an important economic role in the Arctic and has both positive and negative environmental and cultural impacts.\n\n<a href="https://docs.google.com/document/u/1/d/1MayMZ6fIfz40tBLhftiisQVpHoGPJuFKxEtkMMcLi88/pub" target="_blank" rel="noopener">More info and data access</a>',
          'id': 'iam:oil_infra',
          'wmsLayerName': 'iam:oil_infra',
          'title': 'Oil infrastructure',
          'legend': false
        },
        {
          'abstract': 'The transportation layer shows locations of airports, marine ports, road system, shipping routes, and general transportation infrastructure in the IAM area. It highlights areas where there are multiple means of transportation for various cultural and economic reasons.\n\n<a href="https://docs.google.com/document/u/1/d/1MayMZ6fIfz40tBLhftiisQVpHoGPJuFKxEtkMMcLi88/pub" target="_blank" rel="noopener">More info and data access</a>',
          'id': 'iam:trans',
          'wmsLayerName': 'iam:trans',
          'title': 'Transportation',
          'legend': false
        },
        {
          'abstract': 'This layer shows the distribution of five fish species and the combined distribution of marine, estuarine, anadromous, and freshwater fish species in the IAM area. All of the fish species are a significant food source in Arctic marine food webs and in the lives of people in coastal communities.\n\n<a href="https://docs.google.com/document/u/1/d/1MayMZ6fIfz40tBLhftiisQVpHoGPJuFKxEtkMMcLi88/pub" target="_blank" rel="noopener">More info and data access</a>',
          'wmsLayerName': 'iam:fish',
          'id': 'iam:fish',
          'title': 'Fish',
          'legend': false
        },
        {
          'abstract': 'This layer shows locations of Important Bird Areas (IBAs) and murre colonies in the IAM area. IBAs are identified as vital habitats for birds and other wildlife using an internationally developed set of criteria. These areas are both critical to ecosystem biodiversity and sensitive to possible disturbances from increased use of Arctic areas. Murres, being one of the most numerous Arctic seabirds, play an important role in Arctic marine food webs and in the lives of people in nearby communities.\n\n<a href="https://docs.google.com/document/u/1/d/1MayMZ6fIfz40tBLhftiisQVpHoGPJuFKxEtkMMcLi88/pub" target="_blank" rel="noopener">More info and data access</a>',
          'id': 'iam:birds',
          'wmsLayerName': 'iam:birds',
          'title': 'Birds',
          'legend': false
        },
        {
          'abstract': 'This layer shows the distribution of ten mammal species including whales, seals, walrus, polar bear, and caribou. These species represent some of the most abundant in the Arctic and the IAM area. Besides being an important part of the Arctic ecosystem, they all have significant economic and cultural value to Alaska Native communities.\n\n<a href="https://docs.google.com/document/u/1/d/1MayMZ6fIfz40tBLhftiisQVpHoGPJuFKxEtkMMcLi88/pub" target="_blank" rel="noopener">More info and data access</a>',
          'id': 'iam:mammals',
          'wmsLayerName': 'iam:mammals',
          'title': 'Mammals',
          'legend': false
        },
        {
          'abstract': 'This layer shows ecologically significant areas identified by two separate sources. These areas highlight the important habitats for sustaining a diversity of marine wildlife.\n\n<a href="https://docs.google.com/document/u/1/d/1MayMZ6fIfz40tBLhftiisQVpHoGPJuFKxEtkMMcLi88/pub" target="_blank" rel="noopener">More info and data access</a>',
          'id': 'iam:impareas',
          'wmsLayerName': 'iam:impareas',
          'title': 'Significant ecological areas',
          'legend': false
        }
      ]
    }
  },
  computed: {
    crs () {
      // We need to modify the default pan-Arctic
      // projection to avoid a bug.
      var proj = new this.$L.Proj.CRS('EPSG:3572',
        '+proj=laea +lat_0=90 +lon_0=-150 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
        {
          resolutions: [4096, 2048, 1024, 512, 256, 128, 64],
          origin: [-4889334.802954878, -4889334.802954878]
        }
      )

      // trust me.
      // Without this (= pi/2), proj4js returns an undefined
      // value for tiles requested at the North Pole and
      // it causes a runtime exception.
      proj.projection._proj.oProj.phi0 = 1.5708
      return proj
    },
    baseLayer () {
      return new this.$L.tileLayer.wms(
        process.env.GEOSERVER_WMS_URL,
        _.extend(this.baseLayerOptions, {
          layers: ['arctic_osm_3572', 'iam_area_alaska_albers']
        })
      )
    },
    placeLayer () {
      return new this.$L.tileLayer.wms(
        process.env.GEOSERVER_WMS_URL,
        _.extend(this.baseLayerOptions, {
          layers: ['arctic_places_osm_3572'],
          zIndex: 1000
        })
      )
    },
    secondBaseLayer () {
      return new this.$L.tileLayer.wms(
        process.env.GEOSERVER_WMS_URL,
        _.extend(this.baseLayerOptions, {
          layers: ['arctic_osm_3572']
        })
      )
    },
    secondPlaceLayer () {
      return new this.$L.tileLayer.wms(
        process.env.GEOSERVER_WMS_URL,
        _.extend(this.baseLayerOptions, {
          layers: ['arctic_places_osm_3572'],
          zIndex: 1000
        })
      )
    },
    tour () {
      let tour
      tour = new this.$shepherd.Tour({
        defaults: {
          classes: 'shepherd-theme-square-dark',
          showCancelLink: true
        }
      })
      let buttons = [
        {
          text: 'Back',
          action: tour.back
        },
        {
          text: 'Next',
          action: tour.next
        }
      ]
      tour.addStep({
        title: 'The IAM study area',
        text: `
        <p>The Bering Strait region, Chukchi Sea, and Beaufort Sea are experiencing diminishing seasonal sea ice and are thus vulnerable to significant changes. Use this tool to explore some of the environmental, economic, and cultural geospatial data available in this region. Areas with overlapping datasets highlight zones of overlapping—and potentially competing—interests or concerns.</p>`,
        attachTo: '.extent_marker left',
        classes: 'shepherd-theme-square-dark',
        when: {
          show: () => {
            this.$store.commit('hideDualMaps')
            this.$store.commit('disableSyncMaps')
            this.$store.commit('showOnlyLayers', {
              first: []
            })
            this.$ga.event({
              eventCategory: 'Tour Step: The IAM study area',
              eventAction: 'show',
              eventLabel: 'IAM Tour'
            })
          }
        },
        buttons: buttons
      })
      tour.addStep({
        title: 'What does this map show?',
        attachTo: '.layer-list right',
        text: `
        <p>Each layer contains multiple datasets grouped by:</p>
        <h4>Environmental</h4>
        <ul><li>Signficant ecological areas</li><li>Mammals</li><li>Birds</li><li>Fish</li></ul>
        <h4>Economic</h4>
        <ul><li>Transportation</li><li>Oil infrastructure</li></ul>
        <h4>Cultural</h4>
        <ul><li>Communities and subsistence areas</li><li>Cultural and protected areas</li></ul>`,
        classes: 'shepherd-theme-square-dark iam-tour',
        when: {
          show: () => {}
        },
        buttons: buttons
      })
      tour.addStep({
        title: 'Information about the datasets',
        attachTo: '.iam-dataset-info right',
        text: `Click this button to see a list of all included datasets. This provides a short description of the dataset and shows where to get more information.`,
        classes: 'shepherd-theme-square-dark',
        when: {
          show: () => {
            this.$ga.event({
              eventCategory: 'Tour Step: Information about the datasets',
              eventAction: 'show',
              eventLabel: 'IAM Tour'
            })
          }
        },
        buttons: buttons
      })
      tour.addStep({
        title: 'Overlapping areas',
        attachTo: '.tour_marker bottom',
        text: `Datasets are semi-transparent. The more datasets that overlap, the darker the area.`,
        classes: 'shepherd-theme-square-dark',
        when: {
          show: () => {
            this.$store.commit('showOnlyLayers', {
              first: ['iam:mammals']
            })
            this.$ga.event({
              eventCategory: 'Tour Step: Overlapping areas',
              eventAction: 'show',
              eventLabel: 'IAM Tour'
            })
          },
          hide: () => {
            this.$store.commit('showOnlyLayers', {first: []})
          }
        },
        buttons: buttons
      })
      tour.addStep({
        title: 'Hotspots',
        attachTo: '.place_marker right',
        text: `We identified &ldquo;hot spots&rdquo; as locations with the greatest number of overlapping environmental, economic, and cultural datasets. Three example hot spots are shown on the map. Selecting a marker lists the datasets at that location.`,
        classes: 'shepherd-theme-square-dark',
        when: {
          show: () => {
            this.$store.commit('showOnlyLayers', {
              first: ['iam:comm_subs', 'iam:trans', 'iam:birds']
            })
            this.map.setView([63.72769765422989, -170.51282701847276], 4)
            this.$ga.event({
              eventCategory: 'Tour Step: Hotspots',
              eventAction: 'show',
              eventLabel: 'IAM Tour'
            })
          },
          hide: () => {
            this.map.setView([64, -165], 0)
            this.$store.commit('showOnlyLayers', {first: []})
          }
        },
        buttons: buttons
      })
      tour.addStep({
        title: 'Thanks for checking out the IAM map!',
        text: `This map helps show the impacts that development can have on Alaska’s plants, animals, and ecosystems, and provides a common point of discussion for everyone concerned.  Please <a href="mailto:uaf-mapventure@alaska.edu">contact us</a> with any feedback.`,
        when: {
          show: () => {
            this.$ga.event({
              eventCategory: 'Tour Step: Finished the IAM tour!',
              eventAction: 'show',
              eventLabel: 'IAM Tour'
            })
          }
        },
        buttons: [
          {
            text: 'Back',
            action: tour.back
          },
          {
            text: 'Done',
            action: tour.complete
          }
        ]
      })
      return tour
    }
  },
  methods: {
    openDatasetInformation () {
      window.open('https://docs.google.com/document/u/1/d/1MayMZ6fIfz40tBLhftiisQVpHoGPJuFKxEtkMMcLi88/pub')
    }
  }
}
</script>
<style lang="scss" scoped>
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
div /deep/ .tour_marker, div /deep/ .place_marker, div /deep/ .extent_marker {
  visibility: hidden;
}
// The `/deep/` syntax allows for modifying
// child component CSS.
// https://vue-loader.vuejs.org/en/features/scoped-css.html
.splash-screen /deep/ .billboard {
  max-width: 933px;
  background: url("~@/assets/uaf-todd-paris-iam.jpg") white top left / cover no-repeat;
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
<style lang="scss">
// Not scoped so we can modify some Tour styles
.iam-tour.shepherd-step .shepherd-text {
  ul {
    margin-top: 0;
  }
  h4 {
    color: #efefef;
    margin: 0.6em 0 0;
    padding: 0;
  }
  li {
    margin: 0;
    padding: 0;
  }
}

</style>
