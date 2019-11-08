<template>
  <table>
    <thead>
      <tr>
        <th colspan="2">Players</th>
      </tr>
    </thead>
    <tbody>
      <tr></tr>
      <tr v-for="(_, index) in 10" style="color: white;">
        <!-- Allow for 10 players to be on a team, but only show empty up to 5  -->
        <td v-if="index <= 4 || ($store.getters.redPlayers[index] && index > 4)" style="background: red">
          {{ $store.getters.redPlayers[index] ? displayName($store.getters.redPlayers[index]) : 'empty' }}
        </td>
        <td v-else></td>
        <td v-if="index <= 4 || ($store.getters.bluePlayers[index] && index > 4)" style="background: blue">
          {{ $store.getters.bluePlayers[index] ? displayName($store.getters.bluePlayers[index]) : 'empty' }}
        </td>
        <td v-else></td>
      </tr>
    </tbody>
  </table>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Player, Team } from '@/store/types'

@Component({})
export default class Players extends Vue {
  private displayName(player: Player) {
    return player.name + (player.selectedId !== null ? ' - ' + this.$store.state.heros[player.selectedId].name : '')
  }
}
</script>
<style scoped>
table {
  min-width: 700px;
  user-select: none;
}
td {
  pointer-events: none;
  padding: 3px 8px;
  text-align: left;
  font-size: 26px;
  width: 50%;
}
</style>
