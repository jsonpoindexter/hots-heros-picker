<template>
  <div>
    <button @click="$store.dispatch('resetSession')">Reset Draft Session</button>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'

@Component({})
export default class ControlPanel extends Vue {}
</script>
<style scoped></style>
