<template>
<div>
  <div class="footer">
    <p>
      <router-link to="/">About this site &amp; other maps&hellip;</router-link>
      <span class="identity">
        <span class="version">
          V<span class="number">{{ version }}</span>
        </span>
        <a href="https://www.snap.uaf.edu/expertise/expertise" rel="noopener" target="_blank">
          Copyright &copy; {{ year }} SNAP / IARC / UAF
        </a>
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
      year: 2018,
      version: '2.0'
    }
  }
}
</script>

<style lang="scss" scoped>
#page-footer {

}

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

  & span.version span.number {
    display: inline-block;
    padding-right: 1em;
    color: #333;
  }

  & span.identity {
    float: right;
    display: inline-block;
    padding-right: 1em;
  }

  @media (max-width: 768px) {
    font-size: 8pt;
    padding: .25ex;
  }
}
</style>
