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
  get username() {
    return this.$store.getters.user ? this.$store.getters.user.name : ''
  }
  set username(value: string) {
    this.$store.dispatch('updatePlayerName', {id: this.$store.state.userId, name: value})
  }
}
</script>
<style scoped></style>
