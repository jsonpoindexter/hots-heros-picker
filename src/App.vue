<template>
  <div id="app">
    <h1>HoTS Draft Picker</h1>
    <ControlPanel></ControlPanel>
    <TeamPanel />
    <div class="heros">
      <Hero
        v-for="hero in heros"
        :name="hero.name"
        :url-name="hero.urlName"
        :selected="hero.selected"
        :disabled="!hasMinData"
        :team="team"
        :key="hero.name"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Hero from '@/components/Hero.vue'
import TeamPanel from '@/components/Team/index.vue'
import ControlPanel from '@/components/ControlPanel.vue'
import {Player, Team} from "@/store/types";
@Component({
  components: {
    ControlPanel,
    Hero,
    TeamPanel,
  },
})
export default class App extends Vue {
  get heros() {
    return this.$store.state.heros
  }

  get selectedHerosId() {
    return this.$store.getters.players.map((player: Player) => player.selectedId)
  }

  get team() {
    return this.$store.state.user ? Team[this.$store.state.user.team] : null
  }

  get hasUsername() {
    return !!(this.$store.state.user ? this.$store.state.user.name : '')
  }
  // Has filled out username and picked a team
  get hasMinData() {
    return this.hasUsername && this.team
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.heros {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 100px;
}
</style>
