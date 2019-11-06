<template>
  <div>
    <h4>Choose Team</h4>
    <div>
      <button style="background: red" @click="selectTeam(Team.red)"></button>
      <button style="background: blue" @click="selectTeam(Team.blue)"></button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Team } from '@/store/types'
@Component({})
export default class SelectTeam extends Vue {
  private selectTeam(team: Team) {
    this.$store.dispatch('updateTeam', team)
  }
  get Team() {
    return Team
  }
}
</script>
<style scoped>
button {
  height: 100px;
  width: 100px;
}
</style>
