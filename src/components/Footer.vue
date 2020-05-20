<template>
<div>
  <div class="footer">
    <p>
      <router-link to="/">About this site &amp; other maps&hellip;</router-link>
      <span class="identity">
          Copyright &copy; {{ year }} University of Alaska Fairbanks. All rights reserved.
      </span>
    </p>
  </div>
</div>
</template>

<script>
export default {
  name: 'Footer',
  data () {
    return {
      year: 2020,
    }
  }
}
</script>

<style lang="scss" scoped>
.footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 2.8em;
  z-index: 500;
  color: #777;
  background-color: rgba(225, 225, 225, .8);
  padding: 1ex;
  border-top: 1px solid #e5e5e5;

  p {
    margin: 0 0 0 1ex;
  }

  & span.identity {
    float: right;
    display: inline-block;
    padding-right: 1em;
    font-size: 70%;
    margin-top: .4em;
  }

  @media (max-width: 768px) {
    font-size: 8pt;
    padding: .25ex;
  }
}
</style>
