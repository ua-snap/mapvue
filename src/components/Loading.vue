<template>
<div>
  <div class="loading-overlay">
    <div class="loading-text-wrapper">
      <h1>Hang on, getting things ready...</h1>
    </div>
  </div>
</div>
</template>
<script>
export default {
  name: 'loading'
}
</script>
<style lang="scss" scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, .5);
  text-align: center;
  .loading-text-wrapper {
    position: relative;
    width: 50%;
    top: 25%;
    left: 25%;
  }
}
</style>
