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

// Will have a reference to a DOM object used in the tour
var tourMarker // eslint-disable-line no-unused-vars

// Contains the GeoJSON layer defining the project area.
var iamPoly // eslint-disable-line no-unused-vars

export default {
  name: 'IAM',
  extends: MapInstance,
  mounted () {
    // Necessary to see the markers.
    this.$L.Icon.Default.imagePath = 'static'

    // Add points of interest
    _.each(this.hotspots, (e) => {
      this.$L.marker(e.latlng).bindPopup(
        '<h1>' + e.name + '</h1>' +
        e.description, {
          maxWidth: 600
        }
      ).on('click', (e) => {
        this.$refs.map.primaryMapObject.setView([
          e.latlng.lat,
          e.latlng.lng
        ])
        // $scope.activateAllLayers();
      }).addTo(this.$refs.map.primaryMapObject)
    })

    // Usually-invisible marker that will be
    // used as a target during the tour.
    tourMarker = this.$L.circleMarker(
      [
        66.43771036250584,
        -162.61488740208168
      ],
      {
        className: 'tourMarker',
        stroke: false,
        fillColor: '#DAEE88',
        fillOpacity: 1
      }
    ).addTo(this.$refs.map.primaryMapObject)

    // Fetch shapefile of study area as GeoJSON
    var requestUrl = process.env.GEOSERVER_WMS_URL + '/wfs?service=wfs&version=2.0.0&request=GetFeature&typeName=geonode:iam_area_alaska_albers&srsName=EPSG:3572&outputFormat=application/json'
    this.$axios.get(requestUrl).then(res => {
      var coordsToLatLng = (coords) => {
        var xy = {
          x: coords[0],
          y: coords[1]
        }
        return this.$refs.map.primaryMapObject.options.crs.projection.unproject(xy)
      }
      // This will added/removed during the tour.
      iamPoly = this.$L.geoJson(res.data, {
        coordsToLatLng: coordsToLatLng
      })
    },
    err => {
      console.info(err)
    })
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
          'name': 'cult_rec',
          'title': 'Cultural and protected areas',
          'legend': false
        },
        {
          'abstract': 'This layer shows the communities and subsistence areas within the IAM area. People living in Arctic Alaska impact, and are being impacted by, the environmental, economic, and cultural features and changes in their area.\n\n<a href="https://docs.google.com/document/u/1/d/1MayMZ6fIfz40tBLhftiisQVpHoGPJuFKxEtkMMcLi88/pub" target="_blank">More info and data access</a>',
          'name': 'comm_subs',
          'title': 'Communities and subsistence areas',
          'legend': false
        },
        {
          'abstract': 'This layer displays oil and natural gas wells, offshore leasing areas, and portions of the TransAlaska pipeline located in the IAM area. The oil industry plays an important economic role in the Arctic and has both positive and negative environmental and cultural impacts.\n\n<a href="https://docs.google.com/document/u/1/d/1MayMZ6fIfz40tBLhftiisQVpHoGPJuFKxEtkMMcLi88/pub" target="_blank">More info and data access</a>',
          'name': 'oil_infra',
          'title': 'Oil infrastructure',
          'legend': false
        },
        {
          'abstract': 'The transportation layer shows locations of airports, marine ports, road system, shipping routes, and general transportation infrastructure in the IAM area. It highlights areas where there are multiple means of transportation for various cultural and economic reasons.\n\n<a href="https://docs.google.com/document/u/1/d/1MayMZ6fIfz40tBLhftiisQVpHoGPJuFKxEtkMMcLi88/pub" target="_blank">More info and data access</a>',
          'name': 'trans',
          'title': 'Transportation',
          'legend': false
        },
        {
          'abstract': 'This layer shows the distribution of five fish species and the combined distribution of marine, estuarine, anadromous, and freshwater fish species in the IAM area. All of the fish species are a significant food source in Arctic marine food webs and in the lives of people in coastal communities.\n\n<a href="https://docs.google.com/document/u/1/d/1MayMZ6fIfz40tBLhftiisQVpHoGPJuFKxEtkMMcLi88/pub" target="_blank">More info and data access</a>',
          'name': 'fish',
          'title': 'Fish',
          'legend': false
        },
        {
          'abstract': 'This layer shows locations of Important Bird Areas (IBAs) and murre colonies in the IAM area. IBAs are identified as vital habitats for birds and other wildlife using an internationally developed set of criteria. These areas are both critical to ecosystem biodiversity and sensitive to possible disturbances from increased use of Arctic areas. Murres, being one of the most numerous Arctic seabirds, play an important role in Arctic marine food webs and in the lives of people in nearby communities.\n\n<a href="https://docs.google.com/document/u/1/d/1MayMZ6fIfz40tBLhftiisQVpHoGPJuFKxEtkMMcLi88/pub" target="_blank">More info and data access</a>',
          'name': 'birds',
          'title': 'Birds',
          'legend': false
        },
        {
          'abstract': 'This layer shows the distribution of ten mammal species including whales, seals, walrus, polar bear, and caribou. These species represent some of the most abundant in the Arctic and the IAM area. Besides being an important part of the Arctic ecosystem, they all have significant economic and cultural value to Alaska Native communities.\n\n<a href="https://docs.google.com/document/u/1/d/1MayMZ6fIfz40tBLhftiisQVpHoGPJuFKxEtkMMcLi88/pub" target="_blank">More info and data access</a>',
          'name': 'mammals',
          'title': 'Mammals',
          'legend': false
        },
        {
          'abstract': 'This layer shows ecologically significant areas identified by two separate sources. These areas highlight the important habitats for sustaining a diversity of marine wildlife.\n\n<a href="https://docs.google.com/document/u/1/d/1MayMZ6fIfz40tBLhftiisQVpHoGPJuFKxEtkMMcLi88/pub" target="_blank">More info and data access</a>',
          'name': 'impareas',
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
div /deep/ .tourMarker {
  display: none;
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
