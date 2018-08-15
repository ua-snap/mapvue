<template>
<div class="layer-menu-button-item">
  <a class="button pseudo" :class="[classes]"
    @click="callback">
    {{ text }}
  </a>
</div>
</template>

<script>
export default {
  name: 'LayerMenuButtonItem',
  props: [
    'classes',
    'callback',
    'text'
  ]
}
</script>

<style lang="scss" scoped>
.layer-menu-button-item {
  margin: 0 0 -1em 0;
  a {
    cursor: pointer;
    cursor: hand;
    display: inline-block;
    margin: 1ex 0;
    text-align: left;

    &.button.pseudo {
      color: #0074d9;
    }
  }
}
</style>
