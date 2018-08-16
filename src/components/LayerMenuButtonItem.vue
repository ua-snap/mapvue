<template>
<div class="layer-menu-button-item">
  <button class="pseudo" :class="[classes]" :disabled="disabled"
    @click="callback">
    {{ text }}
  </button>
</div>
</template>

<script>
export default {
  name: 'LayerMenuButtonItem',
  props: [
    'classes',
    'callback',
    'text',
    'disabled'
  ]
}
</script>

<style lang="scss" scoped>
.layer-menu-button-item {
  margin: 0 0 -1.2ex 0;
  button {
    cursor: pointer;
    cursor: hand;
    display: inline-block;
    text-align: left;

    &.pseudo {
      color: #0074d9;
      &[disabled="disabled"] {
        color: #b8b8b8;
        text-decoration: line-through;
        cursor: not-allowed;
        background: none;
      }
    }
  }
}
</style>
