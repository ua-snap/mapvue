<template>
<a :class="[classes]"
  @click="callback">
  {{ text }}
</a>
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
a {
  cursor: pointer;
  cursor: hand;
  display: block;
  margin: 1ex 0;
  text-align: left;
  width: 16em;
}
</style>
