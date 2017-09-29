<template></template>
<script>
export default {
  name: 'IAM',
  data () {
    return {
      layers: [
        {
          'abstract': 'This layer shows cultural sites and buildings, as well as protected areas in the IAM area. Arctic Alaska has a long history of inhabitants, settlers, and traders since the earliest families crossed the Bering Land Bridge some 20,000 years ago. Cultural sites and structures are important artifacts. “Protected areas” are defined here as areas designated to preserve cultural and/or recreational features and activities.\n\n<a href="https://docs.google.com/document/u/1/d/1MayMZ6fIfz40tBLhftiisQVpHoGPJuFKxEtkMMcLi88/pub" target="_blank">More info and data access</a>',
          'name': 'geonode:cult_rec',
          'title': 'Cultural and protected areas'
        },
        {
          'abstract': 'This layer shows the communities and subsistence areas within the IAM area. People living in Arctic Alaska impact, and are being impacted by, the environmental, economic, and cultural features and changes in their area.\n\n<a href="https://docs.google.com/document/u/1/d/1MayMZ6fIfz40tBLhftiisQVpHoGPJuFKxEtkMMcLi88/pub" target="_blank">More info and data access</a>',
          'name': 'geonode:comm_subs',
          'title': 'Communities and subsistence areas'
        },
        {
          'abstract': 'This layer displays oil and natural gas wells, offshore leasing areas, and portions of the TransAlaska pipeline located in the IAM area. The oil industry plays an important economic role in the Arctic and has both positive and negative environmental and cultural impacts.\n\n<a href="https://docs.google.com/document/u/1/d/1MayMZ6fIfz40tBLhftiisQVpHoGPJuFKxEtkMMcLi88/pub" target="_blank">More info and data access</a>',
          'name': 'geonode:oil_infra',
          'title': 'Oil infrastructure'
        },
        {
          'abstract': 'The transportation layer shows locations of airports, marine ports, road system, shipping routes, and general transportation infrastructure in the IAM area. It highlights areas where there are multiple means of transportation for various cultural and economic reasons.\n\n<a href="https://docs.google.com/document/u/1/d/1MayMZ6fIfz40tBLhftiisQVpHoGPJuFKxEtkMMcLi88/pub" target="_blank">More info and data access</a>',
          'name': 'geonode:trans',
          'title': 'Transportation'
        },
        {
          'abstract': 'This layer shows the distribution of five fish species and the combined distribution of marine, estuarine, anadromous, and freshwater fish species in the IAM area. All of the fish species are a significant food source in Arctic marine food webs and in the lives of people in coastal communities.\n\n<a href="https://docs.google.com/document/u/1/d/1MayMZ6fIfz40tBLhftiisQVpHoGPJuFKxEtkMMcLi88/pub" target="_blank">More info and data access</a>',
          'name': 'geonode:fish',
          'title': 'Fish'
        },
        {
          'abstract': 'This layer shows locations of Important Bird Areas (IBAs) and murre colonies in the IAM area. IBAs are identified as vital habitats for birds and other wildlife using an internationally developed set of criteria. These areas are both critical to ecosystem biodiversity and sensitive to possible disturbances from increased use of Arctic areas. Murres, being one of the most numerous Arctic seabirds, play an important role in Arctic marine food webs and in the lives of people in nearby communities.\n\n<a href="https://docs.google.com/document/u/1/d/1MayMZ6fIfz40tBLhftiisQVpHoGPJuFKxEtkMMcLi88/pub" target="_blank">More info and data access</a>',
          'name': 'geonode:birds',
          'title': 'Birds'
        },
        {
          'abstract': 'This layer shows the distribution of ten mammal species including whales, seals, walrus, polar bear, and caribou. These species represent some of the most abundant in the Arctic and the IAM area. Besides being an important part of the Arctic ecosystem, they all have significant economic and cultural value to Alaska Native communities.\n\n<a href="https://docs.google.com/document/u/1/d/1MayMZ6fIfz40tBLhftiisQVpHoGPJuFKxEtkMMcLi88/pub" target="_blank">More info and data access</a>',
          'name': 'geonode:mammals',
          'title': 'Mammals'
        },
        {
          'abstract': 'This layer shows ecologically significant areas identified by two separate sources. These areas highlight the important habitats for sustaining a diversity of marine wildlife.\n\n<a href="https://docs.google.com/document/u/1/d/1MayMZ6fIfz40tBLhftiisQVpHoGPJuFKxEtkMMcLi88/pub" target="_blank">More info and data access</a>',
          'name': 'geonode:impareas',
          'title': 'Significant ecological areas'
        }
      ]
    }
  }
}
</script>
<style lang="scss" scoped></style>
