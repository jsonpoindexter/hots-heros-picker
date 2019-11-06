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
        <td v-if="index <= 4|| redPlayers[index] && index > 4" style="background: red">{{ redPlayers[index] ? (redPlayers[index].name + ' - ' + $store.state.heros[redPlayers[index].selectedId].name) : 'empty' }}</td>
        <td v-else></td>
        <td v-if="index <= 4|| bluePlayers[index] && index > 4 " style="background: blue">{{ bluePlayers[index] ? (bluePlayers[index].name + ' - ' + $store.state.heros[bluePlayers[index].selectedId].name) : 'empty'}}</td>
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
  get players() {
    return [this.$store.state.user, ...this.$store.state.players]
  }
  get redPlayers() {
    return this.players.filter((player: Player) => {
      return player.team === Team.red
    })
  }
  get bluePlayers() {
    return this.players.filter((player: Player) => {
      return player.team === Team.blue
    })
  }
}
</script>
<style scoped>
table {
  width: 500px;
  pointer-events: none;
}
td {
  font-size: 26px;
  width: 50%;
}
</style>
