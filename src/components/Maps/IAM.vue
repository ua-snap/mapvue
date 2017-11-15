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
  <sidebar :mapObj="primaryMapObject"></sidebar>
  <mv-footer></mv-footer>
</div>
</template>
<script>
/* eslint new-cap: "off" */
import _ from 'lodash'
import MapInstance from '@/components/MapInstance'

export default {
  name: 'IAM',
  extends: MapInstance,
  data () {
    return {
      title: 'Integrated Arctic Management',
      abstract: `
<h1>What areas of the Arctic are &ldquo;important&rdquo;?</h1>
<p>One challenge that managers and policy makers often face is the conflict of interests among groups. This was evident when the <a target="_blank" href="https://www.snap.uaf.edu">Scenarios Network for Alaska and Arctic Planning</a> was asked to identify specific geographic &ldquo;areas of environmental, economic, and cultural importance&rdquo; in Arctic Alaska for a 2013 report to the President of the United states on <a target="_blank" href="https://www.afsc.noaa.gov/publications/misc_pdf/iamreport.pdf">Integrated Arctic Management</a> (IAM).
</p>
<p>While many groups have an answer to this question, the answer depends on the perspective and interests of the group. As a proof of concept, SNAP took an objective approach to identifying important areas by displaying existing geospatial datasets that fit into the environmental, economic, and cultural categories to see where they overlap. Based upon available data, this can illustrate the relative importance of those areas, identify potential areas of conflict, and highlight gaps in Arctic geospatial data.
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
          glyphicon: 'new-window',
          callback: this.openDatasetInformation
        }
      ],
      layers: [
        {
          'abstract': 'This layer shows cultural sites and buildings, as well as protected areas in the IAM area. Arctic Alaska has a long history of inhabitants, settlers, and traders since the earliest families crossed the Bering Land Bridge some 20,000 years ago. Cultural sites and structures are important artifacts. “Protected areas” are defined here as areas designated to preserve cultural and/or recreational features and activities.\n\n<a href="https://docs.google.com/document/u/1/d/1MayMZ6fIfz40tBLhftiisQVpHoGPJuFKxEtkMMcLi88/pub" target="_blank">More info and data access</a>',
          'name': 'geonode:cult_rec',
          'title': 'Cultural and protected areas'
        },
        {
          'abstract': 'This layer shows the communities and subsistence areas within the IAM area. People living in Arctic Alaska impact, and are being impacted by, the environmental, economic, and cultural features and changes in their area.\n\n<a href="https://docs.google.com/document/u/1/d/1MayMZ6fIfz40tBLhftiisQVpHoGPJuFKxEtkMMcLi88/pub" target="_blank">More info and data access</a>',
          'name': 'geonode:comm_subs',
          'title': 'Communities and subsistence areas'
        },
        {
          'abstract': 'This layer displays oil and natural gas wells, offshore leasing areas, and portions of the TransAlaska pipeline located in the IAM area. The oil industry plays an important economic role in the Arctic and has both positive and negative environmental and cultural impacts.\n\n<a href="https://docs.google.com/document/u/1/d/1MayMZ6fIfz40tBLhftiisQVpHoGPJuFKxEtkMMcLi88/pub" target="_blank">More info and data access</a>',
          'name': 'geonode:oil_infra',
          'title': 'Oil infrastructure'
        },
        {
          'abstract': 'The transportation layer shows locations of airports, marine ports, road system, shipping routes, and general transportation infrastructure in the IAM area. It highlights areas where there are multiple means of transportation for various cultural and economic reasons.\n\n<a href="https://docs.google.com/document/u/1/d/1MayMZ6fIfz40tBLhftiisQVpHoGPJuFKxEtkMMcLi88/pub" target="_blank">More info and data access</a>',
          'name': 'geonode:trans',
          'title': 'Transportation'
        },
        {
          'abstract': 'This layer shows the distribution of five fish species and the combined distribution of marine, estuarine, anadromous, and freshwater fish species in the IAM area. All of the fish species are a significant food source in Arctic marine food webs and in the lives of people in coastal communities.\n\n<a href="https://docs.google.com/document/u/1/d/1MayMZ6fIfz40tBLhftiisQVpHoGPJuFKxEtkMMcLi88/pub" target="_blank">More info and data access</a>',
          'name': 'geonode:fish',
          'title': 'Fish'
        },
        {
          'abstract': 'This layer shows locations of Important Bird Areas (IBAs) and murre colonies in the IAM area. IBAs are identified as vital habitats for birds and other wildlife using an internationally developed set of criteria. These areas are both critical to ecosystem biodiversity and sensitive to possible disturbances from increased use of Arctic areas. Murres, being one of the most numerous Arctic seabirds, play an important role in Arctic marine food webs and in the lives of people in nearby communities.\n\n<a href="https://docs.google.com/document/u/1/d/1MayMZ6fIfz40tBLhftiisQVpHoGPJuFKxEtkMMcLi88/pub" target="_blank">More info and data access</a>',
          'name': 'geonode:birds',
          'title': 'Birds'
        },
        {
          'abstract': 'This layer shows the distribution of ten mammal species including whales, seals, walrus, polar bear, and caribou. These species represent some of the most abundant in the Arctic and the IAM area. Besides being an important part of the Arctic ecosystem, they all have significant economic and cultural value to Alaska Native communities.\n\n<a href="https://docs.google.com/document/u/1/d/1MayMZ6fIfz40tBLhftiisQVpHoGPJuFKxEtkMMcLi88/pub" target="_blank">More info and data access</a>',
          'name': 'geonode:mammals',
          'title': 'Mammals'
        },
        {
          'abstract': 'This layer shows ecologically significant areas identified by two separate sources. These areas highlight the important habitats for sustaining a diversity of marine wildlife.\n\n<a href="https://docs.google.com/document/u/1/d/1MayMZ6fIfz40tBLhftiisQVpHoGPJuFKxEtkMMcLi88/pub" target="_blank">More info and data access</a>',
          'name': 'geonode:impareas',
          'title': 'Significant ecological areas'
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
          origin: [-4234288.146966308, -4234288.146966307]
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
          layers: ['arctic_osm_3572']
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
