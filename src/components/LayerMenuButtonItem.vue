<template>
<label :class="[classes, 'btn btn-primary']"
  @click="callback">
  <span :class="['glyphicon', 'glyphicon-' + glyphicon]"></span>
  &nbsp;
  {{ text }}
</label>
</template>

<script>
export default {
  name: 'LayerMenuButtonItem',
  props: [
    'glyphicon',
    'classes',
    'callback',
    'text'
  ]
}
</script>

<style lang="scss" scoped>
label {
  display: block;
  margin: 1ex 0;
  text-align: left;
  width: 16em;
}
</style>
