<template>
  <table>
    <thead>
      <tr>
        <th colspan="2">Players</th>
      </tr>
    </thead>
    <tbody>
      <tr></tr>
      <tr v-for="i in 5" style="color: white;">
        <td style="background: red">{{ redPlayers[i - 1] ? redPlayers[i - 1].name : 'empty' }}</td>
        <td style="background: blue">{{ bluePlayers[i - 1] ? bluePlayers[i - 1].name : 'empty' }}</td>
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
