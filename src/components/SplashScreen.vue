<template>
<transition name="fade">
  <div v-show="showSplash" class="splash-screen">
    <div class="billboard">
      <div class="abstract" v-html="abstract"></div>
      <div v-show="loadingData" class="loading-data">
        <img src="../assets/safari-spinner.svg" />
        <p style="display: inline-block">
          Almost ready, still loading all the data for this map!
        </p>
      </div>
      <div v-show="!loadingData" class="buttons">
        <button class="default" @click.prevent="startTour()">
          <span v-show="!tourIsActive">Take a tour of this map&hellip;</span>
          <span v-show="tourIsActive">Continue tour&hellip;</span>
        </button>
        <button @click.prevent="closeSplashAndEndTour()" class="btn">
          Show map
        </button>
      </div>
      <div class="logos align-middle">
        <a href="http://snap.uaf.edu" target="_blank"><img src="../assets/snap_acronym_white.svg" class="snap"></a>
        <a href="http://web.iarc.uaf.edu" target="_blank"><img src="../assets/IARC_gray_square_reversed_acronym.svg" class="iarc"></a>
        <a href="http://uaf.edu" target="_blank"><img src="../assets/UAFLogo_A_nofill.svg" class="uaf"></a>
      </div>
    </div>
  </div>
</transition>
</template>
<script>
export default {
  name: 'SplashScreen',
  props: ['abstract'],
  computed: {
    showSplash () {
      return this.$store.state.showSplash
    },
    loadingData () {
      return this.$store.getters.loadingData
    },
    tourIsActive () {
      return this.$store.tourIsActive
    }
  },
  methods: {
    closeSplashAndEndTour () {
      this.$store.commit('hideSplash')
      this.$store.commit('endTour')
    },
    startTour () {
      this.$store.commit('startTour')
    }
  }
}
</script>
<style lang="scss" scoped>

.fade-enter-active, .fade-leave-active {
  transition: opacity .3s
}
.fade-enter, .fade-leave-to {
  opacity: 0
}

.splash-screen {
  position: absolute;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(33, 33, 33, 0.9);
  z-index:10000;

  .billboard {
    padding: 2rem;
    background-color: rgba(0, 0, 0, .8);
    color: rgba(0, 0, 0, 1);
    width: 80%;
    margin: 4rem auto;

    a {
      color: #86bffe;
    }

    @media screen and (max-height: 480px), screen and (max-width: 480px) {

      position: absolute;
      top: 0;
      left: 0;
      margin: 0;
      padding: 1em 0 60px 0;
      overflow-y: scroll !important;
      width: 100%;
      height: 110%;

      h1 {
        font-size: 16pt !important;
        width: auto !important;
      }
    }

    h2 {
      color: #fff;
      margin: 0 0 2rem 0;
      line-height: 120%;
      padding: 0;
    }

    .loading-data {
      margin: 1em;
      background-color: rgba(255, 255, 225, 0.9);
      display: inline-block;
      padding-right: 15px;

      p {
        position: relative;
        top: .4ex;
        left: -.5ex;
        padding: 2ex 0 0 0 !important;
        font-size: 18px;
      }

      img {
        display: inline-block;
        margin: 1em 1em .25em 1em;
        height: 3em;
      }
    }

    .buttons {
      button {
        margin-right: 1.5rem;
      }
      a {
        cursor: pointer;
        display: inline-block;
        margin-top: 2em;
        font-size: 10pt;
      }
    }

    .logos {
      margin-top: 1em;
      .snap {
        height: 3em;
      }
      .iarc {
        height: 4em;
      }
      .uaf {
        display: inline-block;
        position: relative;
        top: .5ex;
        height: 5em;
      }
      .snap, .iarc {
        margin-right: 2em;
      }
    }
  }
}
</style>
