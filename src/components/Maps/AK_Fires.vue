<template></template>
<script>
export default {
  name: 'AK_Fires',
  data () {
    return {
      layers: [
        {
          'abstract': 'This layer provides a generalized view of the physical cover on land at a spatial resolution of 250 meters.  Land cover classifications are used by scientists to determine what is growing on the landscape. These are made by looking at satellite imagery and categorizing the images into land cover types. \n\nThe dominant land cover varies across the landscape and influences how flammable a region is. When wildfires burn, they often alter the dominant land cover. Many fires have occurred since this layer was created in 2010.  _What landcover burns the most?_\n\nTo access and learn more about this dataset, visit the [Commission for Environmental Cooperation](http://www.cec.org/tools-and-resources/map-files/land-cover-2010).\n',
          'name': 'geonode:alaska_landcover_2010',
          'title': 'Land cover, 2010'
        },
        {
          'abstract': 'This layer shows historical fire perimeters from 1940-2016.  _More recent wildfires often stop fires from spreading due to the lack of fuel, but does this always hold true?_\n\nTo access and learn more about this dataset, visit the [AICC](https://fire.ak.blm.gov).\n',
          'name': 'geonode:fireareahistory',
          'title': 'Historical extent, 1940-2016'
        }
      ]
    }
  }
}
</script>
<style lang="scss" scoped></style>
