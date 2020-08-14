<template>
<footer class="footer">
  <div class="container">
    <div class="wrapper is-size-6">
        <img src="../assets/UAF.svg"/>
        <div class="wrapped">
          
            <p>This tool was developed by the <a href="http://www.aoos.org/">Alaska Ocean Observing System</a> (AOOS), the <a href="https://uaf-accap.org">Alaska Center for Climate Assessment and Policy</a> (ACCAP), and the <a href="https://www.snap.uaf.edu/" title="👍">Scenarios Network for Alaska and Arctic Planning</a> (SNAP).</p>

            <p>Funded by the National Ocean Service at the <a href="http://www.noaa.gov">National Oceanic and Atmospheric Administration</a> (NOAA) through AOOS grant #NA11NOS0120020. Work was performed at the <a href="https://uaf-iarc.org/">International Arctic Research Center</a> (IARC), at the <a href="https://uaf.edu/uaf/">University of Alaska Fairbanks</a>, with assistance from the University of Illinois, Urbana-Champaign.</p>

            <p>Copyright &copy; {{ year }} University of Alaska Fairbanks.  All rights reserved.</p>
            <p>UA is an AA/EO employer and educational institution and prohibits illegal discrimination against any individual.  <a href="https://www.alaska.edu/nondiscrimination/">Statement of Nondiscrimination</a></p>
        </div>
    </div>
  </div>
</footer>
</template>

<script>
export default {
  name: 'Footer',
  data () {
    return {
      year: new Date().getFullYear(),
    }
  }
}
</script>

<style lang="scss" scoped>
.footer {
    box-shadow: inset 0 7px 9px -7px rgba(0,0,0,0.4);
    font-family: "Open Sans";
}

.footer div.wrapper {
        margin: 2rem auto;
        display: flex;
        height: 8rem;
        max-height: 8rem;
}


.footer img {
        min-width: 12.5vw;
        max-width: 150px;
        padding: 0 1rem;
        display: block;
        position: relative;
        top: .25rem;
        object-fit: contain;
    align-self: flex-start;
}

.footer p {
        text-align: left;
        font-size: 0.95rem;
        margin: 0 1rem 1rem;
}

.footer div.wrapped {
        flex: 1 1 auto;
}
</style>
