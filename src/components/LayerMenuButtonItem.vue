<template>
<div class="layer-menu-button-item">
  <button class="button pseudo" :class="[classes]" :disabled="disabled"
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
  
  button {
    border: none;
    background: transparent;

    color: #0074d9;
    &[disabled="disabled"] {
      color: #b8b8b8;
      text-decoration: line-through;
      cursor: not-allowed;
      background: none;
    }
  }
}
</style>
