<template>
  <div class="layer--selector">

    <select v-model="month" @change="notifyParent">
      <option value="5">May</option>
      <option value="6">June</option>
      <option value="7">July</option>
      <option value="8">August</option>
    </select>

  </div>
</template>

<script>
export default {
  name: 'MonthSelector',
  props: {
    defaults: {
      default () {
        return {
          month: 5
        }
      }
    }
  },
  data () {
    return {
      month: this.month
    }
  },
  mounted () {
    this.month = this.defaults.month
  },
  methods: {
    notifyParent () {
      this.$emit('change',
        {
          month: this.month
        }
      )
    }
  }
}
</script>

<style lang="scss">

</style>
