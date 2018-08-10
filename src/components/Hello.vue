<template>

<div class="container about">
  <a target="_blank" href="https://www.snap.uaf.edu"><img class="snap" alt="SNAP Logo" src="../assets/snap_color_lato.svg" /></a>
  <h1>MapVentures</h1>
  <h2 class="subtitle">Interactive maps of Alaska + Arctic data</h2>
  <h3 class="featuring">&mdash; featuring &mdash;</h3>
  <map-list></map-list>
  <p>
    Map development by <a href="https://www.snap.uaf.edu" target="_blank">SNAP</a>.<br/>
    Source code for this project is available on <a target="_blank" href="https://github.com/ua-snap/mapventure">GitHub</a>.<br/>
    Questions? <span>uaf-mapventure@alaska.edu</span>
  </p>
  <h4 class="tools"><a target="_blank" href="https://www.snap.uaf.edu/tools-and-data/all-analysis-tools">See all SNAP climate + weather analysis tools</a></h4>
  <div class="sponsors">
    <a href="https://web.iarc.uaf.edu" target="_blank"><img alt="IARC Logo" src="../assets/IARC_color_square.png"/></a>
    <a href="http://www.uaf.edu" target="_blank"><img alt="UAF Logo" src="../assets/UAFLogo_A_647.svg"/></a>
  </div>
  <p>The <a href="http://uaf.edu/">University of Alaska Fairbanks</a> is an AA/EO employer and educational institution and prohibits illegal discrimination against any individual: Learn more about UA's <a href="https://www.alaska.edu/titleIXcompliance/nondiscrimination/">notice of nondiscrimination</a>.</p>

  <p>
    <a href="https://www.snap.uaf.edu/expertise/expertise" target="_blank">
      Copyright &copy; {{ year }} SNAP / IARC / UAF
    </a>
  </p>
</div>

</template>

<script>
import MapList from './MapList'

export default {
  name: 'hello',
  components: {
    'map-list': MapList
  },
  computed: {
    year () {
      return new Date().getFullYear()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
// @import url(https://fonts.googleapis.com/css?family=Great+Vibes:400);

* {
  text-align: center;
}
h1 {
  margin-top: 1em;
}
p {
  margin-top: 2em;
}
.sponsors {
  img {
    width: 5em;
    margin: 0 1em;
  }
}
img.snap {
  display: inline-block;
  margin-top: 2em;
  width: 20em;
}
h2 {
  font-size: 20pt;
  &.subtitle {
    margin-top: .5ex;
  }
}
h3.featuring {
  margin: 1em 0 .5ex;
  font-family: "Great Vibes";
  font-size: 36px;
  font-weight: 400;
}
h4 {
  margin: 2em 0;
}
.mapList {
  padding: 0;
  margin: 0;
  list-style: none;
  & li {
    cursor: pointer;
    font-size: 18pt;
    padding: 0;
    margin: 0 0 .75ex 0;
    line-height: .92;
  }
}
</style>
