<template>
<div class="graph-screen" v-show="visible">
  <div>
    <div class="graph-content">
      <button @click="hideGraph()">&times;</button>
      <div ref="plotly"></div>
      <p>This graph compares the current year to all of the years when more than 1 million acres burned since daily tally records began in 2004.<br/>Source: <a target="_blank" rel="noopener" href="https://fire.ak.blm.gov/">Alaska Interagency Coordination Center (AICC)</a>.</p>
    </div>
  </div>
</div>

</template>
<script>
import moment from 'moment'
import Plotly from 'plotly.js/lib/index-basic' // eslint-disable-line

var lineColors = {
  2004: '#7fc97f',
  2005: '#beaed4',
  2009: '#fdc086',
  2010: '#aaaa55',
  2013: '#386cb0',
  2015: '#f0027f',
  2018: '#333344'
}

// We declare the static properties of the graph outside the Vue
// object because they don't need to be reactive
var graphLayout = {
  title: 'Cumulative Acres Burned, April 1 - Sept 30',
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
      'April 1',
      'May 1',
      'June 1',
      'July 1',
      'August 1',
      'September 1'
    ],
    ticktext: [
      'April',
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
      // Resize must be run on a displayed div according to an error
      // trying to resize the graph when it is not displayed.
      if (this.$store.state.fire.fireGraphVisible) {
        this.resizeGraph()
      }
      // Guard in case data is unavailable to prevent error
      return this.$store.state.fire
        ? this.$store.state.fire.fireGraphVisible
        : false
    }
  },
  mounted () {
    // Attach global listener
    window.addEventListener('resize', this.resizeGraph)

    var processGraphData = (data) => {
      let timeSeries = data
      for (let year in timeSeries) {
        if (timeSeries.hasOwnProperty(year)) {
          var yearData = {
            name: year,
            x: timeSeries[year].dates,
            y: timeSeries[year].acres,
            line: {
              color: lineColors[year]
            }
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
      this.resizeGraph()
    },
    resizeGraph () {
      Plotly.Plots.resize(this.$refs.plotly)
      this.$ga.event({
        eventCategory: 'Show large fire season graph',
        eventAction: 'show',
        eventLabel: 'Fire Graph'
      })
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resizeGraph)
    Plotly.Plots.purge(this.$refs.plotly)
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
    padding: 1rem;
    background-color: rgba(255, 255, 255, .8);
    width: 80%;
    margin: 2rem auto;
    box-shadow: 0px 10px 40px 0px rgba(0,0,0,0.75);

    .graph-content {
      background-color: rgba(255, 255, 255, 1.0);
      padding: 1em 2em;
    }

    button {
      font-size: 120%;
    }
  }
}
</style>
