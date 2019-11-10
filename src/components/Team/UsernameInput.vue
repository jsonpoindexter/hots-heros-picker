<template>
  <label style="user-select: none;">
    <h4>UserName</h4>
    <input v-model.lazy="username" name="username" type="text" />
  </label>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'

@Component({})
export default class UsernameInput extends Vue {
  private username: string = localStorage.getItem('username') || ''
  @Watch('username')
  private onUsernameChanged(val: string, oldVal: string) {
    this.$store.dispatch('updateUsername', {id: this.$store.state.userId, username: val})
  }
}
</script>
<style scoped></style>
