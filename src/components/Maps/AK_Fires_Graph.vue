<template>
<div class="graph-screen" v-show="visible">
  <div>
    <div class="graph-content">
      <button type="button" @click="hideGraph()" class="close" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
      <div ref="plotly"></div>
      <p>This graph compares 2017 to all of the years when more than 1 million acres burned since daily tally records began in 2004. <br/>Source: <a target="_blank" href="https://fire.ak.blm.gov/">Alaska Interagency Coordination Center (AICC)</a>.</p>
    </div>
  </div>
</div>

</template>
<script>
import moment from 'moment'

// This is imported a little oddly to bypass a bug, see:
// https://www.reddit.com/r/vuejs/comments/6psu78/a_simple_vuejs_example_with_plolyjs/
import Plotly from 'plotly.js/dist/plotly' // eslint-disable-line

// We declare the static properties of the graph outside the Vue
// object because they don't need to be reactive
var graphLayout = {
  title: 'Cumulative Acres Burned',
  titlefont: {
    size: 20
  },
  font: {
    family: 'Lato'
  },
  margin: {
    l: 120,
    r: 120
  },
  xaxis: {
    type: 'category',
    ticks: 'array',
    tickvals: [
      'May 1',
      'June 1',
      'July 1',
      'August 1',
      'September 1'
    ],
    ticktext: [
      'May',
      'June',
      'July',
      'August',
      'September'
    ]
  },
  yaxis: {
    title: 'Cumulative Acres Burned',
    titlefont: {
      size: 18
    }
  }
}

var graphOptions = {
  showLink: false,
  displayLogo: false,
  modeBarButtonsToRemove: [
    'sendDataToCloud',
    'select2d',
    'lasso2d',
    'resetScale2d'
  ]
}

// Local "private" variable to keep the
// main data non-responsive (outside of scope
// of Vue component)
var graphData = []

export default {
  name: 'AK_Fires_Graph',
  computed: {
    visible () {
      return this.$store.state.fire.fireGraphVisible
    },
    fireTimeSeries: {
      get () { return this.$localStorage.get('fireTimeSeries') },
      set (value) { return this.$localStorage.set('fireTimeSeries', value) }
    }
  },
  mounted () {
    // Attach global listener
    window.onresize = () => {
      Plotly.Plots.resize(this.$refs.plotly)
    }

    var processGraphData = (data) => {
      let timeSeries = data
      for (let year in timeSeries) {
        if (timeSeries.hasOwnProperty(year)) {
          var yearData = {
            name: year,
            x: timeSeries[year].dates,
            y: timeSeries[year].acres
          }

          if (year === moment().format('YYYY')) {
            yearData.mode = 'lines+markers'
          } else {
            yearData.mode = 'lines'
          }
          graphData.push(yearData)
        }
      }
    }

    if (!this.fireTimeSeries) {
      this.$axios.get(process.env.FIRE_TIME_SERIES_URL)
        .then(
          res => {
            this.fireTimeSeries = res.data
            processGraphData(this.fireTimeSeries)
            this.drawGraph()
          },
        err => {
          console.error(err)
        }
      )
    } else {
      processGraphData(this.fireTimeSeries)
      this.drawGraph()
    }
  },
  methods: {
    hideGraph () {
      this.$store.commit('hideFireGraph')
    },
    drawGraph () {
      Plotly.plot(
        this.$refs.plotly,
        graphData,
        graphLayout,
        graphOptions
      )
      Plotly.Plots.resize(this.$refs.plotly)
    }
  }
}
</script>

<style lang="scss" scoped>
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
