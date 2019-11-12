<template>
  <img
          style="height: 175px; margin: 10px;"
    :src="'https://blzmedia-a.akamaihd.net/heroes/images/battlegrounds/maps/' + map.urlName + '/header-mobile.jpg'"
  />
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Hero } from '@/store/types'

@Component({})
export default class Map extends Vue {
  @Prop() map!: Hero
}
</script>
<style scoped></style>
