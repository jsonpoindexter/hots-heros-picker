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
  private username: string = this.$store.state.user ? this.$store.state.user.name : ''
  @Watch('username')
  private onUsernameChanged(val: string, oldVal: string) {
    this.$store.dispatch('updateUsername', val)
  }
}
</script>
<style scoped></style>
