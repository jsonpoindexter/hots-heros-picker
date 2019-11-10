<template>
  <div class="wrapper">
    <UsernameInput></UsernameInput>
    <SelectTeam />
    <Players></Players>
    <Banned />
  </div>
</template>
<script lang="ts">
import Banned from '@/components/Team/Banned.vue'
import Players from '@/components/Team/Players.vue'
import SelectTeam from '@/components/Team/SelectTeam.vue'
import UsernameInput from '@/components/Team/UsernameInput.vue'
import { Component, Vue } from 'vue-property-decorator'
@Component({
  components: { Banned, UsernameInput, SelectTeam, Players },
})
export default class TeamPanel extends Vue {}
</script>
<style scoped>
.wrapper {
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
}
button {
  height: 100px;
  width: 100px;
}
</style>
