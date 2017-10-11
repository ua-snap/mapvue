<template></template>
<script>
import _ from 'lodash'
export default {
  name: 'AK_Fires',
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
      return new this.$L.tileLayer.wms( // eslint-disable-line new-cap
        window.geoserverWmsUrl,
        _.extend(this.baseLayerOptions, {
          layers: 'alaska_osm'
        })
      )
    },
    placeLayer () {
      return new this.$L.tileLayer.wms( // eslint-disable-line new-cap
        window.geoserverWmsUrl,
        _.extend(this.baseLayerOptions, {
          zIndex: 100,
          layers: 'alaska_places_osm_3338'
        })
      )
    }
  },
  data () {
    return {
      abstract: `
<h1>It’s important to study wildland fire and its relationship to humans and the ecosystems we share. Use this map to see locations and sizes of wildfires in context of long-term fire history, land cover types, and more.</h1>
 <div class="abstractWrapper">
   <p>For the most current fire management information, visit:</p>
   <ul>
     <li><a href="https://fire.ak.blm.gov" target="_blank">Alaska Interagency Coordination Center (AICC)</a></li>
     <li><a href="http://fire.ak.blm.gov/content/aicc/sitreport/current.pdf" target="_blank">Current AICC Situation Report</a></li>
     <li><a href="https://akfireinfo.com/" target="_blank">Alaska Wildland Fire Information</a></li>
   </ul>
   <p>We thank the Alaska Fire Service, State of Alaska, and the Alaska Interagency Coordination Center for their hard work fighting fires and maintaining the data.</p>
 </div>`,
      mapOptions: {
        zoom: 1,
        minZoom: 0,
        maxZoom: 6,
        center: [65, -152.5]
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
          'abstract': 'This layer provides a generalized view of the physical cover on land at a spatial resolution of 250 meters.  Land cover classifications are used by scientists to determine what is growing on the landscape. These are made by looking at satellite imagery and categorizing the images into land cover types. \n\nThe dominant land cover varies across the landscape and influences how flammable a region is. When wildfires burn, they often alter the dominant land cover. Many fires have occurred since this layer was created in 2010.  _What landcover burns the most?_\n\nTo access and learn more about this dataset, visit the [Commission for Environmental Cooperation](http://www.cec.org/tools-and-resources/map-files/land-cover-2010).\n',
          'name': 'geonode:alaska_landcover_2010',
          'title': 'Land cover, 2010'
        },
        {
          'abstract': 'This layer shows historical fire perimeters from 1940-2016.  _More recent wildfires often stop fires from spreading due to the lack of fuel, but does this always hold true?_\n\nTo access and learn more about this dataset, visit the [AICC](https://fire.ak.blm.gov).\n',
          'name': 'geonode:fireareahistory',
          'title': 'Historical extent, 1940-2016'
        }
      ]
    }
  }
}
</script>
<style lang="scss" scoped>
.leaflet-popup-content {
  z-index: 1000;

  h1 {
    font-size: 16pt;
    color: #322323;
    margin: 1rem 0 .5rem;
  }

  h2 {
    font-size: 1rem;
    margin: .5rem 0;
  }

  h3 {
    font-size: .75rem;
    margin-bottom: 0;

    &.discovered {
      margin-top: 0;
      font-weight: 500;
    }
  }

  p.updated {
    margin-top: .25ex;
    font-weight: 300;
    color: #988989;
  }

  p.out {
    font-weight: 700;
    margin: 0;
  }
}

div.leaflet-marker-icon span {
  color: white;
  font-weight: bold;
  border-radius: 1em;
  margin: 1ex;
  padding: .5ex;

  &.active {
    background-color: rgba(200, 56, 20, .85);
    z-index: 10000;
  }

  &.inactive {
    background-color: rgba(100, 100, 100, .6);
    z-index: 500;
  }

  &.small {
    border-radius: 50%;
    width: 1em;
    height: 1em;
    display: inline-block;
    z-index: 300;
  }
}

.splash-screen .billboard {

  @media screen and (max-width: 930px) {
    padding: 0;
    margin: 0;

    h1 {
      width: 100%;
      font-size: 14pt;
      font-weight: 500;
    }
  }

  box-shadow: 0px 10px 40px 0px rgba(0,0,0,0.75);
  min-height: 550px;
  max-width: 930px;
  margin: 5em auto;
  padding: 1ex;
  background: url("~/assets/scott-fire-fade.jpg") white bottom left / cover no-repeat;
  h1 {
    width: 75%;
    font-size: 20pt;
    padding: 1ex;
    color: #000;
  }
  color: #222;
  a {
    color: #438bca;
  }
  p {
    padding: 1em;
  }
  ul {
    li {
    }
    margin-bottom: 1em;
  }
  .abstractWrapper {
    @media screen and (max-width: 768px) {
      width: 100%;
      border-radius: 0;
      margin: 0;
      font-size: 10pt;
      ul {
        margin-right: 1em;
      }
    }
    @media screen and (min-width: 769px) {
      max-width: 50%;
    }
    background: rgba(255, 255, 255, .8);
    border-radius: 1ex;
    margin: 1em;
  }
  .buttons {
    margin: 1em;
    padding-bottom: 1em;
    font-weight: 700;
  }
  .logos {
    margin: -1em 0 1em 1em;
  }
}

.graph-screen {
  position: fixed;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(150, 168, 48, 0.8);
  z-index: 3000;
  > div {
    padding: 2rem;
    background-color: rgba(255, 255, 255, .8);
    width: 80%;
    margin: 4rem auto;
    box-shadow: 0px 10px 40px 0px rgba(0,0,0,0.75);

    .graph-content {
      background-color: rgba(255, 255, 255, 1.0);
      padding: 1em 2em;
    }

    button {
      position: relative;
      top: -1.5em;
      right: -1.75em;
      font-size: 25pt;
    }
  }
}
</style>
