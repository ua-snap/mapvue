<template>
<div class="layer-list">
  <div v-for="layer in layers" class="layer" data-toggle="buttons">
    <!-- Buttons for first map -->
    <!-- We need @click.prevent because of this: https://github.com/vuejs/vue/issues/3699 -->
    <label
      class="btn btn-success visibility"
      v-if="layer.visible"
      @click.prevent="toggleLayer(layer.name)"
    >
      <span class="glyphicon glyphicon-check" ></span>
      <input type="checkbox" autocomplete="off">
    </label>
    <label
      class="btn btn-primary visibility"
      v-if="!layer.visible"
      @click.prevent="toggleLayer(layer.name)"
    >
      <span class="glyphicon glyphicon-unchecked"></span>
      <input type="checkbox" autocomplete="off">
    </label>
    <!-- Buttons for second map -->
    <label
      class="btn btn-success visibility"
      v-if="dualMaps && layer.secondvisible"
      @click.prevent="toggleLayer(layer.name, 'second')"
    >
      <span class="glyphicon glyphicon-check"></span>
      <input type="checkbox" autocomplete="off">
    </label>
    <label
      class="btn btn-primary visibility"
      v-if="dualMaps && layer.secondvisible"
      @click.prevent="toggleLayer(layer.name, 'second')"
    >
      <span class="glyphicon glyphicon-unchecked"></span>
      <input type="checkbox" autocomplete="off">
    </label>
    <!-- Information about layer button -->
    <label
      class="btn btn-primary info"
      v-on:click="showLayerInformation(layer.name)"
    >
      <span class="glyphicon glyphicon-info-sign"></span>
    </label>
    {{ layer.title }}
  </div>
</div>
</template>

<script>
export default {
  name: 'LayerList',
  created () {
    console.log(this.layers)
  },
  computed: {
    dualMaps () {
      return this.$store.state.dualMaps
    },
    layers () {
      return this.$store.state.layers
    }
  },
  methods: {
    toggleLayer: function (layer, animal) {
      this.$store.commit('toggleLayerVisibility', {
        layer: layer
      })
      console.log(layer, animal)
      // this.$emit('toggleLayer', event)
    }
  }
}
</script>

<style lang="scss" scoped">
  .layer {
    margin: 5px 0;
    cursor: pointer;
    cursor: hand;
    .btn {
      margin: 0 5px 0 0;
    }
  }
</style>
