<template>
  <div class="layer--date-scenario-selector">

    <select v-model="decade" @change="notifyParent">
      <option value="2010">2010s</option>
      <option value="2020">2020s</option>
      <option value="2030">2030s</option>
      <option value="2040">2040s</option>
      <option value="2050">2050s</option>
      <option value="2060">2060s</option>
      <option value="2070">2070s</option>
      <option value="2080">2080s</option>
      <option value="2090">2090s</option>
    </select>

    <select v-model="scenario" @change="notifyParent">
      <option value="rcp45">RCP4.5</option>
      <option value="rcp60">RCP6.0</option>
      <option value="rcp85">RCP8.5</option>
    </select>

  </div>
</template>

<script>
export default {
  name: 'DateScenarioSelector',
  props: {
    defaults: {
      default () {
        return {
          decade: 2010,
          scenario: 'rcp60'
        }
      }
    }
  },
  data () {
    return {
      decade: this.decade,
      scenario: this.scenario
    }
  },
  mounted () {
    this.decade = this.defaults.decade
    this.scenario = this.defaults.scenario
  },
  methods: {
    notifyParent () {
      this.$emit('change',
        {
          decade: this.decade,
          scenario: this.scenario
        }
      )
    }
  }
}
</script>

<style lang="scss">

.layer--date-scenario-selector {
  text-align: right;
  select {
    width: 7em;
    font-size: 80%;
  }
}
</style>
