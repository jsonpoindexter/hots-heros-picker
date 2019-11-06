<template>
  <div class="wrapper">
    <UsernameInput></UsernameInput>
    <SelectTeam />
    <Players></Players>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import SelectTeam from '@/components/Team/SelectTeam.vue'
import UsernameInput from '@/components/Team/UsernameInput.vue'
import Players from '@/components/Team/Players.vue'
@Component({
  components: {UsernameInput, SelectTeam, Players },
})
export default class TeamPanel extends Vue {}
</script>
<style scoped>
.wrapper {
  display: flex;
  justify-content: space-evenly;

}
button {
  height: 100px;
  width: 100px;
}
</style>
