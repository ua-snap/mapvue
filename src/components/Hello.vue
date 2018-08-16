<template>

<div class="container about">
  <a target="_blank" rel="noopener" href="https://www.snap.uaf.edu"><img class="snap" alt="SNAP Logo" src="../assets/snap_color_lato.svg"/></a>
  <h1>MapVentures</h1>
  <h2 class="subtitle">Interactive maps of Alaska + Arctic data</h2>
  <map-list></map-list>
  <p>
    Map development by <a href="https://www.snap.uaf.edu" target="_blank" rel="noopener">SNAP</a>.<br/>
    Source code for this project is available on <a target="_blank" rel="noopener" href="https://github.com/ua-snap/mapvue">GitHub</a>.<br/>
    Questions? <span>uaf-mapventure@alaska.edu</span>
  </p>
  <h4 class="tools"><a target="_blank" rel="noopener"  href="https://www.snap.uaf.edu/tools-and-data/all-analysis-tools">See all SNAP climate + weather analysis tools</a></h4>
  <div class="sponsors">
    <a href="https://web.iarc.uaf.edu" rel="noopener" target="_blank"><img alt="IARC Logo" src="../assets/IARC_color_square.png"/></a>
    <a href="http://www.uaf.edu" rel="noopener" target="_blank"><img alt="UAF Logo" src="../assets/UAFLogo_A_647.svg"/></a>
  </div>
  <p>The <a target="_blank" rel="noopener" href="http://uaf.edu/">University of Alaska Fairbanks</a> is an AA/EO employer and educational institution and prohibits illegal discrimination against any individual: Learn more about UA's <a href="https://www.alaska.edu/titleIXcompliance/nondiscrimination/">notice of nondiscrimination</a>.</p>

  <p>
    <a href="https://www.snap.uaf.edu/expertise/expertise" rel="noopener" target="_blank">
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

<style lang="scss" scoped>
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

h1 {
  font-weight: 900;
  font-size: 3.8rem;
  margin: 2rem 0 0 0;
  padding: 0;
}
h2 {
  font-size: 2rem;
  color: #999;
  margin: 0 0 2rem 0;
  padding: 0;
  font-weight: 700;
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
