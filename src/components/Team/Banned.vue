<template>
  <table>
    <thead>
      <tr>
        <th colspan="2">Banned Heros</th>
      </tr>
    </thead>
    <tbody>
      <tr></tr>
        <tr v-for="id in $store.getters.bannedHeroIds">
            <td>{{ $store.state.heros[id].name }}</td>
        </tr>
    </tbody>
  </table>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component({})
export default class Banned extends Vue {}
</script>
<style scoped></style>
